import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { KNOWLEDGE_SEED } from "./knowledge-seed";

async function embed(text: string, apiKey: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: "text-embedding-3-small", input: text }),
  });
  if (!res.ok) throw new Error(`Embedding failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  return json.data[0].embedding as number[];
}

/** Retrieve top matching patient-education passages for a user query. */
export async function retrieveKnowledge(
  query: string,
  topK = 3,
): Promise<Array<{ question: string; answer: string; source: string; similarity: number }>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return [];
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const vec = await embed(query, apiKey);
    const { data, error } = await supabaseAdmin.rpc("match_knowledge", {
      query_embedding: vec as unknown as string,
      match_count: topK,
    });
    if (error) return [];
    return (data ?? []).filter((r: { similarity: number }) => r.similarity > 0.35);
  } catch {
    // Fallback: search seed directly if db RPC is not ready
    const qWords = query.toLowerCase().split(/\s+/);
    return KNOWLEDGE_SEED.map((doc) => {
      const matchScore = qWords.reduce((score, word) => {
        if (doc.question.toLowerCase().includes(word)) score += 0.2;
        if (doc.answer.toLowerCase().includes(word)) score += 0.1;
        return score;
      }, 0);
      return { ...doc, similarity: Math.min(matchScore, 1) };
    })
      .filter((doc) => doc.similarity > 0.2)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
}

/** Admin action: (re)embed the curated seed docs. Idempotent — wipes and re-inserts. */
export const seedKnowledge = createServerFn({ method: "POST" }).handler(async () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  try {
    await supabaseAdmin.from("knowledge_docs").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const rows: Array<{ question: string; answer: string; source: string; tags: string[]; embedding: number[] }> = [];
    for (const doc of KNOWLEDGE_SEED) {
      const vec = await embed(`${doc.question}\n${doc.answer}`, apiKey);
      rows.push({ ...doc, embedding: vec });
      await new Promise((r) => setTimeout(r, 50));
    }

    const { error } = await supabaseAdmin
      .from("knowledge_docs")
      .insert(rows as unknown as never);
    if (error) throw new Error(error.message);

    return { inserted: rows.length };
  } catch (err) {
    console.error("Failed to seed knowledge base in Supabase:", err);
    return { inserted: 0, error: err instanceof Error ? err.message : String(err) };
  }
});

export const countKnowledge = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("knowledge_docs")
      .select("*", { count: "exact", head: true });
    return { count: count ?? 0 };
  } catch {
    return { count: KNOWLEDGE_SEED.length };
  }
});

const Message = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(4000),
});

const BASE_SYSTEM = `You are MamaRoute — a maternal healthcare assistant for women in Nigeria.

Rules you MUST follow:
- ALWAYS prioritize patient safety. If the user describes ANY emergency signs (heavy bleeding, severe abdominal pain, severe headache with blurred vision, convulsions, fever above 38.5C, reduced fetal movement, severe contractions before 37 weeks, water broken with green/brown fluid), tell them to use the SOS button or call the 24/7 Emergency Maternal Hotline (Nigeria) at +234 704 585 5451 IMMEDIATELY.
- You are NOT a replacement for professional medical care. Always recommend visiting a hospital or qualified midwife for diagnosis.
- Be warm, concise, and use simple plain English (the user may also write in Pidgin, Hausa, or Yoruba — respond in their language when possible).
- Cover maternal health, prenatal nutrition, common pregnancy symptoms, appointment reminders, and basic health education.
- Never prescribe medication or dosages. Suggest the user ask their doctor.
- Keep replies under 150 words unless asked for more detail.
- When a REFERENCE ANSWERS section is provided, use it as your primary source and cite the source name naturally (e.g. "According to WHO guidance, …"). Do not invent facts beyond the reference.`;

export const chatWithAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ messages: z.array(Message).min(1).max(40) }).parse(data))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    try {
      const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
      const retrieved = lastUser ? await retrieveKnowledge(lastUser.content, 3) : [];

      let systemPrompt = BASE_SYSTEM;
      if (retrieved.length > 0) {
        const refBlock = retrieved
          .map((r, i) => `[${i + 1}] Q: ${r.question}\nA: ${r.answer}\nSource: ${r.source}`)
          .join("\n\n");
        systemPrompt += `\n\nREFERENCE ANSWERS (use these as your primary source):\n${refBlock}`;
      }

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemPrompt }, ...data.messages],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        if (res.status === 429) throw new Error("Too many requests. Please wait a moment and try again.");
        throw new Error(`OpenAI error (${res.status}): ${text.slice(0, 200)}.`);
      }

      const json = await res.json();
      const reply: string | undefined = json?.choices?.[0]?.message?.content;
      if (!reply) {
        throw new Error("The assistant could not generate a reply.");
      }

      return {
        reply,
        sources: retrieved.map((r) => ({ source: r.source, similarity: r.similarity })),
      };
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : "Something went wrong talking to the assistant.");
    }
  });

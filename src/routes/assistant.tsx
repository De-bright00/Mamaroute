import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Coins, CornerDownLeft, Loader2, Send, ShieldAlert, Sparkles, User, AlertCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteShell } from "@/components/SiteShell";
import { useAuth } from "@/hooks/useAuth";
import { chatWithAssistant, countKnowledge } from "@/lib/assistant.functions";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Maternal Assistant — MamaRoute" },
      { name: "description", content: "Talk with MamaRoute's maternal health assistant for safe, automated guidance." },
    ],
  }),
  component: Assistant,
});

type Message = { role: "user" | "assistant" | "system"; content: string };

const SUGGESTIONS = [
  "What are pregnancy danger signs?",
  "What should I eat during the first trimester?",
  "How often should I go for checkups?",
  "Is mild leg swelling normal?",
];

// Keywords that indicate clinical emergencies
const EMERGENCY_KEYWORDS = [
  "blood", "bleed", "bleeding", "pain", "severe", "headache", "vision", "cramp", 
  "contraction", "break", "rupture", "faint", "dizzy", "unconscious", "emergency", 
  "convulsion", "seizure", "cramping"
];

function Assistant() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const chatFn = useServerFn(chatWithAssistant);
  const countFn = useServerFn(countKnowledge);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your MamaRoute Maternal Health Assistant. Ask me anything about prenatal health, nutrition, check-up schedules, or symptom guidance. Note: I am not a doctor — for any emergencies, please use the SOS button immediately.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSosAlert, setShowSosAlert] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Monitor typing to detect emergency keywords in real-time
  useEffect(() => {
    const hasEmergencyWord = EMERGENCY_KEYWORDS.some(word => 
      input.toLowerCase().includes(word)
    );
    setShowSosAlert(hasEmergencyWord);
  }, [input]);

  // Also check message history for clinical attention warning signs
  useEffect(() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (lastUserMsg) {
      const hasEmergencyWord = EMERGENCY_KEYWORDS.some(word => 
        lastUserMsg.content.toLowerCase().includes(word)
      );
      if (hasEmergencyWord) {
        setShowSosAlert(true);
      }
    }
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const docCountQuery = useQuery({
    queryKey: ["knowledge", "count"],
    queryFn: () => countFn({}),
  });

  const send = async (textToSend: string) => {
    if (!textToSend.trim() || busy) return;
    setError(null);
    setBusy(true);

    const userMessage: Message = { role: "user", content: textToSend };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");

    try {
      const res = await chatFn({ data: { messages: nextMessages } });
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    } catch (e) {
      console.error(e);
      let errMsg = "An error occurred. Please try again.";
      if (e instanceof Error) {
        if (e.message.includes("OUT_OF_CREDITS")) {
          errMsg = "You are out of AI credits. Please top up your account to continue chatting.";
        } else {
          errMsg = e.message;
        }
      }
      setError(errMsg);
    } finally {
      setBusy(false);
    }
  };

  const handleSuggestion = (s: string) => {
    send(s);
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 py-6 grid md:grid-cols-4 gap-6 items-stretch min-h-[80vh]">
        {/* Sidebar Info */}
        <div className="md:col-span-1 rounded-2xl border border-border bg-card p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary">
                <Bot className="h-5 w-5" />
              </span>
              <h2 className="font-display font-bold text-primary text-sm">AI Assistant</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Powered by OpenAI GPT-4o-mini and verified Nigerian maternal guidelines.
            </p>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-sos">System Status</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                OpenAI Support Active
              </div>
              <div className="text-[10px] text-muted-foreground">
                Knowledge Base: {docCountQuery.data?.count ?? 0} topics loaded
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-6">
            <div className="rounded-xl bg-accent/60 p-3 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary">
                <Coins className="h-4 w-4 text-sos" /> Ledger Credits
              </div>
              <p className="text-[10px] text-muted-foreground">Free sandbox enabled for custom Supabase backends.</p>
              <Link to="/credits" className="block text-xs font-bold text-sos hover:underline">
                Manage Credits →
              </Link>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-3 rounded-2xl border border-border bg-card flex flex-col justify-between overflow-hidden shadow-sm h-[75vh]">
          {/* Header */}
          <div className="p-4 border-b border-border bg-accent/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-display font-semibold text-primary text-sm">Maternal QA Session</span>
            </div>
            <Link to="/sos" className="rounded-lg bg-sos/10 text-sos border border-sos/20 px-2.5 py-1 text-xs font-semibold hover:bg-sos hover:text-sos-foreground transition-all">
              🚨 Use SOS Portal
            </Link>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-accent/5">
            {messages.map((m, i) => {
              const isAi = m.role === "assistant";
              return (
                <div key={i} className={`flex gap-3 max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    isAi ? "bg-accent text-primary" : "bg-sos text-sos-foreground"
                  }`}>
                    {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </span>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    isAi ? "bg-card text-foreground border border-border" : "bg-sos text-sos-foreground"
                  }`}>
                    {m.content}
                  </div>
                </div>
              );
            })}
            {busy && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="rounded-2xl bg-card border border-border px-4 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-sos" /> AI is typing...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Warning SOS Trigger Banner */}
          {showSosAlert && (
            <div className="mx-4 my-2 p-3 bg-sos/10 border border-sos/20 rounded-xl flex items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-2 text-sos text-xs font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Maternal emergency indicator detected. Clinical attention may be required.</span>
              </div>
              <button 
                onClick={() => navigate({ to: "/sos" })}
                className="shrink-0 rounded-lg bg-sos text-sos-foreground px-3 py-1.5 text-xs font-bold shadow-sos hover:opacity-95 cursor-pointer"
              >
                🚨 Trigger SOS Now
              </button>
            </div>
          )}

          {/* Bottom input area */}
          <div className="p-4 border-t border-border bg-card">
            {messages.length === 1 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-xs rounded-full border border-input bg-background px-3 py-1.5 hover:bg-accent text-muted-foreground hover:text-primary transition-all cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {error && <div className="mb-3 text-xs text-sos font-semibold">{error}</div>}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                required
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your maternal health question... (e.g. pain, bleeding, checkups)"
                className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sos/50 focus:border-sos transition-all"
                disabled={busy}
              />
              <button
                disabled={busy || !input.trim()}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sos text-sos-foreground shadow-sos disabled:opacity-50 cursor-pointer"
                type="submit"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="font-display font-semibold text-lg text-primary">{title}</h3>
      {children}
    </div>
  );
}

function Item({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className={`h-4 w-4 mt-0.5 ${done ? "text-sos" : "text-muted-foreground/30"}`} />
      <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </li>
  );
}

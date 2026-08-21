import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, Send, User, AlertCircle } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useAuth } from "@/hooks/useAuth";
import { chatWithAssistant } from "@/lib/assistant.functions";

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
  const { isAuthenticated, loading: authLoading } = useAuth();
  const chatFn = useServerFn(chatWithAssistant);

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

  if (!authLoading && !isAuthenticated) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-md px-5 py-24 text-center space-y-4">
          <Bot className="h-12 w-12 text-sos mx-auto" />
          <h2 className="text-xl font-display font-bold text-primary">Sign in to chat with the assistant.</h2>
          <p className="text-sm text-muted-foreground">Please log in to your patient account to access the AI maternal guide.</p>
          <Link to="/auth" className="inline-flex rounded-xl bg-sos text-sos-foreground px-6 py-3 font-semibold shadow-sos hover:opacity-95 transition-opacity">
            Sign in
          </Link>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-6 min-h-[80vh] flex flex-col justify-center">
        {/* Chat Area */}
        <div className="rounded-2xl border border-border bg-card flex flex-col justify-between overflow-hidden shadow-sm h-[75vh]">
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



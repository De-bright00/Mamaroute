import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — MamaRoute" },
      { name: "description", content: "Choose a new password for your MamaRoute account." },
      { property: "og:title", content: "Set a new password — MamaRoute" },
      { property: "og:description", content: "Choose a new password for your MamaRoute account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setErr(
        /weak|pwned|easy to guess/i.test(error.message)
          ? "That password is too common. Use a longer, unique password (8+ characters)."
          : error.message,
      );
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/sos" }), 1200);
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-md px-5 py-12">
        <div className="text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sos text-sos-foreground shadow-sos">
            <KeyRound className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl md:text-3xl font-display font-bold text-primary">Set a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Open this page from the reset link in your email, then choose a new password.
          </p>
        </div>

        {err && <div className="mt-4 rounded-xl bg-sos/10 text-sos text-sm px-4 py-3">{err}</div>}
        {done && <div className="mt-4 rounded-xl bg-accent text-primary text-sm px-4 py-3">Password updated. Redirecting…</div>}

        <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
          <label className="block">
            <span className="block text-xs font-semibold text-primary mb-1.5">New password</span>
            <div className="relative">
              <input
                required
                minLength={8}
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 pr-11 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          <button disabled={busy} className="w-full rounded-xl bg-sos text-sos-foreground px-5 py-3 font-semibold shadow-sos disabled:opacity-60">
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/auth" className="text-xs text-muted-foreground hover:text-primary">← Back to sign in</Link>
        </div>
      </section>
    </SiteShell>
  );
}

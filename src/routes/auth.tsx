import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, PhoneCall, ShieldCheck, Mail, Eye, EyeOff } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Register / Sign in — MamaRoute" },
      { name: "description", content: "Create your maternal emergency profile." },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup";

const LANGUAGES = [
  { v: "en", l: "English" },
  { v: "pcm", l: "Pidgin" },
  { v: "ha", l: "Hausa" },
  { v: "yo", l: "Yoruba" },
];

const PREG = ["1st trimester", "2nd trimester", "3rd trimester", "Postpartum", "Trying to conceive"];
const BLOOD = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function AuthPage() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [role, setRole] = useState<"patient" | "hospital">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // profile fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+234");
  const [pregnancy, setPregnancy] = useState(PREG[1]);
  const [dueDate, setDueDate] = useState("");
  const [lang, setLang] = useState("en");
  const [ecName, setEcName] = useState("");
  const [ecPhone, setEcPhone] = useState("+234");
  const [blood, setBlood] = useState("");

  useEffect(() => {
    if (loading) return;
    if (user) {
      if (role === "hospital") {
        navigate({ to: "/hospital-dashboard" });
      } else if (profile) {
        navigate({ to: "/sos" });
      } else {
        setShowProfile(true);
      }
    }
  }, [user, profile, loading, navigate, role]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setInfo(null); setBusy(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + "/auth" },
      });
      setBusy(false);
      if (error) {
        if (/already registered/i.test(error.message)) {
          setMode("signin");
          setErr("This email already has an account. Please sign in instead.");
        } else if (/weak|pwned|easy to guess/i.test(error.message)) {
          setErr("That password is too common. Use a longer, unique password (8+ characters).");
        } else setErr(error.message);
        return;
      }
      if (!data.session) setInfo("Check your email to confirm your account, then sign in.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      if (/invalid login credentials/i.test(error.message)) {
        setErr("Email or password is incorrect. If you signed up with Google, use “Continue with Google”. If you just registered, confirm your email first, or reset your password below.");
      } else if (/not confirmed/i.test(error.message)) {
        setErr("Please confirm your email address first — check your inbox for the confirmation link.");
      } else setErr(error.message);
    }
  };

  const handleReset = async () => {
    setErr(null); setInfo(null);
    if (!email) return setErr("Enter your email address first, then tap “Forgot password”.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) return setErr(error.message);
    setInfo("Password reset link sent. Check your email.");
  };

  const handleGoogle = async () => {
    setErr(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/auth",
      },
    });
    if (error) setErr(error.message ?? "Google sign-in failed");
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErr(null); setBusy(true);
    const { error } = await supabase.from("profiles").insert({
      user_id: user.id,
      full_name: fullName,
      phone,
      pregnancy_status: pregnancy,
      due_date: dueDate || null,
      preferred_language: lang,
      emergency_contact_name: ecName,
      emergency_contact_phone: ecPhone,
      blood_group: blood || null,
    });
    setBusy(false);
    if (error) return setErr(error.message);
    setTimeout(() => navigate({ to: role === "hospital" ? "/hospital-dashboard" : "/sos" }), 400);
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-md px-5 py-12">
        <div className="text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sos text-sos-foreground shadow-sos">
            <Heart className="h-6 w-6" fill="currentColor" />
          </span>
          <h1 className="mt-4 text-2xl md:text-3xl font-display font-bold text-primary">
            {showProfile ? "Complete your maternal profile" : (mode === "signup" ? "Create your account" : "Welcome back")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {showProfile
              ? "We attach this to every emergency request."
              : "Email or Google. Phone number is collected in your profile (no SMS verification required)."}
          </p>
        </div>

        {err && <div className="mt-4 rounded-xl bg-sos/10 text-sos text-sm px-4 py-3">{err}</div>}
        {info && <div className="mt-4 rounded-xl bg-accent text-primary text-sm px-4 py-3">{info}</div>}

        {!showProfile && (
          <div className="mt-6 flex gap-2 p-1 bg-accent/40 rounded-xl">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                role === "patient" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-primary"
              }`}
            >
              Patient Account
            </button>
            <button
              type="button"
              onClick={() => setRole("hospital")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                role === "hospital" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-primary"
              }`}
            >
              Hospital Partner
            </button>
          </div>
        )}

        {!showProfile && (
          <div className="mt-4 space-y-4 rounded-2xl border border-border bg-card p-6">
            <button onClick={handleGoogle} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-5 py-3 text-sm font-semibold hover:bg-accent">
              <GoogleIcon /> Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or</span></div>
            </div>

            <form onSubmit={handleEmail} className="space-y-3">
              <Field label="Email">
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
              </Field>
              <Field label="Password">
                <div className="relative">
                  <input
                    required
                    type={showPw ? "text" : "password"}
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    style={{ paddingRight: "2.75rem" }}
                    placeholder="••••••••"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
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
              </Field>
              <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sos text-sos-foreground px-5 py-3 font-semibold shadow-sos disabled:opacity-60">
                <Mail className="h-4 w-4" /> {busy ? "Please wait…" : (mode === "signup" ? "Create account" : "Sign in")}
              </button>
            </form>

            {mode === "signin" && (
              <button onClick={handleReset} type="button" className="w-full text-xs font-semibold text-sos hover:underline">
                Forgot password?
              </button>
            )}

            <button onClick={() => { setErr(null); setInfo(null); setMode(mode === "signup" ? "signin" : "signup"); }} className="w-full text-xs text-muted-foreground hover:text-primary">
              {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
          </div>
        )}

        {showProfile && user && (
          <form onSubmit={saveProfile} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
            <Field label="Full Name *">
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
            </Field>
            <Field label="Phone Number * (no SMS verification required)">
              <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="+2348012345678" />
            </Field>
            <Field label="Pregnancy Status *">
              <select required value={pregnancy} onChange={(e) => setPregnancy(e.target.value)} className="input">
                {PREG.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Estimated Due Date">
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
            </Field>
            <Field label="Preferred Language *">
              <select required value={lang} onChange={(e) => setLang(e.target.value)} className="input">
                {LANGUAGES.map((l) => <option key={l.v} value={l.v}>{l.l}</option>)}
              </select>
            </Field>
            <div className="border-t border-border pt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-sos mb-3">Emergency contact</div>
              <Field label="Contact Name *">
                <input required value={ecName} onChange={(e) => setEcName(e.target.value)} className="input" />
              </Field>
              <Field label="Contact Phone *">
                <input required type="tel" value={ecPhone} onChange={(e) => setEcPhone(e.target.value)} className="input" />
              </Field>
            </div>
            <Field label="Blood Group (optional)">
              <select value={blood} onChange={(e) => setBlood(e.target.value)} className="input">
                {BLOOD.map((b) => <option key={b} value={b}>{b || "—"}</option>)}
              </select>
            </Field>
            <button disabled={busy} className="w-full rounded-xl bg-sos text-sos-foreground px-5 py-3 font-semibold shadow-sos disabled:opacity-60">
              {busy ? "Saving…" : "Save profile & continue"}
            </button>
            <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
              <ShieldCheck className="h-3 w-3" /> SMS notifications are a production feature — see Settings.
            </p>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary">← Back to home</Link>
        </div>

        <div className="mt-6 rounded-xl bg-accent/60 px-4 py-3 text-center text-xs text-primary">
          In an emergency right now, call{" "}
          <a href="tel:+2347045855451" className="font-semibold underline inline-flex items-center gap-1">
            <PhoneCall className="h-3 w-3" /> +234 704 585 5451
          </a>
        </div>
      </section>

      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid hsl(var(--input));background:hsl(var(--background));padding:0.625rem 0.75rem;font-size:0.875rem}`}</style>
    </SiteShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-primary mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 11v3.2h5.4c-.2 1.4-1.6 4-5.4 4-3.2 0-5.9-2.7-5.9-6s2.6-6 5.9-6c1.8 0 3.1.8 3.8 1.4l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6L12 11z"/>
    </svg>
  );
}

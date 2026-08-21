import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, Bot, Building2, Hospital, PhoneCall, Send, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MamaRoute — Emergency Access Infrastructure for Maternal Healthcare" },
      { name: "description", content: "MamaRoute is a maternal emergency coordination platform connecting pregnant women in crisis to nearby hospitals across Nigeria." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      {/* 1. Hero */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: "url('/hero-mama.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/10 md:from-primary/85 md:via-primary/55 md:to-transparent" aria-hidden />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 10%, white, transparent 40%), radial-gradient(circle at 80% 80%, var(--color-sos), transparent 50%)" }} aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="mt-5 text-4xl md:text-6xl font-display font-bold leading-[1.05]">
              Emergency Access Infrastructure <span className="text-sos">for Maternal Healthcare</span>.
            </h1>
            <p className="mt-5 text-lg opacity-85 max-w-xl">
              MamaRoute is a maternal emergency coordination platform connecting women in distress with nearby hospitals, and a 24/7 hotline.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/sos" className="inline-flex items-center gap-2 rounded-xl bg-sos px-5 py-3 font-semibold text-sos-foreground shadow-sos hover:opacity-95">
                <Activity className="h-5 w-5" /> SOS
              </Link>
              <Link to="/assistant" className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur px-5 py-3 font-semibold hover:bg-white/15">
                <Bot className="h-5 w-5" /> Talk to AI Assistant
              </Link>
              <Link to="/hospitals" className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur px-5 py-3 font-semibold hover:bg-white/15">
                <Hospital className="h-5 w-5" /> View Hospitals
              </Link>
            </div>
            <a href="tel:+2347045855451" className="mt-5 inline-flex items-center gap-3 rounded-2xl border-2 border-white/40 bg-white/5 px-5 py-3 backdrop-blur hover:bg-white/10">
              <PhoneCall className="h-5 w-5 text-sos" />
              <div className="text-left">
                <div className="text-[11px] uppercase tracking-wider opacity-80">24/7 Emergency Maternal Hotline (Nigeria)</div>
                <div className="font-display font-bold text-lg leading-tight">+234 704 585 5451</div>
                <div className="text-[11px] opacity-80">Call now for offline emergency support</div>
              </div>
            </a>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-md rounded-3xl bg-white/10 backdrop-blur border border-white/15 p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-80">SOS</span>
              </div>
              <div className="mt-5 flex items-center justify-center">
                <Link to="/sos" className="relative h-44 w-44 rounded-full bg-sos text-sos-foreground shadow-sos pulse-ring inline-flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center">
                    <Activity className="h-8 w-8" />
                    <span className="mt-2 font-display font-bold text-xl">SOS</span>
                    <span className="text-[10px] opacity-90">Just Tap&nbsp;</span>
                  </div>
                </Link>
              </div>
              <p className="mt-5 text-xs opacity-80 text-center">
                An SOS dispatches your location and profile to nearby partner hospitals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sos">The problem</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-primary">
              Too many Nigerian mothers die from preventable delays.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Nigeria accounts for nearly 28% of global maternal deaths. Most are caused by delays in deciding to seek care, reaching a facility, and receiving treatment — the "three delays".
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { v: "~993", l: "Maternal deaths per 100,000 live births in Nigeria (WHO 2023)" },
              { v: "1 in 4", l: "Global maternal deaths happen in Nigeria" },
              { v: "Hours", l: "Common delay before reaching a hospital with capacity" },
              { v: "Few", l: "Coordinated emergency routes between patients and facilities" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
                <div className="font-display font-bold text-2xl text-sos">{s.v}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Solution */}
      <section className="bg-accent/60">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="max-w-2xl">
            <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-primary">A simple coordination layer for maternal emergencies.</h2>
            <p className="mt-3 text-muted-foreground">Three focused pieces working together — built to be realistic.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Activity, title: "One-tap SOS", text: "Captures location and dispatches an instant alert to nearby partner hospitals." },
              { icon: Bot, title: "AI maternal assistant", text: "Safe maternal guidance with built-in detection of danger signs that trigger emergency UI." },
              { icon: Hospital, title: "Hospital Directory", text: "Find verified healthcare providers and maternal care facilities in Abuja and Lagos." },
              { icon: PhoneCall, title: "Hotline workflow", text: "Hotline agents log cases and notify the nearest hospital in real time." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-semibold text-lg">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">How it works</h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-4">
          {[
            { icon: AlertTriangle, title: "Emergency occurs", text: "A pregnant woman experiences danger signs at home or in transit." },
            { icon: Activity, title: "SOS or Hotline activated", text: "She taps SOS in the app or calls the 24/7 hotline." },
            { icon: Hospital, title: "Hospital receives instant alert", text: "Partner hospitals receive an instant alert with patient location and urgency level." },
            { icon: Send, title: "Care is coordinated", text: "Hospital accepts, prepares the maternity ward and confirms back." },
          ].map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
              <span className="absolute -top-3 left-6 inline-flex h-7 w-7 items-center justify-center rounded-full bg-sos text-sos-foreground text-xs font-bold">{i + 1}</span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. Hospital partner section */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              <Building2 className="h-3.5 w-3.5" /> For hospitals
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-display font-bold">Partner with MamaRoute</h2>
            <p className="mt-3 opacity-85 max-w-lg">
              Hospitals onboard to receive maternal emergency requests from their catchment area. Onboarding is free.
            </p>
            <Link to="/hospital-onboarding" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sos text-sos-foreground px-5 py-3 font-semibold shadow-sos">
              Onboard your hospital →
            </Link>
          </div>
          <ul className="grid gap-3 text-sm">
            {[
              "Receive structured emergency requests with patient location",
              "Accept, decline or mark cases as resolved",
              "Indicate ward capacity and walk-in availability",
              "No integration required — works in any browser",
            ].map((t) => (
              <li key={t} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="mx-auto max-w-4xl px-5 py-20 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-primary">Get help faster.</h2>
        <p className="mt-4 text-muted-foreground">Or onboard your facility to the network.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/sos" className="inline-flex items-center gap-2 rounded-xl bg-sos text-sos-foreground px-5 py-3 font-semibold shadow-sos">
            <Activity className="h-5 w-5" /> Send SOS
          </Link>
          <Link to="/hospital-onboarding" className="inline-flex items-center gap-2 rounded-xl border border-input px-5 py-3 font-semibold hover:bg-accent">
            <Building2 className="h-5 w-5" /> Onboard a hospital
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

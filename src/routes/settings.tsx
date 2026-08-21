import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare, ShieldCheck, Sparkles, LogOut } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Settings — MamaRoute" },
    { name: "description", content: "Manage your maternal profile and notification preferences." },
  ] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, profile, loading } = useAuth();

  if (!loading && !user) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-md px-5 py-16 text-center">
          <h1 className="text-2xl font-display font-bold text-primary">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your profile.</p>
          <Link to="/auth" className="mt-6 inline-block rounded-xl bg-sos text-sos-foreground px-5 py-3 font-semibold shadow-sos">Sign in</Link>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-2xl px-5 py-12 space-y-6">
        <header>
          <h1 className="text-3xl font-display font-bold text-primary">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your account and notification preferences.</p>
        </header>

        {profile && (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display font-semibold text-lg text-primary">Profile</h2>
            <Row k="Name" v={profile.full_name} />
            <Row k="Phone" v={profile.phone} />
            <Row k="Pregnancy" v={profile.pregnancy_status} />
            <Row k="Emergency contact" v={`${profile.emergency_contact_name} · ${profile.emergency_contact_phone}`} />
            {profile.blood_group && <Row k="Blood group" v={profile.blood_group} />}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display font-semibold text-lg text-primary flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-sos" /> Notifications
          </h2>

          <div className="mt-4 flex items-start justify-between gap-4 rounded-xl bg-accent p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">SMS Notifications</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" /> Production Feature
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                SMS dispatch to your emergency contact is queued but not sent. Integrations are wired for{" "}
                <strong className="text-primary">Termii</strong> and <strong className="text-primary">Twilio</strong> when an API key is configured.
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2 py-1 text-[11px] font-medium">
              <ShieldCheck className="h-3 w-3" /> Queued
            </span>
          </div>

          <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
            <ProviderRow name="Termii" />
            <ProviderRow name="Twilio" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-lg text-primary">Account</h2>
            <p className="text-xs text-muted-foreground mt-1">Signed in as {user?.email ?? user?.id}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-2 rounded-xl border border-input px-4 py-2 text-sm font-semibold hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </section>
    </SiteShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-sm border-b border-border/60 last:border-0 pb-2 last:pb-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-primary text-right">{v}</span>
    </div>
  );
}

function ProviderRow({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
      <span className="font-medium text-primary">{name}</span>
      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Not configured</span>
    </div>
  );
}

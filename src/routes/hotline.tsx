import { createFileRoute } from "@tanstack/react-router";
import { PhoneCall, ShieldAlert } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/hotline")({
  head: () => ({ meta: [
    { title: "24/7 Emergency Hotline — MamaRoute" },
    { name: "description", content: "Offline-first hotline for emergency support across Nigeria." },
  ] }),
  component: Hotline,
});

function Hotline() {
  return (
    <SiteShell>
      <section className="gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-display font-bold">MamaRoute Emergency Support Line</h1>
          <p className="mt-4 mx-auto max-w-2xl text-base md:text-lg opacity-90">
            No smartphone? No internet access? Call our support line and speak directly with a member of the MamaRoute team for assistance during medical emergencies and healthcare access challenges.
          </p>
          <a
            href="tel:+2347045855451"
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-sos px-6 py-4 font-display font-bold text-2xl text-sos-foreground shadow-sos hover:opacity-95"
          >
            <PhoneCall className="h-6 w-6" /> +234 704 585 5451
          </a>
          <p className="mt-3 text-xs opacity-80">24/7 Emergency Maternal Hotline (Nigeria)</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 flex items-start gap-4">
          <ShieldAlert className="h-6 w-6 text-sos shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-semibold text-primary">Important notice</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              MamaRoute is currently expanding its healthcare provider network across Nigeria. Service availability may vary by location.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Activity, AlertTriangle, Ambulance, BookOpen, Building2, Loader2, Users } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { EMERGENCIES, HOSPITALS } from "@/lib/mockData";
import { countKnowledge, seedKnowledge } from "@/lib/assistant.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Admin dashboard — MamaRoute.AI" },
    { name: "description", content: "Monitor emergencies, hospitals and users across the network." },
  ] }),
  component: Admin,
});

const STATS = [
  { icon: AlertTriangle, label: "Active emergency requests", value: "3", tint: "text-sos" },
  { icon: Building2, label: "Partner hospitals in network", value: "6", tint: "text-secondary" },
  { icon: Ambulance, label: "Hospitals pending review", value: "0", tint: "text-primary" },
  { icon: Users, label: "Registered users", value: "—", tint: "text-secondary" },
];

function Admin() {
  const seedFn = useServerFn(seedKnowledge);
  const countFn = useServerFn(countKnowledge);
  const [kbCount, setKbCount] = useState<number | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  useEffect(() => { countFn().then((r) => setKbCount(r.count)).catch(() => setKbCount(null)); }, [countFn]);

  const runSeed = async () => {
    setSeeding(true); setSeedMsg(null);
    try {
      const r = await seedFn();
      setSeedMsg(`✓ Indexed ${r.inserted} patient-education passages.`);
      const c = await countFn(); setKbCount(c.count);
    } catch (e) {
      setSeedMsg(`⚠️ ${e instanceof Error ? e.message : "Failed"}`);
    } finally { setSeeding(false); }
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">Admin overview</h1>
            <p className="mt-1 text-muted-foreground">Internal monitoring view.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent text-primary px-3 py-1.5 text-xs font-semibold">
            Operations
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display font-semibold text-primary">AI knowledge base</h3>
              <p className="text-sm text-muted-foreground">
                Curated WHO/NHS patient-education passages used by the assistant (RAG).{" "}
                {kbCount === null ? "" : <span className="font-semibold text-primary">{kbCount} passages indexed.</span>}
              </p>
              {seedMsg && <p className="text-xs mt-1 text-muted-foreground">{seedMsg}</p>}
            </div>
          </div>
          <button onClick={runSeed} disabled={seeding}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
            {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
            {seeding ? "Indexing…" : kbCount ? "Re-index knowledge" : "Index knowledge base"}
          </button>
        </div>


        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent ${s.tint}`}>
                  <s.icon className="h-5 w-5" />
                </span>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-4 font-display font-bold text-3xl text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold">Recent emergency requests</h3>
              <a className="text-xs text-secondary font-semibold">View all</a>
            </div>
            <div className="divide-y divide-border">
              {EMERGENCIES.map((e) => (
                <div key={e.id} className="px-5 py-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-primary">{e.patient}</div>
                    <div className="text-sm text-muted-foreground">{e.condition} · {e.hospital}</div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block text-[11px] font-semibold rounded-full px-2 py-1 ${
                      e.status === "Resolved" ? "bg-muted text-muted-foreground" :
                      e.status.includes("Awaiting") ? "bg-sos/10 text-sos" :
                      "bg-accent text-primary"
                    }`}>{e.status}</span>
                    <div className="text-xs text-muted-foreground mt-1">{e.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-display font-semibold">Hospital network status</h3>
            </div>
            <div className="divide-y divide-border">
              {HOSPITALS.slice(0, 5).map((h) => (
                <div key={h.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-primary">{h.name}</div>
                    <div className="text-xs text-muted-foreground">{h.state} · {h.ambulances} ambulances</div>
                  </div>
                  <span className={`h-2.5 w-2.5 rounded-full ${h.available ? "bg-sos" : "bg-muted-foreground/40"}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

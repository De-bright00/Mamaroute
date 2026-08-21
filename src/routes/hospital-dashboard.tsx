import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  Ambulance,
  Bed,
  Bell,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Minus,
  Navigation,
  Phone,
  Plus,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  User,
  Users,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/hospital-dashboard")({
  head: () => ({
    meta: [
      { title: "Hospital Partner Dashboard — MamaRoute" },
      {
        name: "description",
        content:
          "A centralized platform for verified healthcare facilities to manage emergency requests, ambulance coordination, patient referrals, and availability status.",
      },
    ],
  }),
  component: HospitalDashboard,
});

type EmergencyAlert = {
  id: string;
  patientName: string;
  phone: string;
  area: string;
  condition: string;
  distance: string;
  timeReceived: string;
  status: "pending" | "accepted" | "declined";
  etaSeconds?: number;
};

function HospitalDashboard() {
  // Real-time capacity stats
  const [beds, setBeds] = useState(8);
  const [ambulances, setAmbulances] = useState(2);
  const [isAvailable, setIsAvailable] = useState(true);

  // Emergency dispatches list
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([
    {
      id: "1",
      patientName: "Aisha Bello",
      phone: "+234 809 111 2222",
      area: "Ikeja, Lagos",
      condition: "Severe Bleeding / Postpartum Haemorrhage (PPH)",
      distance: "2.3 km away",
      timeReceived: "Just Now",
      status: "pending",
    },
  ]);

  // Timers list for active dispatches
  const [activeEta, setActiveEta] = useState<number | null>(null);

  useEffect(() => {
    if (activeEta === null || activeEta <= 0) return;
    const interval = setInterval(() => {
      setActiveEta((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeEta]);

  const handleAccept = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "accepted" } : a))
    );
    // Decrement available ambulance by 1 if there are any
    if (ambulances > 0) {
      setAmbulances((prev) => prev - 1);
    }
    // Set 12-minute ETA timer (720 seconds)
    setActiveEta(720);
  };

  const handleDecline = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "declined" } : a))
    );
  };

  const formatEta = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <SiteShell>
      {/* Header and status bar */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 text-xs font-semibold border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified Hospital Node: LASUTH
                </span>
                <span className="text-xs opacity-75">Facility ID: H-894-LGS</span>
              </div>
              <h1 className="mt-2 text-2xl md:text-3xl font-display font-bold">
                Hospital Partner Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Network Dispatch Status:</span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm ${
                  isAvailable
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-sos text-white hover:bg-sos/95"
                }`}
              >
                {isAvailable ? "● Accepting Emergencies" : "● Offline / Diverting"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main dashboard panels */}
      <section className="mx-auto max-w-7xl px-5 py-10 grid gap-6 md:grid-cols-3">
        {/* Left column: Fleet and capacity management */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display font-bold text-primary text-base mb-4 flex items-center gap-2">
              <Bed className="h-5 w-5 text-sos" /> Maternity Bed Capacity
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Update available maternity beds in real-time so dispatchers do not route cases to a full ward.
            </p>
            <div className="flex items-center justify-between bg-accent/40 rounded-xl p-4 border border-border">
              <button
                onClick={() => setBeds(Math.max(0, beds - 1))}
                className="h-9 w-9 rounded-lg bg-background border border-border flex items-center justify-center text-primary hover:bg-accent cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="text-center">
                <span className="block text-2xl font-bold text-primary">{beds}</span>
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Active Beds</span>
              </div>
              <button
                onClick={() => setBeds(beds + 1)}
                className="h-9 w-9 rounded-lg bg-background border border-border flex items-center justify-center text-primary hover:bg-accent cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display font-bold text-primary text-base mb-4 flex items-center gap-2">
              <Ambulance className="h-5 w-5 text-sos" /> Ambulance Dispatch
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Coordinate and log fleet availability. Accepted dispatches deduct a unit automatically.
            </p>
            <div className="flex items-center justify-between bg-accent/40 rounded-xl p-4 border border-border">
              <button
                onClick={() => setAmbulances(Math.max(0, ambulances - 1))}
                className="h-9 w-9 rounded-lg bg-background border border-border flex items-center justify-center text-primary hover:bg-accent cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="text-center">
                <span className="block text-2xl font-bold text-primary">{ambulances}</span>
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Available Units</span>
              </div>
              <button
                onClick={() => setAmbulances(ambulances + 1)}
                className="h-9 w-9 rounded-lg bg-background border border-border flex items-center justify-center text-primary hover:bg-accent cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Center/Right columns: Live dispatches */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex-1">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h2 className="font-display font-bold text-primary text-base flex items-center gap-2">
                <Bell className="h-5 w-5 text-sos animate-swing" /> Live Dispatch Console
              </h2>
              <span className="text-xs rounded-full bg-sos/15 text-sos px-2.5 py-0.5 font-bold">
                1 Case Alert
              </span>
            </div>

            {alerts.filter(a => a.status === "pending").length > 0 ? (
              alerts.map((a) => (
                <div key={a.id} className="rounded-2xl border border-sos/30 bg-sos/5 p-5 animate-pulse">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded-full bg-sos text-sos-foreground px-2.5 py-0.5 text-[10px] font-bold">
                        🚨 EMERGENCY SOS
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-primary flex items-center gap-1.5">
                        <User className="h-4 w-4 text-muted-foreground" /> {a.patientName}
                      </h3>
                      <p className="text-sm font-semibold text-sos mt-1">{a.condition}</p>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> Location: {a.area} ({a.distance})
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> Received: {a.timeReceived}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                      <button
                        onClick={() => handleAccept(a.id)}
                        className="flex-1 sm:flex-initial rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold shadow-sm hover:bg-emerald-700 cursor-pointer"
                      >
                        Accept Dispatch
                      </button>
                      <button
                        onClick={() => handleDecline(a.id)}
                        className="flex-1 sm:flex-initial rounded-xl border border-border bg-background text-muted-foreground px-5 py-2.5 text-xs font-bold hover:bg-accent cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : alerts.filter(a => a.status === "accepted").length > 0 ? (
              alerts.filter(a => a.status === "accepted").map((a) => (
                <div key={a.id} className="rounded-2xl border border-emerald-300 bg-emerald-50/50 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-bold">
                        ✓ DISPATCH ACCEPTED
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-primary flex items-center gap-1.5">
                        <User className="h-4 w-4 text-muted-foreground" /> {a.patientName}
                      </h3>
                      <p className="text-sm font-semibold text-emerald-700 mt-1">{a.condition}</p>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> Destination: {a.area} ({a.distance})
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" /> Call Patient: {a.phone}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right bg-emerald-600/10 rounded-2xl p-4 border border-emerald-500/20 flex flex-col justify-center items-center">
                      <Clock className="h-5 w-5 text-emerald-700 animate-spin" />
                      <span className="block text-xl font-bold text-emerald-800 mt-1">
                        {activeEta !== null ? formatEta(activeEta) : "Arrived"}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-bold">
                        Ambulance ETA
                      </span>
                    </div>
                  </div>

                  {/* Directions map */}
                  <div className="rounded-xl overflow-hidden border border-border h-64 bg-muted relative">
                    <iframe
                      src="https://maps.google.com/maps?saddr=6.5984,3.3444&daddr=6.6184,3.3544&output=embed"
                      className="absolute inset-0 w-full h-full border-none"
                      title="Routing directions map"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border border-dashed border-border rounded-xl">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No active dispatches. The network is quiet.</p>
              </div>
            )}
          </div>

          {/* Patient outcomes log */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display font-bold text-primary text-base mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Patient Admissions Log
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-accent/20">
                    <th className="p-3 font-semibold text-muted-foreground">Patient</th>
                    <th className="p-3 font-semibold text-muted-foreground">Date / Time</th>
                    <th className="p-3 font-semibold text-muted-foreground">Indication</th>
                    <th className="p-3 font-semibold text-muted-foreground">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { name: "Chioma Nwachukwu", date: "2026-08-20 14:22", condition: "Pre-eclampsia (BP 160/110)", status: "Delivered Safely" },
                    { name: "Halima Musa", date: "2026-08-19 09:15", condition: "Obstructed Labour / Distress", status: "Delivered Safely" },
                    { name: "Blessing Johnson", date: "2026-08-18 23:40", condition: "Pre-term contractions (34 wks)", status: "Stabilized & Discharged" },
                  ].map((log, i) => (
                    <tr key={i} className="hover:bg-accent/10">
                      <td className="p-3 font-medium text-primary">{log.name}</td>
                      <td className="p-3 text-muted-foreground">{log.date}</td>
                      <td className="p-3 text-muted-foreground">{log.condition}</td>
                      <td className="p-3">
                        <span className="inline-flex rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

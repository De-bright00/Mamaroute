import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/hospital-onboarding")({
  head: () => ({ meta: [
    { title: "Hospital Onboarding — MamaRoute" },
    { name: "description", content: "Partner with MamaRoute and join our maternal emergency response network." },
  ] }),
  component: Onboarding,
});

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta",
  "Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina",
  "Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers",
  "Sokoto","Taraba","Yobe","Zamfara",
];

const SERVICES = ["Maternity Ward", "ICU", "Blood Bank", "Ambulance", "Surgery", "NICU"];

type FormState = {
  name: string; address: string; lga: string; state: string;
  contactName: string; phone: string; email: string;
  facilityType: "" | "Public" | "Private";
  careLevel: "" | "Primary" | "Secondary" | "Tertiary";
  services: string[];
  ambulances: number;
  hours: "" | "24 hours" | "Daytime only" | "Other";
  walkIns: boolean;
  notes: string;
};

const initial: FormState = {
  name: "", address: "", lga: "", state: "",
  contactName: "", phone: "", email: "",
  facilityType: "", careLevel: "",
  services: [], ambulances: 0,
  hours: "", walkIns: true, notes: "",
};

function Onboarding() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);

  const u = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleService = (s: string) =>
    setForm((f) => ({ ...f, services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s] }));

  const step1Valid = form.name && form.address && form.lga && form.state && form.contactName && form.phone && form.email;
  const step2Valid = form.facilityType && form.careLevel && form.hours;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step1Valid || !step2Valid) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-2xl px-5 py-20 text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sos/10 text-sos">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-6 text-3xl md:text-4xl font-display font-bold text-primary">Thank you!</h1>
          <p className="mt-4 text-muted-foreground">
            Your facility <strong>{form.name}</strong> has been submitted for review. Our team will contact you within 48 hours.
          </p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
            Status: Pending review
          </div>
          <div className="mt-8">
            <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold">
              Back to home
            </Link>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-5 py-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            <Building2 className="h-3.5 w-3.5" /> Hospital onboarding
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-display font-bold">Partner with MamaRoute</h1>
          <p className="mt-2 opacity-85 max-w-2xl">Join our emergency response network. Submissions are reviewed manually — your facility is not auto-listed.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-10">
        {/* Progress */}
        <div className="flex items-center gap-4">
          {[1, 2].map((n) => (
            <div key={n} className="flex-1">
              <div className={`h-2 rounded-full ${step >= n ? "bg-sos" : "bg-muted"}`} />
              <div className={`mt-2 text-xs font-semibold ${step >= n ? "text-primary" : "text-muted-foreground"}`}>
                Step {n} · {n === 1 ? "Basic Info" : "Services & Capacity"}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="mt-8 space-y-6">
          {step === 1 && (
            <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
              <Field label="Hospital Name" required>
                <input className={input} value={form.name} onChange={(e) => u("name", e.target.value)} required maxLength={200} />
              </Field>
              <Field label="Hospital Address" required>
                <input className={input} value={form.address} onChange={(e) => u("address", e.target.value)} required maxLength={300} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="LGA" required>
                  <input className={input} value={form.lga} onChange={(e) => u("lga", e.target.value)} required maxLength={100} />
                </Field>
                <Field label="State" required>
                  <select className={input} value={form.state} onChange={(e) => u("state", e.target.value)} required>
                    <option value="">Select state…</option>
                    {NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Contact Person Name" required>
                <input className={input} value={form.contactName} onChange={(e) => u("contactName", e.target.value)} required maxLength={120} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Phone Number" required>
                  <input type="tel" className={input} value={form.phone} onChange={(e) => u("phone", e.target.value)} required maxLength={30} placeholder="+234…" />
                </Field>
                <Field label="Email Address" required>
                  <input type="email" className={input} value={form.email} onChange={(e) => u("email", e.target.value)} required maxLength={200} />
                </Field>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!step1Valid}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Facility Type" required>
                  <select className={input} value={form.facilityType} onChange={(e) => u("facilityType", e.target.value as FormState["facilityType"])} required>
                    <option value="">Select…</option>
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </Field>
                <Field label="Care Level" required>
                  <select className={input} value={form.careLevel} onChange={(e) => u("careLevel", e.target.value as FormState["careLevel"])} required>
                    <option value="">Select…</option>
                    <option>Primary</option>
                    <option>Secondary</option>
                    <option>Tertiary</option>
                  </select>
                </Field>
              </div>

              <Field label="Available Services">
                <div className="grid sm:grid-cols-2 gap-2">
                  {SERVICES.map((s) => (
                    <label key={s} className="flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm cursor-pointer hover:bg-accent">
                      <input type="checkbox" checked={form.services.includes(s)} onChange={() => toggleService(s)} className="h-4 w-4" />
                      {s}
                    </label>
                  ))}
                </div>
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Number of Ambulances Available">
                  <input type="number" min={0} max={500} className={input} value={form.ambulances} onChange={(e) => u("ambulances", Math.max(0, Number(e.target.value) || 0))} />
                </Field>
                <Field label="Operating Hours" required>
                  <select className={input} value={form.hours} onChange={(e) => u("hours", e.target.value as FormState["hours"])} required>
                    <option value="">Select…</option>
                    <option>24 hours</option>
                    <option>Daytime only</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>

              <Field label="Accepts Emergency Walk-ins?">
                <div className="inline-flex rounded-xl border border-input overflow-hidden">
                  {[
                    { v: true, l: "Yes" },
                    { v: false, l: "No" },
                  ].map((o) => (
                    <button
                      type="button"
                      key={o.l}
                      onClick={() => u("walkIns", o.v)}
                      className={`px-4 py-2 text-sm font-semibold ${form.walkIns === o.v ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Additional Notes">
                <textarea rows={4} maxLength={1000} className={input} value={form.notes} onChange={(e) => u("notes", e.target.value)} />
              </Field>

              <div className="flex justify-between gap-3">
                <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-2 rounded-xl border border-input px-5 py-2.5 text-sm font-semibold hover:bg-accent">
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={!step2Valid}
                  className="inline-flex items-center gap-2 rounded-xl bg-sos text-sos-foreground px-5 py-2.5 text-sm font-semibold shadow-sos disabled:opacity-50"
                >
                  Submit for review
                </button>
              </div>
            </div>
          )}
        </form>
      </section>
    </SiteShell>
  );
}

const input = "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-primary">
        {label} {required && <span className="text-sos">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

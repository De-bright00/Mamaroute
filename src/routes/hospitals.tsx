import { createFileRoute } from "@tanstack/react-router";
import { Activity, AlertTriangle, Ambulance, Bed, Building2, Globe, Mail, MessageSquare, Phone, PhoneCall, ShieldCheck, Users, Search, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { useState } from "react";

export const Route = createFileRoute("/hospitals")({
  head: () => ({ meta: [
    { title: "Hospital Network — MamaRoute" },
    { name: "description", content: "Join the MamaRoute hospital and healthcare provider network across Nigeria." },
  ] }),
  component: Hospitals,
});

const BENEFITS = [
  { icon: Activity, title: "Receive emergency patient referrals", text: "Get notified instantly when patients in your area need urgent maternal care." },
  { icon: Globe, title: "Increase visibility and patient reach", text: "Be discoverable to expectant mothers searching for trusted nearby facilities." },
  { icon: AlertTriangle, title: "Access real-time emergency notifications", text: "Respond faster with live alerts delivered through the MamaRoute platform." },
  { icon: Ambulance, title: "Manage ambulance availability", text: "Update fleet status so dispatchers can route the nearest available unit." },
  { icon: ShieldCheck, title: "Coordinate emergency response", text: "Collaborate with other providers to streamline transfers and reduce delays." },
];

type HospitalItem = {
  name: string;
  city: 'Lagos' | 'Abuja';
  area: string;
  address: string;
  phone: string;
  type: string;
  specialties: string[];
  capacity: string;
  avatarBg: string;
  bedsAvailable: number;
  ambulancesAvailable: number;
};

const HOSPITALS: HospitalItem[] = [
  // Lagos
  {
    name: "Lagos State University Teaching Hospital (LASUTH)",
    city: "Lagos",
    area: "Ikeja",
    address: "1-5 Oba Akinjobi Way, Ikeja, Lagos",
    phone: "+234 1 270 2235",
    type: "Teaching Hospital",
    specialties: ["Obstetrics & Gynecology", "Maternal ICU", "Neonatal Care", "Pediatrics"],
    capacity: "High Capacity",
    avatarBg: "from-pink-500 to-rose-600",
    bedsAvailable: 8,
    ambulancesAvailable: 3
  },
  {
    name: "National Orthopaedic Hospital, Igbobi",
    city: "Lagos",
    area: "Yaba",
    address: "120 Ikorodu Road, Igbobi, Yaba, Lagos",
    phone: "+234 1 295 4321",
    type: "Specialized Public Hospital",
    specialties: ["Orthopaedics", "Trauma & Accident Care", "Reconstructive Surgery", "Emergency Medicine"],
    capacity: "High Capacity",
    avatarBg: "from-blue-500 to-indigo-600",
    bedsAvailable: 12,
    ambulancesAvailable: 2
  },
  {
    name: "Island Maternity Hospital",
    city: "Lagos",
    area: "Lagos Island",
    address: "Broad Street, Lagos Island, Lagos",
    phone: "+234 1 263 2184",
    type: "Specialized Maternity Hospital",
    specialties: ["Antenatal & Postnatal Care", "Emergency Obstetrics", "NICU", "Family Planning"],
    capacity: "Medium Capacity",
    avatarBg: "from-purple-500 to-indigo-600",
    bedsAvailable: 6,
    ambulancesAvailable: 1
  },
  {
    name: "Gbagada General Hospital",
    city: "Lagos",
    area: "Gbagada",
    address: "1 hospital Road, Gbagada, Lagos",
    phone: "+234 803 314 4301",
    type: "General Hospital",
    specialties: ["General Obstetrics", "Neonatal Ward", "Surgical Emergency", "Blood Bank"],
    capacity: "High Capacity",
    avatarBg: "from-emerald-500 to-teal-600",
    bedsAvailable: 9,
    ambulancesAvailable: 2
  },
  {
    name: "Federal Medical Centre, Ebute Metta",
    city: "Lagos",
    area: "Ebute Metta",
    address: "Railway Compound, Ebute Metta, Lagos",
    phone: "+234 1 804 2231",
    type: "Federal Medical Centre",
    specialties: ["Maternal & Child Health", "General Medicine", "Emergency Services", "Laboratory Services"],
    capacity: "Medium Capacity",
    avatarBg: "from-amber-500 to-orange-600",
    bedsAvailable: 4,
    ambulancesAvailable: 1
  },
  // Abuja
  {
    name: "National Hospital Abuja",
    city: "Abuja",
    area: "Central Business District",
    address: "Plot 272, Samuel Ademulegun Street, Central Business District, Abuja",
    phone: "+234 9 234 2661",
    type: "Federal Teaching Hospital",
    specialties: ["Obstetrics & Gynecology", "Level 3 NICU", "Advanced Trauma", "Maternal ICU"],
    capacity: "High Capacity",
    avatarBg: "from-pink-500 to-rose-600",
    bedsAvailable: 14,
    ambulancesAvailable: 4
  },
  {
    name: "Garki Hospital",
    city: "Abuja",
    area: "Garki Area 8",
    address: "Limi Street, Off Tafawa Balewa Way, Garki Area 8, Abuja",
    phone: "+234 908 720 0001",
    type: "General Hospital",
    specialties: ["Maternity Care", "Pediatrics", "Emergency Surgery", "Family Medicine"],
    capacity: "High Capacity",
    avatarBg: "from-teal-500 to-emerald-600",
    bedsAvailable: 8,
    ambulancesAvailable: 2
  },
  {
    name: "Wuse District Hospital",
    city: "Abuja",
    area: "Wuse Zone 3",
    address: "Conakry Street, Wuse Zone 3, Abuja",
    phone: "+234 803 123 4567",
    type: "General Hospital",
    specialties: ["Antenatal Care", "Delivery Services", "Immunization Services", "24/7 Emergency"],
    capacity: "Medium Capacity",
    avatarBg: "from-blue-500 to-indigo-600",
    bedsAvailable: 5,
    ambulancesAvailable: 1
  },
  {
    name: "Asokoro District Hospital",
    city: "Abuja",
    area: "Asokoro",
    address: "Julius Nyerere Crescent, Asokoro, Abuja",
    phone: "+234 905 555 1234",
    type: "District Hospital",
    specialties: ["Obstetrics & Gynecology", "Pediatric Emergencies", "General Medicine", "Laboratory"],
    capacity: "Medium Capacity",
    avatarBg: "from-purple-500 to-indigo-600",
    bedsAvailable: 7,
    ambulancesAvailable: 2
  },
  {
    name: "Maitama District Hospital",
    city: "Abuja",
    area: "Maitama",
    address: "8, Limpopo Street, Maitama, Abuja",
    phone: "+234 812 345 6789",
    type: "District Hospital",
    specialties: ["Maternal Health Care", "General Surgery", "24/7 Trauma Unit", "NICU"],
    capacity: "Medium Capacity",
    avatarBg: "from-amber-500 to-orange-600",
    bedsAvailable: 6,
    ambulancesAvailable: 2
  }
];

function Hospitals() {
  const [activeCity, setActiveCity] = useState<'Lagos' | 'Abuja'>('Lagos');
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHospitals = HOSPITALS.filter((h) => {
    const matchesCity = h.city === activeCity;
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCity && matchesSearch;
  });

  return (
    <SiteShell>
      <section className="gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-5xl font-display font-bold">Hospital Network</h1>
          <p className="mt-4 mx-auto max-w-2xl text-base md:text-lg opacity-90">
            MamaRoute connects mothers to verified facilities across Nigeria. Find nearby maternity centers, general hospitals, and specialist clinics in Abuja and Lagos.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/hospital-onboarding"
              className="inline-flex items-center gap-2 rounded-2xl bg-sos px-6 py-3 font-display font-bold text-base text-sos-foreground shadow-sos hover:opacity-95"
            >
              <Building2 className="h-5 w-5" /> Onboard Your Facility
            </Link>
            <a
              href="tel:+2347045855451"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur border border-white/20 px-6 py-3 font-display font-bold text-base hover:bg-white/25 transition-colors"
            >
              <PhoneCall className="h-5 w-5" /> Call Hotline
            </a>
          </div>
        </div>
      </section>

      {/* Directory Section */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary text-center mb-6">
          Verified Medical Facilities
        </h2>

        {/* Search */}
        <div className="mb-8 max-w-md mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search hospitals by name, specialty, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-sos/50 focus:border-sos transition-all text-sm shadow-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {(["Lagos", "Abuja"] as const).map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-6 py-2.5 rounded-2xl font-display font-semibold text-sm transition-all cursor-pointer ${
                activeCity === city
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:text-primary hover:bg-accent/60"
              }`}
            >
              {city} Network
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredHospitals.map((h) => (
            <div key={h.name} className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-soft hover:border-sos/30 transition-all">
              <div className="flex gap-4 items-start">
                <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${h.avatarBg} text-white font-display font-bold text-base shadow-sm`}>
                  {h.name.split(" ").map(w => w[0]).join("").slice(0, 3)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center rounded-full bg-accent text-primary px-2 py-0.5 text-[10px] font-semibold">
                      {h.type}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      h.capacity === "High Capacity" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {h.capacity}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display font-bold text-primary text-base line-clamp-2 group-hover:text-sos transition-colors">
                    {h.name}
                  </h3>
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{h.address}</span>
                  </p>
                  
                  {/* Bed and Ambulance Availability stats */}
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      <Bed className="h-3.5 w-3.5 shrink-0" />
                      <span>{h.bedsAvailable} Beds Available</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                      <Ambulance className="h-3.5 w-3.5 shrink-0" />
                      <span>{h.ambulancesAvailable} Ambulances</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-1.5">
                {h.specialties.map((s) => (
                  <span key={s} className="rounded-lg bg-accent/60 text-muted-foreground px-2 py-1 text-[10px] font-medium">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-3">
                <a
                  href={`tel:${h.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sos text-sos-foreground px-4 py-2.5 text-xs font-semibold shadow-sos hover:opacity-95 transition-opacity"
                >
                  <Phone className="h-3.5 w-3.5" /> Call Hospital
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + ", " + h.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background text-muted-foreground px-4 py-2.5 text-xs font-semibold hover:bg-accent hover:text-primary transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card/50">
            <p className="text-muted-foreground text-sm">No hospitals found matching "{searchQuery}"</p>
          </div>
        )}
      </section>

      {/* Network Benefits Info */}
      <section className="mx-auto max-w-7xl px-5 py-12 bg-accent/30 rounded-3xl mb-12">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary text-center">Why join the MamaRoute network?</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card p-6 hover:shadow-soft transition-shadow">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <b.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display font-semibold text-primary">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

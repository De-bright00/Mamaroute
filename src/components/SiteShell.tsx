import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, PhoneCall, UserCircle2, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/hospitals", label: "Hospitals" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/hotline", label: "Hotline" },
  { to: "/credits", label: "Credits" },
  { to: "/hospital-onboarding", label: "For Hospitals" },
  { to: "/hospital-dashboard", label: "Dashboard" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { isAuthenticated, profile } = useAuth();
  const signOut = () => supabase.auth.signOut();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="MamaRoute" className="h-9 w-9 rounded-xl object-cover" />
            <span className="font-display font-bold text-lg tracking-tight text-primary">
              MamaRoute
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? "bg-accent text-primary" : "text-muted-foreground hover:text-primary hover:bg-accent/60"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
            <Link
              to="/sos"
              className="ml-2 inline-flex items-center gap-2 rounded-lg bg-sos text-sos-foreground px-4 py-2 text-sm font-semibold shadow-sos hover:opacity-95"
            >
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" /> SOS
            </Link>
            {isAuthenticated ? (
              <div className="ml-2 flex items-center gap-1">
                <Link to="/settings" className="hidden lg:inline-flex items-center gap-1.5 text-xs text-muted-foreground px-2 hover:text-primary">
                  <UserCircle2 className="h-4 w-4" />
                  {profile?.full_name?.split(" ")[0] ?? "Account"}
                </Link>
                <button onClick={signOut} className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-primary" aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="ml-2 rounded-lg border border-input px-3 py-2 text-sm font-medium hover:bg-accent">
                Sign in
              </Link>
            )}
          </nav>

          <button className="md:hidden rounded-lg p-2 hover:bg-accent" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-5 py-3 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/sos"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-sos text-sos-foreground px-4 py-2 text-sm font-semibold"
              >
                Emergency SOS
              </Link>
              {isAuthenticated ? (
                <button onClick={() => { signOut(); setOpen(false); }} className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)} className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium">
                  Sign in / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Floating direct-call hotline — available from every page */}
      <a
        href="tel:+2347045855451"
        aria-label="Call 24/7 Emergency Maternal Hotline Nigeria: +234 704 585 5451"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-sos text-sos-foreground px-4 py-3 font-semibold shadow-sos hover:opacity-95"
      >
        <PhoneCall className="h-5 w-5" />
        <span className="hidden sm:inline text-sm">Call hotline</span>
      </a>

      <footer className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-10 grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="MamaRoute" className="h-8 w-8 rounded-lg object-cover" />
              <span className="font-display font-bold">MamaRoute</span>
            </div>
            <p className="mt-3 text-sm opacity-75">
              Connecting patients to emergency care faster across Nigeria.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/sos">Emergency SOS</Link></li>
              <li><Link to="/assistant">AI Assistant</Link></li>
              <li><Link to="/hospitals">Hospitals</Link></li>
              <li><Link to="/credits">Credits & Top-up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Partners</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/hospital-onboarding">Onboard your hospital</Link></li>
              <li><Link to="/hospital-dashboard">Hospital dashboard</Link></li>
              <li><Link to="/hotline">Emergency Hotline</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Emergency</h4>
            <p className="text-sm opacity-80">24/7 Emergency Maternal Hotline (Nigeria)</p>
            <a href="tel:+2347045855451" className="mt-1 inline-block text-lg font-display font-bold text-sos">
              +234 704 585 5451
            </a>
            <p className="mt-1 text-xs opacity-70">Call now for offline emergency support</p>
          </div>
        </div>
        <div className="border-t border-white/10 text-center text-xs opacity-60 py-4">
          © {new Date().getFullYear()} MamaRoute · Built for Nigerian mothers.
        </div>
      </footer>
    </div>
  );
}

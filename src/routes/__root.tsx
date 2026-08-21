import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/SiteShell";

function NotFoundComponent() {
  return (
    <SiteShell>
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-display font-bold text-primary">404</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This page doesn't exist. Need urgent help instead?
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</Link>
            <Link to="/sos" className="rounded-lg bg-sos px-4 py-2 text-sm font-semibold text-sos-foreground">Emergency SOS</Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <SiteShell>
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-display font-semibold text-primary">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">Try again or head back home.</p>
          <div className="mt-6 flex justify-center gap-2">
            <button onClick={() => { router.invalidate(); reset(); }} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button>
            <a href="/" className="rounded-lg border border-input px-4 py-2 text-sm font-medium">Go home</a>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

const DESCRIPTION = "MamaRoute is a maternal emergency coordination platform connecting pregnant women in crisis to nearby hospitals across Nigeria.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MamaRoute — Emergency Access Infrastructure for Maternal Healthcare" },
      { name: "description", content: DESCRIPTION },
      { name: "theme-color", content: "#0f1b3d" },
      { property: "og:title", content: "MamaRoute — Emergency Access Infrastructure for Maternal Healthcare" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "MamaRoute — Emergency Access Infrastructure for Maternal Healthcare" },
      { name: "twitter:description", content: DESCRIPTION },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:image", content: "/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Figtree:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

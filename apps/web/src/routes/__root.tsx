import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import type { ConvexQueryClient } from '@convex-dev/react-query';
import { Toaster } from '@invoice/ui/components/sonner';
import type { QueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ThemeProvider } from 'next-themes';

import { authClient } from '@/lib/auth-client';
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_TAGLINE,
  OG_IMAGE,
  TWITTER_HANDLE,
  JsonLd,
  getOrganizationSchema,
  getSoftwareApplicationSchema,
} from '@/lib/seo';

import Header from '../components/header';
import appCss from '../index.css?url';

export interface RouterAppContext {
  queryClient: QueryClient;
  convexQueryClient: ConvexQueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { name: 'description', content: SITE_DESCRIPTION },

      // OpenGraph defaults (overridden per-route)
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:title', content: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { property: 'og:description', content: SITE_DESCRIPTION },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: 'en_US' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { name: 'twitter:description', content: SITE_DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
      { name: 'twitter:site', content: TWITTER_HANDLE },

      // SEO & AI search
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'theme-color', content: '#1a9a8a' },
      { name: 'application-name', content: SITE_NAME },
      { name: 'apple-mobile-web-app-title', content: SITE_NAME },
      { name: 'generator', content: 'TanStack Start' },
      { name: 'author', content: 'Ahmed Hesham' },
      { name: 'keywords', content: 'invoice, invoicing, freelancer, freelance invoice, open source invoice, free invoice generator, invoice software, invoice app, send invoice, create invoice, professional invoice, PDF invoice' },
    ],
    links: [
      // Canonical
      { rel: 'canonical', href: SITE_URL },
      // Favicon
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'apple-touch-icon', href: '/favicon.svg' },
      // Fonts
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap',
      },
      // Sitemap
      { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' },
      // App CSS
      { rel: 'stylesheet', href: appCss },
    ],
  }),

  component: RootComponent,
});

function RootComponent() {
  const context = Route.useRouteContext();

  return (
    <ConvexBetterAuthProvider
      client={context.convexQueryClient.convexClient}
      authClient={authClient}
    >
      <RootDocument>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="min-h-svh flex flex-col grain">
            <Header />
            <main className="flex-1">
              <Outlet />
            </main>
          </div>
          <Toaster richColors />
        </ThemeProvider>
        <TanStackRouterDevtools position="bottom-left" />
      </RootDocument>
    </ConvexBetterAuthProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Global Structured Data — Organization + SoftwareApplication */}
        <JsonLd data={getOrganizationSchema()} />
        <JsonLd data={getSoftwareApplicationSchema()} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

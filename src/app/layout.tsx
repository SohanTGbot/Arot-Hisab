"use client";

import { Outfit, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/cookie-consent";
import { I18nProvider, useI18n } from "@/lib/i18n/provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { SkipNavigation } from "@/components/skip-navigation";
import { TouchRipple } from "@/components/ui/touch-ripple";
import "@/lib/i18n/config"; // Initialize i18n
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { language } = useI18n();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return children;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="description" content="Automated calculation platform for fish wholesale markets" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        outfit.variable,
        hindSiliguri.variable
      )}>
        <ThemeProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <ErrorBoundary>
                <I18nProvider>
                  <RootLayoutContent>
                    <TouchRipple />
                    <SkipNavigation />
                    {process.env.NEXT_PUBLIC_GA_ID && (
                      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
                    )}
                    <main id="main-content" tabIndex={-1}>
                      {children}
                    </main>
                    <Toaster />
                    <CookieConsent />
                  </RootLayoutContent>
                </I18nProvider>
              </ErrorBoundary>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

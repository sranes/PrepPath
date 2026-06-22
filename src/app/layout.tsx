import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";
import { SiteNav } from "@/components/site-nav";
import { ContentSync } from "@/components/content-sync";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrepPath — Free JEE/NEET Foundation Practice",
  description:
    "A free, ad-free practice app for Class 6–12 students building toward JEE and NEET. Chapter practice, instant solutions, and spaced-repetition revision.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "PrepPath", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <AuthProvider>
            <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
              <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
                <Link href="/" className="flex items-center gap-2 font-bold">
                  <span className="text-xl">🎯</span>
                  <span>
                    Prep<span className="text-brand">Path</span>
                  </span>
                </Link>
                <SiteNav />
              </div>
            </header>
            <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</main>
            <footer className="border-t border-border py-6 text-center text-xs text-muted">
              Free &amp; ad-free · Aligned to NCERT · Built for future JEE/NEET aspirants
            </footer>
            <PwaRegister />
            <ContentSync />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

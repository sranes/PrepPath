"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// LIGHTWEIGHT I18N
// A tiny dictionary-based translator for UI chrome (nav, home, common labels).
// Authored content (questions/solutions) stays in its written language — those
// are data, not UI strings. Coverage grows by adding keys to STRINGS. The
// chosen language persists in localStorage.
// ---------------------------------------------------------------------------

export type Lang = "en" | "hi";

export const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "hi", label: "हिं" },
];

const STRINGS: Record<string, Record<Lang, string>> = {
  "nav.mock": { en: "Mock", hi: "मॉक" },
  "nav.papers": { en: "Papers", hi: "पेपर" },
  "nav.resources": { en: "Resources", hi: "संसाधन" },
  "nav.review": { en: "Review", hi: "रिवीज़न" },
  "nav.progress": { en: "Progress", hi: "प्रगति" },
  "nav.ranks": { en: "Ranks", hi: "रैंक" },
  "nav.admin": { en: "Admin", hi: "एडमिन" },
  "common.signin": { en: "Sign in", hi: "साइन इन" },
  "common.signout": { en: "Sign out", hi: "साइन आउट" },
  "home.hero.title": {
    en: "Build your foundation, one chapter at a time.",
    hi: "अपनी नींव बनाएँ, एक अध्याय के साथ।",
  },
  "home.hero.subtitle": {
    en: "Free practice for Class 6–12 students on the path to JEE & NEET. Aligned to NCERT — practise, see worked solutions, and let spaced repetition do the rest.",
    hi: "JEE और NEET की राह पर कक्षा 6–12 के छात्रों के लिए मुफ़्त अभ्यास। NCERT के अनुरूप — अभ्यास करें, हल देखें, और स्पेस्ड रिपीटिशन को बाकी काम करने दें।",
  },
  "home.cta.mock": { en: "📝 Take a mock test", hi: "📝 मॉक टेस्ट दें" },
  "home.stat.streak": { en: "Day streak", hi: "दिनों की लय" },
  "home.stat.xp": { en: "XP earned", hi: "अर्जित XP" },
  "home.stat.questions": { en: "Questions done", hi: "हल किए प्रश्न" },
  "home.pickClass": { en: "Pick your class", hi: "अपनी कक्षा चुनें" },
};

interface I18nState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof STRINGS | string) => string;
}

const I18nContext = createContext<I18nState | null>(null);
const STORAGE_KEY = "cw:lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "en" || saved === "hi") setLangState(saved);
  }, []);

  const value = useMemo<I18nState>(
    () => ({
      lang,
      setLang: (l) => {
        setLangState(l);
        window.localStorage.setItem(STORAGE_KEY, l);
      },
      t: (key) => STRINGS[key]?.[lang] ?? STRINGS[key]?.en ?? String(key),
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT(): I18nState {
  const ctx = useContext(I18nContext);
  // Safe fallback so components work even if used outside the provider.
  if (!ctx) return { lang: "en", setLang: () => {}, t: (k) => STRINGS[k]?.en ?? String(k) };
  return ctx;
}

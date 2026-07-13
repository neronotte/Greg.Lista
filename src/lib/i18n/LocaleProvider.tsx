"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { translations, t as translate, type Locale } from "./translations";
import { updateLocale } from "@/lib/actions/profile";

type Translations = typeof translations.en;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  translations: Translations;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

interface LocaleProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
}

export function LocaleProvider({
  children,
  initialLocale = "en",
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    // Update in database
    updateLocale(newLocale).catch(console.error);
  }, []);

  const currentTranslations = translations[locale] as typeof translations.en;

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      return translate(currentTranslations, key, vars);
    },
    [currentTranslations],
  );

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t, translations: currentTranslations }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

export function useT() {
  const { t } = useLocale();
  return t;
}

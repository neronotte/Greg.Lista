"use client";

import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const localeOptions: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "it", label: "IT" },
];

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2 p-1 bg-bg-header rounded-full">
      {localeOptions.map(({ value, label }) => {
        const isActive = locale === value;
        return (
          <button
            key={value}
            onClick={() => setLocale(value)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-semibold transition-all
              ${
                isActive
                  ? "bg-bg-surface text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

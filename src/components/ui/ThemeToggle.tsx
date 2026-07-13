"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, pending } = useTheme();

  const options: {
    value: "light" | "dark" | "system";
    label: string;
    icon: typeof Sun;
  }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-2 p-1 bg-bg-header rounded-full">
      {options.map(({ value, label, icon: Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            disabled={pending}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all
              ${
                isActive
                  ? "bg-bg-surface text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }
              ${pending ? "opacity-50 cursor-not-allowed" : ""}
            `}
            aria-label={label}
          >
            <Icon size={14} />
            <span className="hidden xs:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

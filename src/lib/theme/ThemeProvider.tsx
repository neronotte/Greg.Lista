"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
  ReactNode,
} from "react";
import { updateThemePreference } from "@/lib/actions/profile";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  pending: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme: Theme;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [pending, startTransition] = useTransition();

  // Resolve system preference
  useEffect(() => {
    const resolve = () => {
      if (theme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        setResolvedTheme(prefersDark ? "dark" : "light");
      } else {
        setResolvedTheme(theme);
      }
    };

    resolve();

    // Listen for system preference changes
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        setResolvedTheme(media.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  // Apply theme class to html element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    startTransition(async () => {
      await updateThemePreference(newTheme);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, pending }}>
      {children}
    </ThemeContext.Provider>
  );
}

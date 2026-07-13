import type { Metadata } from "next";
import "./globals.css";
import pkg from "../package.json";
import { Nunito } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { LocaleProvider, type Locale } from "@/lib/i18n";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `List@ v${pkg.version}`,
  description: "Your shopping list",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "List@",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

async function getThemePreference(): Promise<"light" | "dark" | "system"> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return "system";

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Handle case where theme column doesn't exist yet
    const theme = profile?.theme;
    if (theme === "light" || theme === "dark" || theme === "system") {
      return theme;
    }
    return "system";
  } catch {
    return "system";
  }
}

async function getLocalePreference(): Promise<Locale> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return "en";

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Handle case where locale column doesn't exist yet
    const locale = profile?.locale;
    if (locale === "en" || locale === "it") {
      return locale;
    }
    return "en";
  } catch {
    return "en";
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemePreference();
  const locale = await getLocalePreference();

  return (
    <html
      lang={locale}
      className={`h-full ${nunito.variable} ${theme !== "system" ? theme : ""}`}
      suppressHydrationWarning
    >
      <link rel="icon" type="image/x-icon" href="favicon.png"></link>
      <body className="min-h-full bg-bg-app antialiased font-sans">
        <ThemeProvider initialTheme={theme}>
          <LocaleProvider initialLocale={locale}>
            <div className="flex min-h-full w-full flex-col bg-bg-app">
              {children}
            </div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

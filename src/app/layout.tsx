import type { Metadata } from "next";
import "./globals.css";
import pkg from "../package.json";
import { Nunito } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemePreference();

  return (
    <html
      lang="it"
      className={`h-full ${nunito.variable} ${theme !== "system" ? theme : ""}`}
      suppressHydrationWarning
    >
      <link rel="icon" type="image/x-icon" href="favicon.png"></link>
      <body className="min-h-full bg-bg-app antialiased font-sans">
        <ThemeProvider initialTheme={theme}>
          <div className="flex min-h-full w-full flex-col bg-bg-app">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

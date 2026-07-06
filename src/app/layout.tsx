import type { Metadata } from "next";
import "./globals.css";
import pkg from '../package.json'

export const metadata: Metadata = {
  title: `Greg List@ v${pkg.version}`,
  description: "La tua lista della spesa",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className="h-full"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-app text-text-primary antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

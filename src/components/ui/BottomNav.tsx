"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, ShoppingBag, Users } from "lucide-react";
import { useT } from "@/lib/i18n";

interface BottomNavProps {
  pendingInvites?: number;
  activeSessions?: number;
  latestActiveSessionId?: string | null;
}

interface NavTab {
  href?: string;
  labelKey: string;
  icon: typeof ShoppingCart;
  match: (pathname: string) => boolean;
  disabled?: boolean;
}

export default function BottomNav({
  pendingInvites = 0,
  activeSessions = 0,
}: BottomNavProps) {
  const pathname = usePathname();
  const t = useT();

  const tabs: NavTab[] = [
    {
      href: "/",
      labelKey: "nav.lists",
      icon: ShoppingCart,
      match: (p: string) => p === "/" || p.startsWith("/lists"),
    },
    {
      href: "/history",
      labelKey: "nav.sessions",
      icon: ShoppingBag,
      match: (p: string) => p.startsWith("/history"),
    },
    {
      href: "/families",
      labelKey: "nav.family",
      icon: Users,
      match: (p: string) =>
        p.startsWith("/families") ||
        p.startsWith("/invite") ||
        p.startsWith("/invites"),
    },
  ];

  const badges: Record<string, number> = {
    "/history": activeSessions,
    "/families": pendingInvites,
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex items-center bg-bg-surface border-t border-border"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        minHeight: 68,
      }}
    >
      {tabs.map((tab) => {
        const active = tab.match(pathname);
        const badge = tab.href ? (badges[tab.href] ?? 0) : 0;

        const content = (
          <>
            <div className="relative">
              <tab.icon
                size={22}
                className={active ? "text-brand-mid" : "text-text-secondary"}
              />
              {badge > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-white leading-none">
                  {badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-extrabold leading-none ${
                active ? "text-brand-mid" : "text-text-secondary"
              }`}
            >
              {t(tab.labelKey)}
            </span>
            <span
              className={`mt-0.5 h-1 w-1 rounded-full bg-brand-mid transition-all duration-200 ${
                active ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
            />
          </>
        );

        const commonClassName =
          "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors";

        return tab.href && !tab.disabled ? (
          <Link
            key={tab.labelKey}
            href={tab.href}
            className={commonClassName}
            aria-current={active ? "page" : undefined}
          >
            {content}
          </Link>
        ) : (
          <div
            key={tab.labelKey}
            className={`${commonClassName} ${tab.disabled ? "cursor-not-allowed opacity-40" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {content}
          </div>
        );
      })}
    </nav>
  );
}

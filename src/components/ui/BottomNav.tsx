"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, ShoppingBag, Timer, User } from "lucide-react";

interface BottomNavProps {
  pendingInvites?: number;
  activeSessions?: number;
  latestActiveSessionId?: string | null;
}

interface NavTab {
  href?: string;
  label: string;
  icon: typeof ShoppingCart;
  match: (pathname: string) => boolean;
  disabled?: boolean;
}

export default function BottomNav({
  pendingInvites = 0,
  activeSessions = 0,
  latestActiveSessionId = null,
}: BottomNavProps) {
  const pathname = usePathname();

  const tabs: NavTab[] = [
    {
      href: "/",
      label: "Liste",
      icon: ShoppingCart,
      match: (p: string) => p === "/" || p.startsWith("/lists"),
    },
    {
      href: "/history",
      label: "In spesa",
      icon: ShoppingBag,
      match: (p: string) => p.startsWith("/history"),
    },
    {
      href: latestActiveSessionId
        ? `/session/${latestActiveSessionId}`
        : undefined,
      label: "Ultima spesa",
      icon: Timer,
      match: (p: string) => p.startsWith("/session"),
      disabled: !latestActiveSessionId,
    },
    {
      href: "/profile",
      label: "Profilo",
      icon: User,
      match: (p: string) =>
        p.startsWith("/profile") ||
        p.startsWith("/families") ||
        p.startsWith("/invite") ||
        p.startsWith("/invites"),
    },
  ];

  const badges: Record<string, number> = {
    "/history": activeSessions,
    "/profile": pendingInvites,
  };

  return (
    <nav
      className="h-16 bg-bg-surface sticky bottom-0 z-10 flex items-stretch"
      style={{ boxShadow: "0 -1px 4px rgba(0,0,0,0.1)" }}
    >
      {tabs.map((tab) => {
        const active = tab.match(pathname);
        const badge = tab.href ? (badges[tab.href] ?? 0) : 0;
        const content = (
          <>
            {badge > 0 && (
              <span className="absolute top-2 right-[calc(50%-20px)] min-w-5 h-5 rounded-full bg-error text-white text-[11px] font-medium flex items-center justify-center px-1">
                {badge}
              </span>
            )}
            <tab.icon
              size={24}
              className={
                tab.disabled
                  ? "text-text-disabled opacity-60"
                  : active
                    ? "text-brand-mid"
                    : "text-text-disabled"
              }
            />
            <span
              className={
                tab.disabled
                  ? "text-[11px] font-medium text-text-disabled leading-none opacity-60"
                  : active
                    ? "text-[11px] font-medium text-brand-mid leading-none"
                    : "text-[11px] font-medium text-text-disabled leading-none"
              }
            >
              {tab.label}
            </span>
          </>
        );

        const commonClassName =
          "flex-1 flex flex-col items-center justify-center gap-0.5 min-w-[44px] relative";

        return tab.href && !tab.disabled ? (
          <Link
            key={tab.label}
            href={tab.href}
            className={commonClassName}
            aria-current={active ? "page" : undefined}
          >
            {content}
          </Link>
        ) : (
          <div
            key={tab.label}
            className={`${commonClassName} ${tab.disabled ? "cursor-not-allowed" : ""}`}
            aria-current={active ? "page" : undefined}
            aria-disabled={tab.disabled ? "true" : undefined}
          >
            {content}
          </div>
        );
      })}
    </nav>
  );
}

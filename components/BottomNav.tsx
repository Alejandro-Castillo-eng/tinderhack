"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveMatches } from "@/lib/store";
import { IconChat, IconFlame, IconUser } from "./icons";

export function BottomNav() {
  const path = usePathname();
  const matches = useActiveMatches();
  const fresh = matches.filter((m) => m.count === 0).length;

  const tabs = [
    { href: "/discover", label: "Descubrir", icon: IconFlame, badge: 0 },
    { href: "/matches", label: "Matches", icon: IconChat, badge: fresh },
    { href: "/profile", label: "Perfil", icon: IconUser, badge: 0 },
  ];

  return (
    <nav className="shrink-0 border-t border-white/[0.06] bg-[#0b0b10]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="flex">
        {tabs.map(({ href, label, icon: Icon, badge }) => {
          const active = path.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition ${
                  active ? "text-[#ff5c8a]" : "text-white/45"
                }`}
              >
                <span className="relative">
                  <Icon className="h-6 w-6" />
                  {badge > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff3d7f] px-1 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

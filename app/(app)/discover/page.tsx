"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SwipeDeck } from "@/components/SwipeDeck";
import { Logo } from "@/components/ui";
import { MODE_STYLE, MODES } from "@/lib/constants";
import { HACKATHONS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import type { Mode } from "@/lib/types";

const MODE_KEY = "tinderhack:mode";

export default function DiscoverPage() {
  const { state } = useStore();
  const me = state.me!;
  const available = MODES.filter((m) => me.modes.includes(m.id));
  const [picked, setMode] = useState<Mode>(available[0]?.id ?? "date");
  const mode: Mode = me.modes.includes(picked) ? picked : (available[0]?.id ?? "date");
  const hackathon = HACKATHONS.find((h) => h.id === state.hackathonId);

  // Recordar el último modo usado (preferencia local, no crítica).
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(MODE_KEY) as Mode | null;
      if (saved && me.modes.includes(saved)) setMode(saved);
    } catch {}
  }, [me.modes]);

  const pick = (m: Mode) => {
    setMode(m);
    try {
      sessionStorage.setItem(MODE_KEY, m);
    } catch {}
  };

  return (
    <>
      <header className="shrink-0 px-4 pb-3 pt-[max(0.9rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <Logo className="text-2xl" />
          <Link href="/hackathons" className="max-w-[55%] truncate rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-white/80">
            {hackathon?.emoji} {hackathon?.name}
          </Link>
        </div>
        {available.length > 1 && (
          <div role="tablist" aria-label="Modo" className="mt-3 flex rounded-full bg-white/[0.06] p-1">
            {available.map((m) => {
              const active = m.id === mode;
              return (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => pick(m.id)}
                  className={`relative flex-1 rounded-full py-2 text-sm font-bold transition ${active ? "text-black" : "text-white/60"}`}
                >
                  {active && (
                    <motion.span
                      layoutId="mode-pill"
                      className={`absolute inset-0 rounded-full bg-gradient-to-r ${MODE_STYLE[m.id].gradient}`}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">
                    {m.emoji} {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </header>
      <SwipeDeck key={mode} mode={mode} />
    </>
  );
}

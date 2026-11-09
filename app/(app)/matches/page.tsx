"use client";

import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/Photo";
import { ModeBadge } from "@/components/ui";
import { MODE_STYLE, MODES } from "@/lib/constants";
import { useActiveMatches, useStore } from "@/lib/store";
import type { Mode } from "@/lib/types";

function timeAgo(t: number) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "ahora";
  if (s < 3600) return `${Math.floor(s / 60)} min`;
  if (s < 86400) return `${Math.floor(s / 3600)} h`;
  return `${Math.floor(s / 86400)} d`;
}

export default function MatchesPage() {
  const { typing } = useStore();
  const all = useActiveMatches();
  const [filter, setFilter] = useState<Mode | "all">("all");
  const list = all.filter((x) => filter === "all" || x.match.mode === filter);
  const fresh = list.filter((x) => x.count === 0).sort((a, b) => b.match.createdAt - a.match.createdAt);
  const convos = list
    .filter((x) => x.count > 0)
    .sort((a, b) => (b.last?.at ?? 0) - (a.last?.at ?? 0));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="shrink-0 px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
        <h1 className="text-2xl font-black">Matches</h1>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {[{ id: "all" as const, label: "Todos", emoji: "✨" }, ...MODES].map((m) => (
            <button
              key={m.id}
              onClick={() => setFilter(m.id)}
              aria-pressed={filter === m.id}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                filter === m.id ? "bg-white text-black" : "bg-white/[0.07] text-white/70"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pb-4 no-scrollbar">
        {list.length === 0 && (
          <div className="flex flex-col items-center px-10 pt-20 text-center">
            <span className="text-6xl">💌</span>
            <h2 className="mt-4 text-xl font-bold">Todavía no tienes matches</h2>
            <p className="mt-2 text-sm text-white/60">Desliza a la derecha a quien te interese. Si la otra persona también lo hace, aparecerá aquí.</p>
            <Link href="/discover" className="mt-6 rounded-full bg-gradient-to-r from-[#ff3d7f] to-[#ff8a3d] px-6 py-3 font-bold">
              Ir a descubrir
            </Link>
          </div>
        )}

        {fresh.length > 0 && (
          <section className="mt-3">
            <h2 className="px-4 text-sm font-bold text-[#ff8fb0]">Nuevos matches</h2>
            <div className="mt-2 flex gap-3 overflow-x-auto px-4 py-1 no-scrollbar">
              {fresh.map(({ match, profile }) => (
                <Link key={match.id} href={`/chat?id=${match.id}`} className="w-20 shrink-0 text-center">
                  <div className={`relative h-24 w-20 overflow-hidden rounded-2xl ring-2 ${MODE_STYLE[match.mode].ring}`}>
                    <Photo src={profile.photos[0]} alt={profile.name} className="h-full w-full" emojiSize="text-4xl" />
                    <span className="absolute bottom-1 right-1 text-sm">{MODES.find((m) => m.id === match.mode)?.emoji}</span>
                  </div>
                  <p className="mt-1.5 truncate text-sm font-semibold">{profile.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {convos.length > 0 && (
          <section className="mt-6">
            <h2 className="px-4 text-sm font-bold text-[#ff8fb0]">Mensajes</h2>
            <ul className="mt-2">
              {convos.map(({ match, profile, last }) => (
                <li key={match.id}>
                  <Link href={`/chat?id=${match.id}`} className="flex items-center gap-3 px-4 py-3 active:bg-white/[0.04]">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full">
                      <Photo src={profile.photos[0]} alt={profile.name} className="h-full w-full" emojiSize="text-2xl" />
                    </div>
                    <div className="min-w-0 flex-1 border-b border-white/[0.06] pb-3">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{profile.name}</p>
                        <ModeBadge mode={match.mode} className="!text-[10px]" />
                        <span className="ml-auto text-xs text-white/40">{last ? timeAgo(last.at) : ""}</span>
                      </div>
                      <p className={`mt-0.5 truncate text-sm ${last?.from !== "me" ? "font-semibold text-white" : "text-white/55"}`}>
                        {typing[match.id] ? <span className="italic text-[#ff8fb0]">escribiendo…</span> : `${last?.from === "me" ? "Tú: " : ""}${last?.body ?? ""}`}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

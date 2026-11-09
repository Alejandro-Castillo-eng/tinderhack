"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconBack, IconCheck } from "@/components/icons";
import { Splash } from "@/components/ui";
import { HACKATHONS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { useGuard } from "@/lib/useGuard";

export default function HackathonsPage() {
  const ready = useGuard({ needHackathon: false });
  const { state, profiles, setHackathon } = useStore();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  if (!ready) return <Splash />;

  const choose = (id: string) => {
    setHackathon(id);
    router.replace("/discover");
  };

  const joinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    const h = HACKATHONS.find((x) => x.code.toLowerCase() === code.trim().toLowerCase());
    if (h) choose(h.id);
    else setError("No encontramos ningún hackathon con ese código.");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-2 px-4 pt-4">
        {state.hackathonId && (
          <button aria-label="Atrás" onClick={() => router.back()} className="rounded-full p-2 text-white/70 active:bg-white/10">
            <IconBack />
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 no-scrollbar">
        <h1 className="mt-2 text-3xl font-black">¿A qué hackathon vas?</h1>
        <p className="mt-2 text-white/60">Solo verás a gente que va al mismo evento que tú.</p>

        <form onSubmit={joinWithCode} className="mt-6 flex gap-2">
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder="Código del evento"
            aria-label="Código del evento"
            className="min-w-0 flex-1 rounded-2xl bg-white/[0.07] px-4 py-3 text-base uppercase tracking-widest outline-none ring-1 ring-white/10 placeholder:normal-case placeholder:tracking-normal placeholder:text-white/30 focus:ring-2 focus:ring-[#ff3d7f]"
          />
          <button disabled={!code.trim()} className="rounded-2xl bg-white px-5 font-bold text-black disabled:opacity-30">
            Unirme
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}

        <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wider text-white/40">Próximos eventos</p>
        <div className="space-y-3">
          {HACKATHONS.map((h) => {
            const count = profiles.filter((p) => p.hackathons.includes(h.id)).length;
            const selected = state.hackathonId === h.id;
            return (
              <button
                key={h.id}
                onClick={() => choose(h.id)}
                className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left ring-1 transition active:scale-[0.99] ${
                  selected ? "bg-[#ff3d7f]/15 ring-[#ff3d7f]" : "bg-white/[0.05] ring-white/[0.06]"
                }`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/[0.08] text-3xl">{h.emoji}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{h.name}</p>
                  <p className="text-sm text-white/60">
                    {h.city} · {h.dates}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#ff8fb0]">🔥 {count} hackers en TinderHack</p>
                </div>
                {selected && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff3d7f]">
                    <IconCheck className="h-4 w-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-white/40">Demo: eventos ficticios. Códigos de prueba: CDMX26, BOG26, LIMA26, MAD27.</p>
      </div>
    </div>
  );
}

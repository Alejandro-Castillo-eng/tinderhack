"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconShield } from "@/components/icons";
import { Photo } from "@/components/Photo";
import { ProfileDetail } from "@/components/ProfileCard";
import { BottomSheet, Logo } from "@/components/ui";
import { MODE_STYLE, MODES } from "@/lib/constants";
import { ageFrom } from "@/lib/deck";
import { HACKATHONS } from "@/lib/seed";
import { useActiveMatches, useStore } from "@/lib/store";
import type { Mode } from "@/lib/types";

export default function ProfilePage() {
  const { state, saveProfile, reset } = useStore();
  const matches = useActiveMatches();
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const me = state.me!;
  const hackathon = HACKATHONS.find((h) => h.id === state.hackathonId);
  const likes = state.swipes.filter((s) => s.dir === "like").length;

  const toggleMode = (m: Mode) => {
    const on = me.modes.includes(m);
    if (on && me.modes.length === 1) return; // al menos un modo activo
    if (!on && m === "date" && me.interestedIn.length === 0) {
      router.push("/onboarding?edit=1");
      return;
    }
    saveProfile({ ...me, modes: on ? me.modes.filter((x) => x !== m) : [...me.modes, m] });
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto pb-6 no-scrollbar">
      <header className="flex items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
        <Logo className="text-xl" />
      </header>

      <div className="flex flex-col items-center px-6 pt-4 text-center">
        <button onClick={() => setPreview(true)} className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-[#ff3d7f]/70">
          <Photo src={me.photos[0]} alt="Tu foto" className="h-full w-full" emojiSize="text-6xl" />
        </button>
        <h1 className="mt-4 text-2xl font-black">
          {me.name}, <span className="font-light">{ageFrom(me.birthdate)}</span>
        </h1>
        <p className="text-white/60">{me.role}</p>
        <div className="mt-4 flex gap-2">
          <Link href="/onboarding?edit=1" className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black">
            Editar perfil
          </Link>
          <button onClick={() => setPreview(true)} className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold">
            Vista previa
          </button>
        </div>
      </div>

      <div className="mx-4 mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/[0.05] p-4 text-center">
          <p className="text-2xl font-black">{likes}</p>
          <p className="text-xs text-white/50">likes dados</p>
        </div>
        <div className="rounded-2xl bg-white/[0.05] p-4 text-center">
          <p className="text-2xl font-black">{matches.length}</p>
          <p className="text-xs text-white/50">matches</p>
        </div>
      </div>

      <section className="mx-4 mt-6 rounded-2xl bg-white/[0.05] p-4">
        <h2 className="text-sm font-bold text-white/60">Modos activos</h2>
        <div className="mt-3 space-y-2">
          {MODES.map((m) => {
            const on = me.modes.includes(m.id);
            return (
              <button key={m.id} onClick={() => toggleMode(m.id)} role="switch" aria-checked={on} className="flex w-full items-center gap-3 py-1.5 text-left">
                <span className="text-xl">{m.emoji}</span>
                <span className="flex-1 font-semibold">{m.label}</span>
                <span className={`relative h-7 w-12 rounded-full transition ${on ? `bg-gradient-to-r ${MODE_STYLE[m.id].gradient}` : "bg-white/15"}`}>
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <Link href="/hackathons" className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-white/[0.05] p-4">
        <span className="text-2xl">{hackathon?.emoji}</span>
        <div className="flex-1">
          <p className="text-xs text-white/50">Hackathon</p>
          <p className="font-semibold">{hackathon?.name}</p>
        </div>
        <span className="text-sm font-semibold text-[#ff8fb0]">Cambiar</span>
      </Link>

      <div className="mx-4 mt-3 flex gap-3 rounded-2xl bg-white/[0.05] p-4 text-sm text-white/70">
        <IconShield className="h-5 w-5 shrink-0 text-emerald-400" />
        <p>
          Nadie ve a quién le diste like hasta que hay match. Puedes bloquear o reportar desde cualquier chat.
          {state.blocked.length > 0 && ` Tienes ${state.blocked.length} persona(s) bloqueada(s).`}
        </p>
      </div>

      <button onClick={() => setConfirmReset(true)} className="mx-auto mt-8 block text-sm font-semibold text-white/40">
        Borrar mis datos y salir
      </button>

      <BottomSheet open={preview} onClose={() => setPreview(false)} title="Así te ven los demás">
        <ProfileDetail profile={me} />
      </BottomSheet>

      <BottomSheet open={confirmReset} onClose={() => setConfirmReset(false)} title="¿Borrar todos tus datos?">
        <div className="space-y-3 px-5">
          <p className="text-white/70">Se eliminarán tu perfil, likes, matches y mensajes de este dispositivo. No se puede deshacer.</p>
          <button
            onClick={() => {
              reset();
              router.replace("/welcome");
            }}
            className="w-full rounded-full bg-rose-500 py-3.5 font-bold"
          >
            Borrar todo
          </button>
          <button onClick={() => setConfirmReset(false)} className="w-full rounded-full py-3 font-semibold text-white/60">
            Cancelar
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

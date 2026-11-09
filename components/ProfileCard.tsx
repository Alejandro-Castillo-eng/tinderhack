"use client";

import { useState } from "react";
import { ageFrom } from "@/lib/deck";
import { GENDERS, LEVELS } from "@/lib/constants";
import type { Profile } from "@/lib/types";
import { Photo } from "./Photo";
import { Chip } from "./ui";
import { IconCheck, IconGithub, IconInfo } from "./icons";

/** Contenido visual de la tarjeta (sin gestos). `photoIndex` lo controla el padre. */
export function ProfileCardFace({
  profile,
  photoIndex = 0,
  shared = [],
  onInfo,
}: {
  profile: Profile;
  photoIndex?: number;
  shared?: string[];
  onInfo?: () => void;
}) {
  const photos = profile.photos.length ? profile.photos : [""];
  const idx = Math.min(photoIndex, photos.length - 1);
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl shadow-black/60 ring-1 ring-white/10">
      <Photo src={photos[idx]} alt={`Foto de ${profile.name}`} className="absolute inset-0 h-full w-full" emojiSize="text-[7rem] -translate-y-16" />

      {photos.length > 1 && (
        <div className="absolute inset-x-3 top-3 flex gap-1.5">
          {photos.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i === idx ? "bg-white" : "bg-white/35"}`} />
          ))}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-5 pb-5 pt-24">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-3xl font-extrabold leading-tight">
              <span className="truncate">{profile.name}</span>
              <span className="font-light">{ageFrom(profile.birthdate)}</span>
              {profile.verified && (
                <span title="Perfil verificado" className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500">
                  <IconCheck className="h-4 w-4" />
                </span>
              )}
            </h2>
            <p className="mt-0.5 text-sm text-white/80">
              {profile.role} · {LEVELS.find((l) => l.id === profile.level)?.label}
            </p>
          </div>
          {onInfo && (
            <button
              type="button"
              onClick={onInfo}
              aria-label={`Ver perfil completo de ${profile.name}`}
              className="mb-1 shrink-0 rounded-full bg-white/15 p-2 backdrop-blur active:scale-90"
            >
              <IconInfo className="h-6 w-6" />
            </button>
          )}
        </div>
        {idx === 0 ? (
          <p className="mt-2 line-clamp-2 text-[15px] text-white/90">{profile.bio}</p>
        ) : profile.prompts[idx - 1] ? (
          <div className="mt-2 rounded-2xl bg-white/10 p-3 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{profile.prompts[idx - 1].q}</p>
            <p className="mt-1 text-[15px] font-semibold">{profile.prompts[idx - 1].a}</p>
          </div>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 5).map((s) => (
            <Chip key={s} highlight={shared.includes(s)} className="!px-2.5 !py-1 !text-xs">
              {s}
            </Chip>
          ))}
        </div>
        {shared.length > 0 && (
          <p className="mt-2 text-xs font-semibold text-[#ffc1d3]">
            ✨ {shared.length === 1 ? `Los dos usan ${shared[0]}` : `${shared.length} skills en común`}
          </p>
        )}
      </div>
    </div>
  );
}

/** Perfil completo (para la hoja de detalle y la vista previa de "mi perfil"). */
export function ProfileDetail({ profile, shared = [] }: { profile: Profile; shared?: string[] }) {
  const photos = profile.photos.length ? profile.photos : [""];
  const [i, setI] = useState(0);
  return (
    <div className="px-4 pb-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
        <Photo src={photos[i]} alt={`Foto ${i + 1} de ${profile.name}`} className="absolute inset-0 h-full w-full" />
        {photos.length > 1 && (
          <>
            <div className="absolute inset-x-3 top-3 flex gap-1.5">
              {photos.map((_, k) => (
                <div key={k} className={`h-1 flex-1 rounded-full ${k === i ? "bg-white" : "bg-white/35"}`} />
              ))}
            </div>
            <button aria-label="Foto anterior" className="absolute inset-y-0 left-0 w-1/2" onClick={() => setI((x) => Math.max(0, x - 1))} />
            <button
              aria-label="Foto siguiente"
              className="absolute inset-y-0 right-0 w-1/2"
              onClick={() => setI((x) => Math.min(photos.length - 1, x + 1))}
            />
          </>
        )}
      </div>

      <div className="mt-4 px-1">
        <h3 className="flex items-center gap-2 text-2xl font-extrabold">
          {profile.name} <span className="font-light">{ageFrom(profile.birthdate)}</span>
          {profile.verified && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500">
              <IconCheck className="h-3.5 w-3.5" />
            </span>
          )}
        </h3>
        <p className="text-white/70">
          {profile.role} · {LEVELS.find((l) => l.id === profile.level)?.label} · {GENDERS.find((g) => g.id === profile.gender)?.label}
        </p>
        <p className="mt-3 text-[15px] leading-relaxed">{profile.bio}</p>
      </div>

      <div className="mt-4 space-y-3">
        {profile.prompts.map((p) => (
          <div key={p.q} className="rounded-2xl bg-white/[0.06] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{p.q}</p>
            <p className="mt-1 text-lg font-bold leading-snug">{p.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-white/[0.06] p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">Stack</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.map((s) => (
            <Chip key={s} highlight={shared.includes(s)}>
              {s}
            </Chip>
          ))}
        </div>
        {profile.github && (
          <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
            <IconGithub className="h-4 w-4" /> github.com/{profile.github}
          </p>
        )}
      </div>
    </div>
  );
}

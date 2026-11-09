"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { IconBack, IconCamera, IconX } from "@/components/icons";
import { Photo } from "@/components/Photo";
import { Chip, PrimaryButton, Splash } from "@/components/ui";
import { GENDERS, INTEREST_OPTIONS, LEVELS, MODE_STYLE, MODES, PROMPT_QUESTIONS, ROLES, SKILLS } from "@/lib/constants";
import { ageFrom } from "@/lib/deck";
import { fileToPhoto, randomAvatar } from "@/lib/photo";
import { useStore } from "@/lib/store";
import type { Gender, Mode, Profile } from "@/lib/types";

const MAX_PHOTOS = 6;
const MAX_SKILLS = 8;

function emptyProfile(): Profile {
  return {
    id: "me",
    name: "",
    birthdate: "",
    bio: "",
    gender: "woman",
    interestedIn: [],
    modes: ["date", "friends", "team"],
    role: "",
    skills: [],
    level: "mid",
    github: "",
    prompts: [
      { q: PROMPT_QUESTIONS[0], a: "" },
      { q: PROMPT_QUESTIONS[2], a: "" },
    ],
    photos: [],
    hackathons: [],
  };
}

const sameSet = (a: Gender[], b: Gender[]) => a.length === b.length && a.every((x) => b.includes(x));

/** `group` para grupos de chips (botones): un <label> que envuelve botones rompe los clics y los nombres accesibles. */
function Field({ label, children, hint, group }: { label: string; children: React.ReactNode; hint?: string; group?: boolean }) {
  const inner = (
    <>
      <span className="mb-2 block text-sm font-semibold text-white/70">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-white/45">{hint}</span>}
    </>
  );
  return group ? (
    <div role="group" aria-label={label} className="block">
      {inner}
    </div>
  ) : (
    <label className="block">{inner}</label>
  );
}

const inputCls =
  "w-full rounded-2xl bg-white/[0.07] px-4 py-3.5 text-base text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#ff3d7f]";

function OnboardingInner() {
  const { state, hydrated, saveProfile } = useStore();
  const router = useRouter();
  const editing = useSearchParams().get("edit") === "1";
  const [draft, setDraft] = useState<Profile>(emptyProfile);
  const [step, setStep] = useState(0);
  const [adult, setAdult] = useState(false);
  const [coc, setCoc] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!hydrated || loaded.current) return;
    loaded.current = true;
    if (state.me) {
      setDraft(state.me);
      setAdult(true);
      setCoc(true);
    }
  }, [hydrated, state.me]);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const age = draft.birthdate ? ageFrom(draft.birthdate) : 0;
  const wantsDate = draft.modes.includes("date");

  const steps = [
    {
      title: "¿Cómo te llamas?",
      subtitle: "Así aparecerás en tu perfil. Solo tu nombre, sin apellido.",
      valid: draft.name.trim().length >= 2 && age >= 18 && age < 100 && adult,
      body: (
        <div className="space-y-5">
          <Field label="Nombre">
            <input className={inputCls} value={draft.name} maxLength={24} placeholder="Tu nombre" onChange={(e) => set("name", e.target.value)} autoFocus />
          </Field>
          <Field label="Fecha de nacimiento" hint={draft.birthdate && age < 18 ? "Debes tener al menos 18 años para usar TinderHack." : "Solo se muestra tu edad."}>
            <input type="date" className={inputCls} value={draft.birthdate} max={new Date().toISOString().slice(0, 10)} onChange={(e) => set("birthdate", e.target.value)} />
          </Field>
          <label className="flex items-start gap-3 rounded-2xl bg-white/[0.05] p-4 text-sm">
            <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[#ff3d7f]" />
            <span>Confirmo que tengo 18 años o más.</span>
          </label>
        </div>
      ),
    },
    {
      title: "¿Qué buscas?",
      subtitle: "Elige uno o varios. Los likes de cada modo van por separado: un like en Equipo nunca cuenta como cita.",
      valid: draft.modes.length > 0,
      body: (
        <div className="space-y-3">
          {MODES.map((m) => {
            const on = draft.modes.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={on}
                onClick={() => set("modes", on ? draft.modes.filter((x) => x !== m.id) : ([...draft.modes, m.id] as Mode[]))}
                className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left ring-2 transition ${
                  on ? `bg-white/[0.08] ${MODE_STYLE[m.id].ring}` : "bg-white/[0.04] ring-transparent"
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${MODE_STYLE[m.id].gradient}`}>{m.emoji}</div>
                <div className="flex-1">
                  <p className="font-bold">{m.label}</p>
                  <p className="text-sm text-white/60">{m.tagline}</p>
                </div>
                <div className={`h-6 w-6 rounded-full border-2 ${on ? "border-white bg-white" : "border-white/30"}`}>
                  {on && <span className="flex h-full items-center justify-center text-xs font-black text-black">✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: "Sobre ti",
      subtitle: wantsDate ? "Esto se usa solo en el modo Date para mostrarte a quien te interesa (y que tú le interesas)." : "Tu género aparece en tu perfil.",
      valid: !!draft.gender && (!wantsDate || draft.interestedIn.length > 0),
      body: (
        <div className="space-y-6">
          <Field group label="Soy">
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <Chip key={g.id} active={draft.gender === g.id} onClick={() => set("gender", g.id)}>
                  {g.label}
                </Chip>
              ))}
            </div>
          </Field>
          {wantsDate && (
            <Field group label="En el modo Date quiero ver a">
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((o) => (
                  <Chip key={o.id} active={sameSet(draft.interestedIn, o.value)} onClick={() => set("interestedIn", o.value)}>
                    {o.label}
                  </Chip>
                ))}
              </div>
            </Field>
          )}
        </div>
      ),
    },
    {
      title: "Tu lado hacker",
      subtitle: "Sirve para el modo Equipo y para encontrar intereses en común.",
      valid: !!draft.role && draft.skills.length > 0,
      body: (
        <div className="space-y-6">
          <Field group label="Rol principal">
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <Chip key={r} active={draft.role === r} onClick={() => set("role", r)}>
                  {r}
                </Chip>
              ))}
            </div>
          </Field>
          <Field group label="Nivel">
            <div className="flex gap-2">
              {LEVELS.map((l) => (
                <Chip key={l.id} active={draft.level === l.id} onClick={() => set("level", l.id)}>
                  {l.label}
                </Chip>
              ))}
            </div>
          </Field>
          <Field group label={`Skills (${draft.skills.length}/${MAX_SKILLS})`}>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => {
                const on = draft.skills.includes(s);
                return (
                  <Chip
                    key={s}
                    active={on}
                    onClick={() =>
                      set("skills", on ? draft.skills.filter((x) => x !== s) : draft.skills.length < MAX_SKILLS ? [...draft.skills, s] : draft.skills)
                    }
                  >
                    {s}
                  </Chip>
                );
              })}
            </div>
          </Field>
          <Field label="Usuario de GitHub (opcional)">
            <input className={inputCls} value={draft.github ?? ""} placeholder="tu-usuario" maxLength={39} onChange={(e) => set("github", e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))} />
          </Field>
        </div>
      ),
    },
    {
      title: "Cuéntanos más",
      subtitle: "Una bio corta y dos respuestas para romper el hielo.",
      valid: draft.bio.trim().length >= 10 && draft.prompts.every((p) => p.a.trim().length >= 2),
      body: (
        <div className="space-y-5">
          <Field label="Bio" hint={`${draft.bio.length}/160`}>
            <textarea
              className={`${inputCls} min-h-24 resize-none`}
              maxLength={160}
              value={draft.bio}
              placeholder="Frontend de día, DJ de noche…"
              onChange={(e) => set("bio", e.target.value)}
            />
          </Field>
          {draft.prompts.map((p, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.05] p-3">
              <select
                aria-label={`Pregunta ${i + 1}`}
                className="mb-2 w-full rounded-xl bg-transparent px-1 py-1 text-base font-semibold text-[#ff8fb0] outline-none"
                value={p.q}
                onChange={(e) => set("prompts", draft.prompts.map((x, k) => (k === i ? { ...x, q: e.target.value } : x)))}
              >
                {PROMPT_QUESTIONS.filter((q) => q === p.q || !draft.prompts.some((x) => x.q === q)).map((q) => (
                  <option key={q} value={q} className="bg-zinc-900">
                    {q}
                  </option>
                ))}
              </select>
              <input
                className={inputCls}
                maxLength={90}
                value={p.a}
                aria-label={`Respuesta a: ${p.q}`}
                placeholder="Tu respuesta"
                onChange={(e) => set("prompts", draft.prompts.map((x, k) => (k === i ? { ...x, a: e.target.value } : x)))}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Tus fotos",
      subtitle: "Agrega de 1 a 6 fotos. La primera es la principal. Si no quieres subir fotos, usa un avatar.",
      valid: draft.photos.length > 0,
      body: (
        <div>
          <div className="grid grid-cols-3 gap-2.5">
            {Array.from({ length: MAX_PHOTOS }).map((_, i) => {
              const src = draft.photos[i];
              return src ? (
                <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <Photo src={src} alt={`Foto ${i + 1}`} className="h-full w-full" emojiSize="text-5xl" />
                  {i === 0 && <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold">Principal</span>}
                  <button
                    type="button"
                    aria-label={`Quitar foto ${i + 1}`}
                    onClick={() => set("photos", draft.photos.filter((_, k) => k !== i))}
                    className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-[3/4] items-center justify-center rounded-2xl border-2 border-dashed border-white/15 text-white/40"
                  aria-label="Agregar foto"
                >
                  <IconCamera className="h-7 w-7" />
                </button>
              );
            })}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS - draft.photos.length);
              e.target.value = "";
              setPhotoError("");
              try {
                const added = await Promise.all(files.map((f) => fileToPhoto(f)));
                setDraft((d) => ({ ...d, photos: [...d.photos, ...added].slice(0, MAX_PHOTOS) }));
              } catch {
                setPhotoError("No pudimos leer esa imagen. Prueba con otra (JPG o PNG).");
              }
            }}
          />
          {photoError && <p className="mt-3 text-sm text-rose-400">{photoError}</p>}
          <button
            type="button"
            disabled={draft.photos.length >= MAX_PHOTOS}
            onClick={() => set("photos", [...draft.photos, randomAvatar()])}
            className="mt-4 w-full rounded-full bg-white/10 py-3 text-sm font-semibold disabled:opacity-40"
          >
            🎲 Usar un avatar
          </button>
        </div>
      ),
    },
    {
      title: "Código de conducta",
      subtitle: "TinderHack es un espacio seguro. Al entrar te comprometes a:",
      valid: coc,
      body: (
        <div className="space-y-3">
          {[
            ["🤝", "Tratar a todos con respeto. Un “no” o la falta de respuesta también son respuestas."],
            ["🚫", "Cero acoso, comentarios ofensivos o contenido sexual no solicitado."],
            ["🪪", "Ser tú: nada de perfiles falsos. Solo mayores de 18."],
            ["🛡️", "Reportar cualquier cosa que te haga sentir incómodo/a. Lo revisamos."],
            ["🏟️", "Respetar también el código de conducta del hackathon."],
          ].map(([e, t]) => (
            <div key={t} className="flex gap-3 rounded-2xl bg-white/[0.05] p-4 text-[15px]">
              <span className="text-xl">{e}</span>
              <span className="text-white/85">{t}</span>
            </div>
          ))}
          <label className="flex items-start gap-3 rounded-2xl p-2 pt-3 text-sm">
            <input type="checkbox" checked={coc} onChange={(e) => setCoc(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[#ff3d7f]" />
            <span>Acepto el código de conducta.</span>
          </label>
        </div>
      ),
    },
  ];

  const current = steps[step];
  const last = step === steps.length - 1;

  const finish = () => {
    const profile: Profile = {
      ...draft,
      name: draft.name.trim(),
      bio: draft.bio.trim(),
      prompts: draft.prompts.map((p) => ({ q: p.q, a: p.a.trim() })),
    };
    saveProfile(profile);
    router.replace(editing ? "/profile" : state.hackathonId ? "/discover" : "/hackathons");
  };

  if (!hydrated) return <Splash />;

  return (
    <div className="flex min-h-0 flex-1 flex-col pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-3 px-4 pb-2 pt-4">
        <button
          type="button"
          aria-label="Atrás"
          onClick={() => (step === 0 ? router.push(editing ? "/profile" : "/welcome") : setStep(step - 1))}
          className="rounded-full p-2 text-white/70 active:bg-white/10"
        >
          <IconBack />
        </button>
        <div className="flex flex-1 gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition ${i <= step ? "bg-[#ff3d7f]" : "bg-white/10"}`} />
          ))}
        </div>
        <span className="w-10 text-right text-xs text-white/40">
          {step + 1}/{steps.length}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
            <h1 className="mt-4 text-3xl font-black">{current.title}</h1>
            <p className="mb-6 mt-2 text-white/60">{current.subtitle}</p>
            {current.body}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
        <PrimaryButton disabled={!current.valid} onClick={() => (last ? finish() : setStep(step + 1))}>
          {last ? (editing ? "Guardar cambios" : "¡Listo, a hackear! 🚀") : "Continuar"}
        </PrimaryButton>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<Splash />}>
      <OnboardingInner />
    </Suspense>
  );
}

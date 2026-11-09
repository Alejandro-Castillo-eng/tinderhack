"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MODE_STYLE, MODES } from "@/lib/constants";
import { getDeck, sharedSkills } from "@/lib/deck";
import { useStore } from "@/lib/store";
import type { Match, Mode, Profile } from "@/lib/types";
import { IconHeart, IconUndo, IconX } from "./icons";
import { MatchModal } from "./MatchModal";
import { ProfileCardFace, ProfileDetail } from "./ProfileCard";
import { BottomSheet } from "./ui";

const SWIPE_OFFSET = 110;
const SWIPE_VELOCITY = 650;

const cardVariants = {
  enter: { scale: 0.95, y: 12 },
  center: { scale: 1, y: 0, transition: { duration: 0.2 } },
  exit: (dir: number) => ({
    x: dir * 560,
    rotate: dir * 24,
    opacity: 0,
    zIndex: 30,
    transition: { duration: 0.35, ease: "easeOut" as const },
  }),
};

function SwipeCard({
  profile,
  shared,
  onSwipe,
  onInfo,
}: {
  profile: Profile;
  shared: string[];
  onSwipe: (dir: 1 | -1) => void;
  onInfo: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-14, 14]);
  const likeOpacity = useTransform(x, [25, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-110, -25], [1, 0]);
  const ref = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState(0);
  const total = Math.max(1, profile.photos.length);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x > SWIPE_OFFSET || (velocity.x > SWIPE_VELOCITY && offset.x > 20)) onSwipe(1);
    else if (offset.x < -SWIPE_OFFSET || (velocity.x < -SWIPE_VELOCITY && offset.x < -20)) onSwipe(-1);
  };

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 z-10 cursor-grab touch-none active:cursor-grabbing"
      style={{ x, rotate }}
      drag
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      onTap={(e, info) => {
        if ((e.target as HTMLElement).closest("button")) return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const leftSide = info.point.x - r.left < r.width / 2;
        setPhoto((p) => (leftSide ? Math.max(0, p - 1) : Math.min(total - 1, p + 1)));
      }}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      data-testid="swipe-card"
    >
      <ProfileCardFace profile={profile} photoIndex={photo} shared={shared} onInfo={onInfo} />
      <motion.div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute left-6 top-10 -rotate-12 rounded-xl border-4 border-emerald-400 px-3 py-1 text-4xl font-black tracking-wider text-emerald-400"
      >
        LIKE
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="pointer-events-none absolute right-6 top-10 rotate-12 rounded-xl border-4 border-rose-500 px-3 py-1 text-4xl font-black tracking-wider text-rose-500"
      >
        NOPE
      </motion.div>
    </motion.div>
  );
}

export function SwipeDeck({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { state, profiles, swipe, undo, recyclePasses } = useStore();
  const deck = useMemo(() => getDeck(state, profiles, mode), [state, profiles, mode]);
  const [exitDir, setExitDir] = useState<1 | -1>(1);
  const [matchData, setMatchData] = useState<{ match: Match; profile: Profile } | null>(null);
  const [detail, setDetail] = useState<Profile | null>(null);
  const me = state.me!;
  const top = deck[0];
  const next = deck[1];
  const modeInfo = MODES.find((m) => m.id === mode)!;
  const canUndo = state.swipes.some((s) => s.mode === mode);

  const commit = useCallback(
    (p: Profile, dir: 1 | -1) => {
      setExitDir(dir);
      const m = swipe(p, mode, dir > 0 ? "like" : "pass");
      if (m) window.setTimeout(() => setMatchData({ match: m, profile: p }), 380);
    },
    [swipe, mode],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!top || matchData || detail) return;
      if (e.key === "ArrowRight") commit(top, 1);
      if (e.key === "ArrowLeft") commit(top, -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [top, matchData, detail, commit]);

  return (
    <>
      <div className="relative mx-3 flex-1">
        {!top && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 px-8 text-center">
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
              <span className={`absolute inset-0 animate-ping rounded-full bg-gradient-to-r opacity-30 ${MODE_STYLE[mode].gradient}`} />
              <span className="text-5xl">{modeInfo.emoji}</span>
            </div>
            <h3 className="text-xl font-bold">No hay más perfiles por ahora</h3>
            <p className="mt-2 text-sm text-white/60">
              Ya viste a todas las personas de este hackathon en el modo {modeInfo.label}. Prueba otro modo o vuelve más tarde.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {state.swipes.some((s) => s.mode === mode && s.dir === "pass") && (
                <button onClick={() => recyclePasses(mode)} className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold">
                  Volver a ver a quienes pasé
                </button>
              )}
              <Link href="/hackathons" className="rounded-full px-5 py-2.5 text-sm font-semibold text-white/70">
                Cambiar de hackathon
              </Link>
            </div>
          </div>
        )}
        {next && (
          <div className="absolute inset-0 translate-y-3 scale-[0.95]" aria-hidden="true">
            <ProfileCardFace profile={next} shared={sharedSkills(me, next)} />
          </div>
        )}
        <AnimatePresence custom={exitDir}>
          {top && (
            <SwipeCard
              key={top.id}
              profile={top}
              shared={sharedSkills(me, top)}
              onSwipe={(d) => commit(top, d)}
              onInfo={() => setDetail(top)}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-5 py-4">
        <button
          aria-label="Deshacer último swipe"
          disabled={!canUndo}
          onClick={() => undo(mode)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.07] text-amber-300 ring-1 ring-white/10 transition active:scale-90 disabled:opacity-30"
        >
          <IconUndo className="h-5 w-5" />
        </button>
        <button
          aria-label="Pasar"
          disabled={!top}
          onClick={() => top && commit(top, -1)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.07] text-rose-500 ring-1 ring-white/10 transition active:scale-90 disabled:opacity-30"
        >
          <IconX className="h-8 w-8" />
        </button>
        <button
          aria-label="Me gusta"
          disabled={!top}
          onClick={() => top && commit(top, 1)}
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg shadow-black/40 transition active:scale-90 disabled:opacity-30 ${MODE_STYLE[mode].gradient}`}
        >
          <IconHeart className="h-8 w-8" />
        </button>
      </div>

      <BottomSheet open={!!detail} onClose={() => setDetail(null)} title={detail ? `Perfil de ${detail.name}` : undefined}>
        {detail && (
          <>
            <ProfileDetail profile={detail} shared={sharedSkills(me, detail)} />
            <div className="flex gap-3 px-4 pt-2">
              <button
                onClick={() => {
                  setDetail(null);
                  commit(detail, -1);
                }}
                className="flex-1 rounded-full bg-white/10 py-3.5 font-semibold"
              >
                Pasar
              </button>
              <button
                onClick={() => {
                  setDetail(null);
                  commit(detail, 1);
                }}
                className={`flex-1 rounded-full bg-gradient-to-r py-3.5 font-bold text-black ${MODE_STYLE[mode].gradient}`}
              >
                Me gusta
              </button>
            </div>
          </>
        )}
      </BottomSheet>

      <MatchModal
        data={matchData}
        me={me}
        onClose={() => setMatchData(null)}
        onChat={() => {
          const id = matchData?.match.id;
          setMatchData(null);
          if (id) router.push(`/chat/${id}`);
        }}
      />
    </>
  );
}

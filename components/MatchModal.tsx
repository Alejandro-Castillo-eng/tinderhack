"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MATCH_TITLE, MODE_STYLE } from "@/lib/constants";
import type { Match, Profile } from "@/lib/types";
import { Photo } from "./Photo";
import { GhostButton, PrimaryButton } from "./ui";

export function MatchModal({
  data,
  me,
  onChat,
  onClose,
}: {
  data: { match: Match; profile: Profile } | null;
  me: Profile;
  onChat: () => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black/85 px-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={MATCH_TITLE[data.match.mode]}
        >
          <div className={`pointer-events-none absolute -top-32 h-80 w-80 rounded-full bg-gradient-to-r opacity-40 blur-3xl ${MODE_STYLE[data.match.mode].gradient}`} />
          <motion.h2
            className={`bg-gradient-to-r bg-clip-text text-center text-4xl font-black italic text-transparent ${MODE_STYLE[data.match.mode].gradient}`}
            initial={{ scale: 0.4, rotate: -8 }}
            animate={{ scale: 1, rotate: -4 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
          >
            {MATCH_TITLE[data.match.mode]}
          </motion.h2>
          <p className="mt-3 text-center text-white/80">
            Tú y {data.profile.name} se dieron like. ¡Rompe el hielo!
          </p>

          <div className="relative mt-10 flex h-44 w-72 items-center justify-center">
            <motion.div
              className="absolute left-2 h-40 w-32 overflow-hidden rounded-2xl ring-4 ring-white"
              initial={{ x: -120, rotate: -20, opacity: 0 }}
              animate={{ x: 0, rotate: -8, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
            >
              <Photo src={me.photos[0]} alt="Tu foto" className="h-full w-full" emojiSize="text-6xl" />
            </motion.div>
            <motion.div
              className="absolute right-2 h-40 w-32 overflow-hidden rounded-2xl ring-4 ring-white"
              initial={{ x: 120, rotate: 20, opacity: 0 }}
              animate={{ x: 0, rotate: 8, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
            >
              <Photo src={data.profile.photos[0]} alt={`Foto de ${data.profile.name}`} className="h-full w-full" emojiSize="text-6xl" />
            </motion.div>
            <motion.div
              className="absolute z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl shadow-xl"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              {data.match.mode === "date" ? "💘" : data.match.mode === "friends" ? "🤝" : "🛠️"}
            </motion.div>
          </div>

          <div className="mt-12 w-full space-y-3">
            <PrimaryButton onClick={onChat}>Enviar mensaje</PrimaryButton>
            <GhostButton onClick={onClose}>Seguir deslizando</GhostButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

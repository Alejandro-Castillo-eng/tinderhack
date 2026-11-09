"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/ui";
import { MODE_STYLE, MODES } from "@/lib/constants";
import { useStore } from "@/lib/store";

export default function Welcome() {
  const { state, hydrated } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (hydrated && state.me) router.replace("/discover");
  }, [hydrated, state.me, router]);

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))] no-scrollbar">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#ff3d7f]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-64 w-64 rounded-full bg-[#6366f1]/25 blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <Logo className="text-4xl" />
        <h1 className="mt-6 text-[2.1rem] font-black leading-[1.1]">
          Conoce gente en tu próximo <span className="text-[#ff5c8a]">hackathon</span>.
        </h1>
        <p className="mt-3 text-white/70">
          Desliza, haz match y rompe el hielo antes del coffee break. Para citas, amigos o para armar tu equipo.
        </p>
      </motion.div>

      <div className="relative mt-8 space-y-3">
        {MODES.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="flex items-center gap-4 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/[0.06]"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${MODE_STYLE[m.id].gradient}`}>
              {m.emoji}
            </div>
            <div>
              <p className="font-bold">{m.label}</p>
              <p className="text-sm text-white/60">{m.tagline}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative mt-auto pt-8">
        <Link
          href="/onboarding"
          className="block w-full rounded-full bg-gradient-to-r from-[#ff3d7f] to-[#ff8a3d] py-4 text-center text-base font-bold shadow-lg shadow-[#ff3d7f]/30 active:scale-[0.98]"
        >
          Crear mi perfil
        </Link>
        <p className="mt-4 text-center text-xs leading-relaxed text-white/45">
          Solo mayores de 18. Versión demo: tus datos se guardan únicamente en este dispositivo y los perfiles son de ejemplo.
        </p>
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MODE_STYLE, MODES } from "@/lib/constants";
import type { Mode } from "@/lib/types";

export function Chip({
  children,
  active,
  highlight,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  active?: boolean;
  highlight?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const cls = `inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${
    active
      ? "bg-white text-black"
      : highlight
        ? "bg-[#ff3d7f]/25 text-[#ffc1d3] ring-1 ring-[#ff3d7f]/60"
        : "bg-white/10 text-white/85"
  } ${onClick ? "active:scale-95" : ""} ${className}`;
  return onClick ? (
    <button type="button" onClick={onClick} className={cls} aria-pressed={active}>
      {children}
    </button>
  ) : (
    <span className={cls}>{children}</span>
  );
}

export function ModeBadge({ mode, className = "" }: { mode: Mode; className?: string }) {
  const m = MODES.find((x) => x.id === mode)!;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2 py-0.5 text-xs font-semibold text-black ${MODE_STYLE[mode].gradient} ${className}`}>
      {m.emoji} {m.label}
    </span>
  );
}

export function PrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-full bg-gradient-to-r from-[#ff3d7f] to-[#ff8a3d] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#ff3d7f]/30 transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-full bg-white/10 px-6 py-4 text-base font-semibold text-white transition active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}

/** Hoja inferior tipo iOS/Android, contenida dentro del marco del teléfono. */
export function BottomSheet({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="absolute inset-0 z-50 flex flex-col justify-end" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.button
            aria-label="Cerrar"
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative max-h-[88%] overflow-y-auto rounded-t-3xl bg-[#17171f] pb-[max(1.25rem,env(safe-area-inset-bottom))] no-scrollbar"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
          >
            <div className="sticky top-0 z-10 flex justify-center bg-[#17171f] pb-2 pt-3">
              <div className="h-1.5 w-10 rounded-full bg-white/20" />
            </div>
            {title && <h2 className="px-5 pb-3 text-lg font-bold">{title}</h2>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Logo({ className = "text-2xl" }: { className?: string }) {
  return (
    <span className={`font-black tracking-tight ${className}`}>
      <span className="bg-gradient-to-r from-[#ff3d7f] to-[#ff8a3d] bg-clip-text text-transparent">tinder</span>
      <span className="font-mono text-white">hack</span>
      <span className="text-[#ff3d7f]">_</span>
    </span>
  );
}

export function Splash() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
        <Logo className="text-3xl" />
      </motion.div>
    </div>
  );
}

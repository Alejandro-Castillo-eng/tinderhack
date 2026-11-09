"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DEMO_REPLIES } from "./constants";
import { SEED_PROFILES } from "./seed";
import type { AppState, Match, Mode, Profile, SwipeDir } from "./types";

/**
 * Capa de datos del MVP. Todo se guarda en localStorage de este dispositivo y los
 * perfiles son de demo. Esta API es la que luego se implementará contra Supabase.
 */

const STORAGE_KEY = "tinderhack:v1";

const EMPTY: AppState = {
  me: null,
  hackathonId: null,
  swipes: [],
  matches: [],
  messages: [],
  blocked: [],
  reports: [],
};

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

interface StoreApi {
  state: AppState;
  hydrated: boolean;
  profiles: Profile[];
  typing: Record<string, boolean>;
  getProfile: (id: string) => Profile | undefined;
  saveProfile: (p: Profile) => void;
  setHackathon: (id: string) => void;
  swipe: (p: Profile, mode: Mode, dir: SwipeDir) => Match | null;
  undo: (mode: Mode) => boolean;
  recyclePasses: (mode: Mode) => void;
  sendMessage: (matchId: string, body: string) => void;
  unmatch: (matchId: string) => void;
  block: (profileId: string) => void;
  report: (profileId: string, reason: string, details: string) => void;
  reset: () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const stateRef = useRef(state);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const loaded = { ...EMPTY, ...JSON.parse(raw) } as AppState;
        stateRef.current = loaded;
        setState(loaded);
      }
    } catch {
      // Datos corruptos o storage bloqueado: se empieza de cero.
    }
    setHydrated(true);
    const t = timers.current;
    return () => t.forEach((id) => clearTimeout(id));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Cuota llena (fotos muy grandes) o modo privado: la app sigue funcionando en memoria.
    }
  }, [state, hydrated]);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    const next = fn(stateRef.current);
    stateRef.current = next;
    setState(next);
  }, []);

  const profiles = SEED_PROFILES;
  const getProfile = useCallback(
    (id: string) => (id === stateRef.current.me?.id ? stateRef.current.me ?? undefined : profiles.find((p) => p.id === id)),
    [profiles],
  );

  const saveProfile = useCallback((p: Profile) => update((s) => ({ ...s, me: p })), [update]);
  const setHackathon = useCallback((id: string) => update((s) => ({ ...s, hackathonId: id })), [update]);

  const swipe = useCallback(
    (p: Profile, mode: Mode, dir: SwipeDir): Match | null => {
      let match: Match | null = null;
      // Equivale al trigger de Postgres: si el otro ya te dio like en el mismo modo, hay match.
      if (dir === "like" && p.likesYou?.includes(mode)) {
        match = { id: uid(), profileId: p.id, mode, createdAt: Date.now() };
      }
      update((s) => ({
        ...s,
        swipes: [...s.swipes, { targetId: p.id, mode, dir, at: Date.now() }],
        matches: match ? [...s.matches, match] : s.matches,
      }));
      if (match && typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([30, 40, 60]);
      }
      return match;
    },
    [update],
  );

  const undo = useCallback(
    (mode: Mode) => {
      const s = stateRef.current;
      const idx = s.swipes.map((x) => x.mode).lastIndexOf(mode);
      if (idx < 0) return false;
      const last = s.swipes[idx];
      if (s.matches.some((m) => m.mode === mode && m.profileId === last.targetId)) return false;
      update((st) => ({ ...st, swipes: st.swipes.filter((_, i) => i !== idx) }));
      return true;
    },
    [update],
  );

  const recyclePasses = useCallback(
    (mode: Mode) =>
      update((s) => ({ ...s, swipes: s.swipes.filter((x) => !(x.mode === mode && x.dir === "pass")) })),
    [update],
  );

  const scheduleDemoReply = useCallback(
    (matchId: string) => {
      const s = stateRef.current;
      const match = s.matches.find((m) => m.id === matchId);
      if (!match || match.unmatched) return;
      const replies = DEMO_REPLIES[match.mode];
      const sent = s.messages.filter((m) => m.matchId === matchId && m.from === match.profileId).length;
      if (sent >= replies.length) return;
      setTyping((t) => ({ ...t, [matchId]: true }));
      const id = window.setTimeout(() => {
        setTyping((t) => ({ ...t, [matchId]: false }));
        const current = stateRef.current.matches.find((m) => m.id === matchId);
        if (!current || current.unmatched || stateRef.current.blocked.includes(match.profileId)) return;
        update((st) => ({
          ...st,
          messages: [
            ...st.messages,
            { id: uid(), matchId, from: match.profileId, body: replies[sent], at: Date.now() },
          ],
        }));
      }, 1400 + Math.random() * 1400);
      timers.current.push(id);
    },
    [update],
  );

  const sendMessage = useCallback(
    (matchId: string, body: string) => {
      const text = body.trim();
      if (!text) return;
      update((s) => ({
        ...s,
        messages: [...s.messages, { id: uid(), matchId, from: "me", body: text, at: Date.now() }],
      }));
      if (!typing[matchId]) scheduleDemoReply(matchId);
    },
    [update, scheduleDemoReply, typing],
  );

  const unmatch = useCallback(
    (matchId: string) =>
      update((s) => ({ ...s, matches: s.matches.map((m) => (m.id === matchId ? { ...m, unmatched: true } : m)) })),
    [update],
  );

  const block = useCallback(
    (profileId: string) =>
      update((s) => ({
        ...s,
        blocked: s.blocked.includes(profileId) ? s.blocked : [...s.blocked, profileId],
        matches: s.matches.map((m) => (m.profileId === profileId ? { ...m, unmatched: true } : m)),
      })),
    [update],
  );

  const report = useCallback(
    (profileId: string, reason: string, details: string) => {
      update((s) => ({ ...s, reports: [...s.reports, { profileId, reason, details, at: Date.now() }] }));
      block(profileId);
    },
    [update, block],
  );

  const reset = useCallback(() => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
    setTyping({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    stateRef.current = EMPTY;
    setState(EMPTY);
  }, []);

  const api = useMemo<StoreApi>(
    () => ({
      state,
      hydrated,
      profiles,
      typing,
      getProfile,
      saveProfile,
      setHackathon,
      swipe,
      undo,
      recyclePasses,
      sendMessage,
      unmatch,
      block,
      report,
      reset,
    }),
    [state, hydrated, profiles, typing, getProfile, saveProfile, setHackathon, swipe, undo, recyclePasses, sendMessage, unmatch, block, report, reset],
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de <StoreProvider>");
  return ctx;
}

/** Matches activos (sin deshacer ni bloqueados), con su perfil y último mensaje. */
export function useActiveMatches() {
  const { state, getProfile } = useStore();
  return useMemo(() => {
    return state.matches
      .filter((m) => !m.unmatched && !state.blocked.includes(m.profileId))
      .map((m) => {
        const msgs = state.messages.filter((x) => x.matchId === m.id);
        return { match: m, profile: getProfile(m.profileId)!, last: msgs[msgs.length - 1], count: msgs.length };
      })
      .filter((x) => x.profile);
  }, [state.matches, state.messages, state.blocked, getProfile]);
}

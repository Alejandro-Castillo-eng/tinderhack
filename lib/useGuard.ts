"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "./store";

/** Redirige al onboarding o a elegir hackathon si falta algo. Devuelve true cuando la pantalla puede mostrarse. */
export function useGuard({ needHackathon = true }: { needHackathon?: boolean } = {}): boolean {
  const { state, hydrated } = useStore();
  const router = useRouter();
  const missingProfile = !state.me;
  const missingHackathon = needHackathon && !state.hackathonId;

  useEffect(() => {
    if (!hydrated) return;
    if (missingProfile) router.replace("/welcome");
    else if (missingHackathon) router.replace("/hackathons");
  }, [hydrated, missingProfile, missingHackathon, router]);

  return hydrated && !missingProfile && !missingHackathon;
}

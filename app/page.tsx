"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Splash } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function Home() {
  const { state, hydrated } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (!hydrated) return;
    if (!state.me) router.replace("/welcome");
    else if (!state.hackathonId) router.replace("/hackathons");
    else router.replace("/discover");
  }, [hydrated, state.me, state.hackathonId, router]);
  return <Splash />;
}

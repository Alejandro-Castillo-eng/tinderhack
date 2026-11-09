"use client";

import { useEffect } from "react";
import { asset } from "@/lib/base";

/** Registra el service worker (solo en producción) para que la app sea instalable como PWA. */
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(asset("/sw.js")).catch(() => {});
    }
  }, []);
  return null;
}

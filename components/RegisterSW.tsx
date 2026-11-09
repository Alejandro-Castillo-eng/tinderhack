"use client";

import { useEffect } from "react";

/** Registra el service worker (solo en producción) para que la app sea instalable como PWA. */
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

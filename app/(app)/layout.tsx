"use client";

import { BottomNav } from "@/components/BottomNav";
import { Splash } from "@/components/ui";
import { useGuard } from "@/lib/useGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const ready = useGuard();
  if (!ready) return <Splash />;
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <BottomNav />
    </>
  );
}

import type { Metadata, Viewport } from "next";
import { StoreProvider } from "@/lib/store";
import { RegisterSW } from "@/components/RegisterSW";
import { asset } from "@/lib/base";
import "./globals.css";

export const metadata: Metadata = {
  title: "TinderHack",
  description: "Conoce gente en hackathones: citas, amigos y equipo.",
  manifest: asset("/manifest.webmanifest"),
  appleWebApp: { capable: true, title: "TinderHack", statusBarStyle: "black-translucent" },
  icons: {
    icon: asset("/icon.svg"),
    apple: asset("/apple-touch-icon.png"),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b10",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <StoreProvider>
          {/* Marco tipo teléfono: pantalla completa en móvil, centrado en escritorio */}
          <main className="relative mx-auto flex h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-[#0b0b10] sm:my-[max(1rem,calc((100dvh-880px)/2))] sm:h-[min(880px,calc(100dvh-2rem))] sm:rounded-[2.5rem] sm:shadow-2xl sm:shadow-black sm:ring-1 sm:ring-white/10">
            {children}
          </main>
        </StoreProvider>
        <RegisterSW />
      </body>
    </html>
  );
}

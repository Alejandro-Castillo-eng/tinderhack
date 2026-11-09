"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconBack, IconDots, IconSend, IconShield } from "@/components/icons";
import { Photo } from "@/components/Photo";
import { ProfileDetail } from "@/components/ProfileCard";
import { BottomSheet, ModeBadge, Splash } from "@/components/ui";
import { ICEBREAKERS, REPORT_REASONS } from "@/lib/constants";
import { sharedSkills } from "@/lib/deck";
import { useStore } from "@/lib/store";
import { useGuard } from "@/lib/useGuard";

type Sheet = null | "menu" | "profile" | "report" | "confirm-unmatch" | "confirm-block";

export default function ChatPage() {
  const ready = useGuard();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { state, typing, getProfile, sendMessage, unmatch, block, report } = useStore();
  const [text, setText] = useState("");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const match = state.matches.find((m) => m.id === id);
  const profile = match ? getProfile(match.profileId) : undefined;
  const messages = state.messages.filter((m) => m.matchId === id);
  const isTyping = !!typing[id];
  const gone = !match || match.unmatched || (profile && state.blocked.includes(profile.id));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isTyping]);

  useEffect(() => {
    if (ready && gone) router.replace("/matches");
  }, [ready, gone, router]);

  if (!ready || gone || !profile || !match) return <Splash />;

  const send = (body: string) => {
    if (!body.trim()) return;
    sendMessage(match.id, body);
    setText("");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center gap-2 border-b border-white/[0.06] px-2 pb-2.5 pt-[max(0.6rem,env(safe-area-inset-top))]">
        <button aria-label="Volver a matches" onClick={() => router.push("/matches")} className="rounded-full p-2 text-white/80 active:bg-white/10">
          <IconBack />
        </button>
        <button onClick={() => setSheet("profile")} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Photo src={profile.photos[0]} alt={profile.name} className="h-full w-full" emojiSize="text-xl" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold leading-tight">{profile.name}</p>
            <ModeBadge mode={match.mode} className="mt-0.5 !text-[10px]" />
          </div>
        </button>
        <button aria-label="Opciones" onClick={() => setSheet("menu")} className="rounded-full p-2 text-white/80 active:bg-white/10">
          <IconDots />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center pt-6 text-center">
            <div className="h-28 w-24 overflow-hidden rounded-2xl">
              <Photo src={profile.photos[0]} alt={profile.name} className="h-full w-full" emojiSize="text-5xl" />
            </div>
            <p className="mt-4 font-bold">Hiciste match con {profile.name}</p>
            <p className="mt-1 text-sm text-white/55">Rompe el hielo con una de estas ideas:</p>
            <div className="mt-5 flex w-full flex-col gap-2">
              {ICEBREAKERS[match.mode].map((ice) => (
                <button key={ice} onClick={() => send(ice)} className="rounded-2xl bg-white/[0.07] px-4 py-3 text-left text-[15px] ring-1 ring-white/10 active:scale-[0.99]">
                  {ice}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          {messages.map((m, i) => {
            const mine = m.from === "me";
            const prevSame = messages[i - 1]?.from === m.from;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"} ${prevSame ? "" : "pt-2"}`}>
                <p
                  className={`max-w-[78%] whitespace-pre-wrap break-words rounded-3xl px-4 py-2.5 text-[15px] leading-snug ${
                    mine ? "rounded-br-lg bg-gradient-to-r from-[#ff3d7f] to-[#ff6a5c]" : "rounded-bl-lg bg-white/[0.09]"
                  }`}
                >
                  {m.body}
                </p>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex pt-2" aria-label={`${profile.name} está escribiendo`}>
              <div className="flex gap-1 rounded-3xl rounded-bl-lg bg-white/[0.09] px-4 py-3.5">
                <span className="typing-dot h-2 w-2 rounded-full bg-white" />
                <span className="typing-dot h-2 w-2 rounded-full bg-white" />
                <span className="typing-dot h-2 w-2 rounded-full bg-white" />
              </div>
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
        className="flex shrink-0 items-end gap-2 border-t border-white/[0.06] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje…"
          aria-label="Mensaje"
          maxLength={500}
          className="min-w-0 flex-1 rounded-full bg-white/[0.07] px-4 py-3 text-base outline-none ring-1 ring-white/10 placeholder:text-white/35 focus:ring-[#ff3d7f]"
        />
        <button
          type="submit"
          aria-label="Enviar"
          disabled={!text.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#ff3d7f] to-[#ff8a3d] transition active:scale-90 disabled:opacity-30"
        >
          <IconSend className="h-5 w-5" />
        </button>
      </form>

      <BottomSheet open={sheet === "menu"} onClose={() => setSheet(null)}>
        <div className="px-4 pb-2">
          {[
            { label: `Ver perfil de ${profile.name}`, action: () => setSheet("profile"), cls: "" },
            { label: "Deshacer match", action: () => setSheet("confirm-unmatch"), cls: "" },
            { label: "Bloquear", action: () => setSheet("confirm-block"), cls: "text-rose-400" },
            { label: "Reportar", action: () => setSheet("report"), cls: "text-rose-400" },
          ].map((o) => (
            <button key={o.label} onClick={o.action} className={`w-full rounded-2xl px-4 py-4 text-left text-base font-semibold active:bg-white/[0.06] ${o.cls}`}>
              {o.label}
            </button>
          ))}
          <p className="flex items-center gap-2 px-4 pt-2 text-xs text-white/40">
            <IconShield className="h-4 w-4" /> Tu seguridad es lo primero. Los reportes son anónimos.
          </p>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "profile"} onClose={() => setSheet(null)} title={profile.name}>
        <ProfileDetail profile={profile} shared={state.me ? sharedSkills(state.me, profile) : []} />
      </BottomSheet>

      <BottomSheet open={sheet === "confirm-unmatch"} onClose={() => setSheet(null)} title="¿Deshacer el match?">
        <div className="space-y-3 px-5">
          <p className="text-white/70">{profile.name} desaparecerá de tus matches y se borrará la conversación.</p>
          <button
            onClick={() => {
              unmatch(match.id);
              router.replace("/matches");
            }}
            className="w-full rounded-full bg-white py-3.5 font-bold text-black"
          >
            Deshacer match
          </button>
          <button onClick={() => setSheet(null)} className="w-full rounded-full py-3 font-semibold text-white/60">
            Cancelar
          </button>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "confirm-block"} onClose={() => setSheet(null)} title={`¿Bloquear a ${profile.name}?`}>
        <div className="space-y-3 px-5">
          <p className="text-white/70">No volverán a verse en ningún modo ni podrán escribirse. No le avisaremos.</p>
          <button
            onClick={() => {
              block(profile.id);
              router.replace("/matches");
            }}
            className="w-full rounded-full bg-rose-500 py-3.5 font-bold"
          >
            Bloquear
          </button>
          <button onClick={() => setSheet(null)} className="w-full rounded-full py-3 font-semibold text-white/60">
            Cancelar
          </button>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "report"} onClose={() => setSheet(null)} title={`Reportar a ${profile.name}`}>
        <div className="space-y-2 px-5">
          <p className="pb-2 text-sm text-white/60">Nadie sabrá que fuiste tú. También lo bloquearemos para ti.</p>
          {REPORT_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              aria-pressed={reason === r}
              className={`w-full rounded-2xl px-4 py-3 text-left font-medium ring-1 ${reason === r ? "bg-rose-500/15 ring-rose-500" : "bg-white/[0.05] ring-white/10"}`}
            >
              {r}
            </button>
          ))}
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Cuéntanos qué pasó (opcional)"
            maxLength={500}
            className="mt-2 min-h-20 w-full resize-none rounded-2xl bg-white/[0.07] px-4 py-3 text-base outline-none ring-1 ring-white/10 placeholder:text-white/35"
          />
          <button
            disabled={!reason}
            onClick={() => {
              report(profile.id, reason, details);
              router.replace("/matches");
            }}
            className="w-full rounded-full bg-rose-500 py-3.5 font-bold disabled:opacity-40"
          >
            Enviar reporte
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

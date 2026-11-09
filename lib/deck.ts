import type { AppState, Mode, Profile } from "./types";

export function ageFrom(birthdate: string, now = new Date()): number {
  const b = new Date(birthdate + "T00:00:00");
  if (Number.isNaN(b.getTime())) return 0;
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

export function sharedSkills(a: Profile, b: Profile): string[] {
  return a.skills.filter((s) => b.skills.includes(s));
}

/**
 * Perfiles que te aparecen en un modo. Replica la lógica que en producción irá
 * en una función de Postgres (`get_deck`), para que no se pueda saltar desde el cliente:
 * - mismo hackathon, mayores de 18, con el modo activo los dos
 * - no swipeados, sin match previo y sin bloqueo
 * - en Date: interés de género mutuo
 */
export function getDeck(state: AppState, profiles: Profile[], mode: Mode): Profile[] {
  const me = state.me;
  const hid = state.hackathonId;
  if (!me || !hid || !me.modes.includes(mode)) return [];

  const swiped = new Set(state.swipes.filter((s) => s.mode === mode).map((s) => s.targetId));
  const matched = new Set(state.matches.filter((m) => m.mode === mode).map((m) => m.profileId));
  const blocked = new Set(state.blocked);

  let list = profiles.filter(
    (p) =>
      p.id !== me.id &&
      p.hackathons.includes(hid) &&
      p.modes.includes(mode) &&
      ageFrom(p.birthdate) >= 18 &&
      !swiped.has(p.id) &&
      !matched.has(p.id) &&
      !blocked.has(p.id),
  );

  if (mode === "date") {
    list = list.filter((p) => me.interestedIn.includes(p.gender) && p.interestedIn.includes(me.gender));
  }

  const score = (p: Profile) => {
    const shared = sharedSkills(me, p).length;
    if (mode === "team") {
      // En Equipo se priorizan perfiles complementarios: otro rol y algo de stack en común.
      return (p.role !== me.role ? 3 : 0) + Math.min(shared, 2) * 0.5;
    }
    return shared;
  };

  return list
    .map((p, i) => ({ p, s: score(p), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.p);
}

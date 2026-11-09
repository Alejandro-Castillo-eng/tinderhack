export type Mode = "date" | "friends" | "team";
export type Gender = "man" | "woman" | "nonbinary" | "other";
export type Level = "junior" | "mid" | "senior";
export type SwipeDir = "like" | "pass";

export interface PromptAnswer {
  q: string;
  a: string;
}

export interface Profile {
  id: string;
  name: string;
  /** YYYY-MM-DD */
  birthdate: string;
  bio: string;
  gender: Gender;
  /** Géneros que esta persona quiere ver en el modo Date */
  interestedIn: Gender[];
  modes: Mode[];
  role: string;
  skills: string[];
  level: Level;
  github?: string;
  prompts: PromptAnswer[];
  /** data: URL de una foto subida, o "grad:#color1,#color2,emoji" para un avatar generado */
  photos: string[];
  hackathons: string[];
  verified?: boolean;
  /** Solo perfiles de demo: modos en los que esta persona ya te dio like */
  likesYou?: Mode[];
}

export interface Hackathon {
  id: string;
  name: string;
  city: string;
  dates: string;
  code: string;
  emoji: string;
}

export interface Swipe {
  targetId: string;
  mode: Mode;
  dir: SwipeDir;
  at: number;
}

export interface Match {
  id: string;
  profileId: string;
  mode: Mode;
  createdAt: number;
  unmatched?: boolean;
}

export interface Message {
  id: string;
  matchId: string;
  /** "me" o el id del perfil que lo envió */
  from: string;
  body: string;
  at: number;
}

export interface Report {
  profileId: string;
  reason: string;
  details: string;
  at: number;
}

export interface AppState {
  me: Profile | null;
  hackathonId: string | null;
  swipes: Swipe[];
  matches: Match[];
  messages: Message[];
  blocked: string[];
  reports: Report[];
}

import type { Gender, Level, Mode } from "./types";

export const MODES: { id: Mode; label: string; emoji: string; tagline: string }[] = [
  { id: "date", label: "Date", emoji: "💘", tagline: "Conoce a alguien especial" },
  { id: "friends", label: "Amigos", emoji: "🤝", tagline: "Haz amigos y networking" },
  { id: "team", label: "Equipo", emoji: "🛠️", tagline: "Arma tu equipo para hackear" },
];

export const MODE_STYLE: Record<Mode, { gradient: string; text: string; ring: string; bg: string }> = {
  date: {
    gradient: "from-[#ff3d7f] to-[#ff8a3d]",
    text: "text-[#ff5c8a]",
    ring: "ring-[#ff3d7f]",
    bg: "bg-[#ff3d7f]",
  },
  friends: {
    gradient: "from-[#facc15] to-[#22c55e]",
    text: "text-[#facc15]",
    ring: "ring-[#facc15]",
    bg: "bg-[#facc15]",
  },
  team: {
    gradient: "from-[#22d3ee] to-[#6366f1]",
    text: "text-[#22d3ee]",
    ring: "ring-[#22d3ee]",
    bg: "bg-[#22d3ee]",
  },
};

export const MATCH_TITLE: Record<Mode, string> = {
  date: "¡Es un match! 💘",
  friends: "¡Nuevo amigo! 🤝",
  team: "¡Equipo a la vista! 🛠️",
};

export const GENDERS: { id: Gender; label: string }[] = [
  { id: "woman", label: "Mujer" },
  { id: "man", label: "Hombre" },
  { id: "nonbinary", label: "No binario" },
  { id: "other", label: "Otro" },
];

export const INTEREST_OPTIONS: { id: string; label: string; value: Gender[] }[] = [
  { id: "women", label: "Mujeres", value: ["woman"] },
  { id: "men", label: "Hombres", value: ["man"] },
  { id: "all", label: "Todos", value: ["woman", "man", "nonbinary", "other"] },
];

export const LEVELS: { id: Level; label: string }[] = [
  { id: "junior", label: "Junior" },
  { id: "mid", label: "Mid" },
  { id: "senior", label: "Senior" },
];

export const ROLES = [
  "Frontend",
  "Backend",
  "Fullstack",
  "Mobile",
  "Diseño UX/UI",
  "Data / ML",
  "DevOps",
  "Hardware / IoT",
  "Seguridad",
  "Producto / Negocio",
  "Game dev",
];

export const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue",
  "Svelte",
  "Tailwind",
  "Node.js",
  "Python",
  "Go",
  "Rust",
  "Java",
  "Kotlin",
  "Swift",
  "Flutter",
  "SQL",
  "Postgres",
  "Supabase",
  "Firebase",
  "Docker",
  "Kubernetes",
  "AWS",
  "PyTorch",
  "LLMs",
  "Figma",
  "Arduino",
  "Unity",
  "Solidity",
  "Pitch",
  "No-code",
];

export const PROMPT_QUESTIONS = [
  "Tabs o spaces y por qué",
  "Mi peor bug fue…",
  "Te invito un café si…",
  "Mi stack para una cita perfecta",
  "Lo que más me gusta de los hackathones",
  "Un proyecto del que estoy orgulloso/a",
  "Dark mode o light mode",
  "Mi superpoder a las 3 a. m.",
  "Busco a alguien que…",
];

export const ICEBREAKERS: Record<Mode, string[]> = {
  date: [
    "¿Café en el coffee break? ☕",
    "¿Tabs o spaces? Esto lo define todo 😅",
    "¿Cuál fue tu peor bug? Yo te cuento el mío",
    "¿Vamos juntos al after del hackathon?",
  ],
  friends: [
    "¿Vas al after? 🎉",
    "¿Qué charla no te vas a perder?",
    "¿Primer hackathon o ya eres veterano/a?",
  ],
  team: [
    "¿Ya tienes equipo? 🛠️",
    "Tengo una idea, ¿te la cuento?",
    "¿Qué stack te gustaría usar?",
  ],
};

/** Respuestas simuladas de los perfiles de demo (en la versión real las escribe una persona). */
export const DEMO_REPLIES: Record<Mode, string[]> = {
  date: [
    "Jajaja me encantó tu mensaje 😄",
    "¡Sí! Me late. ¿Te veo en el coffee break del sábado?",
    "Perfecto, ahí nos vemos ☕ Seré quien tenga la laptop llena de stickers",
  ],
  friends: [
    "¡Hola! Sí, voy al after 🎉",
    "Vamos varios, ¿te unes?",
    "Genial, te aviso en el evento 🙌",
  ],
  team: [
    "¡Hola! Todavía no tengo el equipo completo 👀",
    "Cuéntame tu idea, me interesa",
    "Suena bien, ¿nos juntamos en la apertura para armar el equipo?",
  ],
};

export const REPORT_REASONS = [
  "Acoso o mensajes ofensivos",
  "Perfil falso o spam",
  "Parece menor de edad",
  "Contenido inapropiado",
  "Otro",
];

export const AVATAR_EMOJIS = ["🦊", "🐙", "🚀", "🎧", "🌵", "🍕", "🐱", "🌈", "🎮", "☕", "🛹", "🌙"];
export const AVATAR_GRADIENTS: [string, string][] = [
  ["#ff3d7f", "#ff8a3d"],
  ["#6366f1", "#22d3ee"],
  ["#22c55e", "#facc15"],
  ["#a855f7", "#ec4899"],
  ["#0ea5e9", "#10b981"],
  ["#f97316", "#ef4444"],
];

type P = { className?: string };

const base = (path: React.ReactNode, { className = "h-6 w-6" }: P, fill = false) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={fill ? "currentColor" : "none"}
    stroke={fill ? "none" : "currentColor"}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
);

export const IconHeart = (p: P) =>
  base(<path d="M12 21s-7.5-4.6-9.5-9.4C1.2 8.3 3.4 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.6 0 5.8 3.8 4.5 7.1C19.5 16.4 12 21 12 21z" />, p, true);
export const IconX = (p: P) => base(<path d="M6 6l12 12M18 6L6 18" />, p);
export const IconUndo = (p: P) => base(<><path d="M9 14L4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 010 11H11" /></>, p);
export const IconInfo = (p: P) => base(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>, p);
export const IconBack = (p: P) => base(<path d="M15 18l-6-6 6-6" />, p);
export const IconSend = (p: P) => base(<path d="M4 12l16-8-6 16-2.5-6.5L4 12z" />, p);
export const IconDots = (p: P) => base(<><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>, p, true);
export const IconCheck = (p: P) => base(<path d="M5 12.5l4.5 4.5L19 7.5" />, p);
export const IconShield = (p: P) => base(<><path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>, p);
export const IconFlame = (p: P) =>
  base(<path d="M12 2c1 3.5 5 6 5 11a5 5 0 01-10 0c0-2.2 1-3.8 2.2-5 .3 1.6 1.1 2.6 2.3 3C11 8.5 11 5 12 2z" />, p, true);
export const IconChat = (p: P) => base(<path d="M4 5h16v11H9l-5 4V5z" />, p);
export const IconUser = (p: P) => base(<><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>, p);
export const IconCamera = (p: P) => base(<><path d="M4 8h3l2-3h6l2 3h3v11H4V8z" /><circle cx="12" cy="13" r="3.5" /></>, p);
export const IconGithub = (p: P) =>
  base(
    <path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 015 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0012 2z" />,
    p,
    true,
  );

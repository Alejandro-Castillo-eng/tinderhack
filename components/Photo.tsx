import { parseGradient } from "@/lib/photo";

/** Muestra una foto subida o un avatar de gradiente con emoji. */
export function Photo({ src, alt, className = "", emojiSize = "text-[7rem]" }: { src?: string; alt: string; className?: string; emojiSize?: string }) {
  const g = src ? parseGradient(src) : null;
  if (!src || g) {
    const from = g?.from ?? "#3f3f46";
    const to = g?.to ?? "#18181b";
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
      >
        <div className="photo-grid absolute inset-0 opacity-25" />
        <span className={`relative select-none drop-shadow-lg ${emojiSize}`}>{g?.emoji ?? "🙂"}</span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} draggable={false} className={`object-cover ${className}`} />;
}

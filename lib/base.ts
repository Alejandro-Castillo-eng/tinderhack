/** Prefijo de la app cuando se publica en una subcarpeta (GitHub Pages). Vacío en local. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (path: string) => `${BASE_PATH}${path}`;

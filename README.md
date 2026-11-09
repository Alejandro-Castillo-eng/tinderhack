# tinderhack_

Web app con look & feel de app móvil para **conocer gente en hackathones**: citas 💘, amigos 🤝 y equipo 🛠️.
Desliza perfiles, haz match y rompe el hielo en el chat.

👉 **Pruébala:** https://alejandro-castillo-eng.github.io/tinderhack/ (ábrela en el celular y usa "Agregar a pantalla de inicio")

> **Estado: MVP de demo (frontend completo).** Todo funciona en el navegador. Los datos se guardan en `localStorage` de tu dispositivo, los perfiles y eventos son de ejemplo y las respuestas del chat son simuladas. El siguiente paso es conectar Supabase (ver `PLAN.md`).

## Qué incluye

- **Onboarding en 7 pasos**: nombre y edad (solo 18+), modos, género y a quién quieres ver, rol/skills/nivel/GitHub, bio y prompts, fotos (subir o avatar) y código de conducta.
- **Elegir hackathon** de una lista o con un código (`CDMX26`, `BOG26`, `LIMA26`, `MAD27`).
- **Descubrir**: tarjetas con gestos de arrastre (LIKE / NOPE), tocar los lados para cambiar de foto, botón ⓘ para ver el perfil completo, deshacer el último swipe, flechas ← → en escritorio.
- **3 modos con likes separados**. En *Date* se filtra por interés de género mutuo. En *Equipo* se priorizan roles complementarios. Se resaltan las skills en común.
- **Match** con animación y vibración (Android).
- **Matches + chat** con icebreakers, indicador de "escribiendo…" y respuestas simuladas.
- **Seguridad**: deshacer match, bloquear y reportar (con motivo) desde cualquier chat. Nadie ve tus likes hasta que hay match.
- **Perfil**: vista previa, editar, activar/desactivar modos, cambiar hackathon y borrar datos.
- **PWA**: instalable en la pantalla de inicio (manifest, íconos, service worker) y adaptada al notch y a las safe areas.

## Correr en local

Requiere Node 20 o superior.

```bash
npm install
```

```bash
npm run dev
```

Abre http://localhost:3000. En la computadora se ve como un teléfono centrado. Para la experiencia real, ábrelo desde tu celular en la misma red (`http://IP-de-tu-compu:3000`) o usa el modo dispositivo de las DevTools.


## Deploy (GitHub Pages)

La app se exporta como sitio estático (`output: "export"`) y se publica sola con GitHub Actions (`.github/workflows/deploy-pages.yml`) en cada push.

Configuración (solo una vez): en GitHub, **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Para probar el build estático en local:

```bash
NEXT_PUBLIC_BASE_PATH=/tinderhack npm run build
```

El resultado queda en `out/`. `vercel.json` desactiva los deploys automáticos de Vercel.

## Estructura

```text
app/
  welcome/ onboarding/ hackathons/     # flujo de entrada
  (app)/discover|matches|profile/       # pantallas con barra inferior
  chat/                                 # chat a pantalla completa (/chat?id=...)
components/                             # SwipeDeck, ProfileCard, MatchModal, BottomNav, ui…
lib/
  store.tsx    # estado + persistencia (API que luego se implementa con Supabase)
  deck.ts      # filtros del deck (edad, modo, género mutuo, bloqueos)
  seed.ts      # perfiles y hackathones de ejemplo
  constants.ts # modos, skills, prompts, icebreakers
public/        # manifest, íconos, sw.js
```

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion

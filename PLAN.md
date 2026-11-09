# TinderHack — Plan del proyecto

> Una web app con look & feel de app móvil para encontrar compañeros de equipo en hackathones: haces swipe sobre perfiles de hackers, y si los dos dicen "sí", hay match y pueden chatear para armar equipo.

---

## 1. Concepto

| Tinder | TinderHack |
|---|---|
| Fotos y bio | Foto, rol (frontend, backend, diseño, ML, negocio…), stack, nivel, links (GitHub, LinkedIn, portafolio) |
| Ubicación / distancia | **Hackathon** al que vas (solo ves gente del mismo evento) |
| "Busco relación" | "Busco equipo" / "Tengo equipo, busco un perfil de X" / "Tengo idea" / "Me uno a una idea" |
| Like / Nope | **Swipe derecha = "quiero hackear contigo"**, izquierda = pasar |
| Match → chat | Match → chat → **crear equipo** (opcional) |

### Usuario objetivo
Personas que van a un hackathon solas o con un equipo incompleto y quieren encontrar perfiles complementarios rápido (normalmente en las 24–48 h antes o durante el evento).

---

## 2. Funcionalidades

### MVP (lo mínimo para que funcione)
1. **Registro / login** — email mágico o Google/GitHub OAuth.
2. **Onboarding / perfil** — foto, nombre, rol principal, skills (tags), nivel (junior/mid/senior), qué busco, links, bio corta.
3. **Elegir hackathon** — lista de eventos (al inicio cargados a mano) o unirse con un código.
4. **Deck de swipe** — tarjetas apiladas con gesto de arrastre (izquierda/derecha) + botones ✕ / ♥.
5. **Match** — si ambos dieron like → pantalla "It's a match!" con animación.
6. **Lista de matches + chat** en tiempo real 1 a 1.
7. **Navegación inferior tipo app** — Descubrir · Matches · Perfil.

### V2 (después del MVP)
- Filtros: "solo muéstrame diseñadores", "solo gente con Python", etc.
- **Ordenar por compatibilidad**: priorizar perfiles cuyas skills complementan las tuyas (si eres backend, ver más frontend/diseño).
- **Equipos**: crear un equipo desde un match, invitar más miembros, el equipo aparece como tarjeta ("Equipo X busca diseñador").
- Super-like ("⚡ tengo una idea contigo").
- Notificaciones push (PWA) cuando hay match o mensaje.
- Panel para organizadores: crear hackathon, ver estadísticas.
- Reportar/bloquear usuarios.

---

## 3. Que se vea como app móvil (en web)

- **Layout centrado tipo teléfono**: en móvil ocupa toda la pantalla; en escritorio se muestra un "marco" de ~420 px de ancho centrado.
- **Viewport y safe areas**: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` y `env(safe-area-inset-*)` para el notch.
- Altura con `100dvh` (no `100vh`) para que no salte con la barra del navegador.
- **Bottom tab bar** fija, header simple, transiciones entre pantallas.
- **Gestos**: drag de tarjetas con física (Framer Motion), rotación según el arrastre, sellos "HACK" / "PASS".
- Sin scroll del body en la pantalla de swipe (`overscroll-behavior: none`, `touch-action`).
- **PWA**: `manifest.json` + service worker → "Agregar a pantalla de inicio", ícono, splash, abre a pantalla completa sin barra del navegador.
- Feedback háptico con `navigator.vibrate()` en Android al hacer match.

---

## 4. Stack recomendado

| Capa | Herramienta | Por qué |
|---|---|---|
| Frontend | **Next.js (React) + TypeScript** | Estándar, rápido de desplegar |
| Estilos | **Tailwind CSS** | Rápido para UI móvil |
| Animaciones / swipe | **Framer Motion** | Drag + spring listos para tarjetas |
| Backend / BD | **Supabase** (Postgres + Auth + Realtime + Storage) | Login, base de datos, chat en tiempo real y fotos, sin escribir servidor |
| PWA | `next-pwa` o manifest + SW manual | Instalable en el teléfono |
| Deploy | **Vercel** | Gratis, deploy automático desde GitHub |

> Alternativa sin backend para un prototipo de demo: datos falsos en JSON + `localStorage`. Sirve para presentar la idea en un día, luego se conecta Supabase.

---

## 5. Modelo de datos (Supabase / Postgres)

```text
profiles
  id (uuid, = auth.users.id)
  name, avatar_url, bio
  role            -- 'frontend' | 'backend' | 'fullstack' | 'design' | 'ml' | 'business' | ...
  skills          -- text[]  ej. {react, python, figma}
  level           -- 'junior' | 'mid' | 'senior'
  looking_for     -- 'team' | 'member' | 'idea'
  github_url, linkedin_url, portfolio_url
  created_at

hackathons
  id, name, city, starts_at, ends_at, join_code, cover_url

hackathon_participants
  hackathon_id, profile_id      -- PK compuesta

swipes
  swiper_id, swiped_id, hackathon_id
  direction       -- 'like' | 'pass'
  created_at
  UNIQUE (swiper_id, swiped_id, hackathon_id)

matches
  id, hackathon_id, user_a, user_b, created_at   -- user_a < user_b

messages
  id, match_id, sender_id, body, created_at
```

**Lógica clave**
- **Deck**: participantes del mismo hackathon, excluyendo a uno mismo y a quienes ya swipeaste.
- **Match**: un trigger en Postgres al insertar un `like` revisa si existe el `like` inverso → inserta en `matches`.
- **Seguridad (RLS)**: cada usuario solo lee sus swipes, sus matches y los mensajes de sus matches. Nadie puede ver quién le dio like antes de que haya match.
- **Chat**: suscripción Realtime a `messages` filtrado por `match_id`.

---

## 6. Pantallas

1. **Landing / Login** — logo, tagline, "Entrar con GitHub".
2. **Onboarding** (3–4 pasos) — foto → rol y skills → qué busco → links.
3. **Elegir hackathon** — tarjetas de eventos o input de código.
4. **Descubrir (swipe)** — pila de tarjetas: foto, nombre, rol, skills como chips, nivel; tocar para ver detalle.
5. **It's a match!** — modal con las dos fotos y botón "Enviar mensaje".
6. **Matches** — fila de matches nuevos + lista de conversaciones.
7. **Chat** — burbujas, input fijo abajo.
8. **Perfil** — ver/editar mi perfil, cambiar hackathon, cerrar sesión.

---

## 7. Estructura de carpetas sugerida

```text
tinderhack/
├─ app/
│  ├─ (auth)/login/page.tsx
│  ├─ onboarding/page.tsx
│  ├─ hackathons/page.tsx
│  ├─ (app)/layout.tsx          # marco móvil + bottom tab bar
│  ├─ (app)/discover/page.tsx
│  ├─ (app)/matches/page.tsx
│  ├─ (app)/matches/[id]/page.tsx   # chat
│  └─ (app)/profile/page.tsx
├─ components/
│  ├─ SwipeDeck.tsx
│  ├─ ProfileCard.tsx
│  ├─ MatchModal.tsx
│  ├─ BottomNav.tsx
│  └─ ChatBubble.tsx
├─ lib/supabase/ (client.ts, server.ts)
├─ supabase/migrations/          # tablas, trigger de match, RLS
├─ public/manifest.json, icons/
└─ PLAN.md
```

---

## 8. Roadmap por fases

| Fase | Entregable | Tiempo estimado |
|---|---|---|
| **0. Setup** | Repo Next.js + Tailwind, layout móvil, bottom nav, deploy en Vercel | ½ día |
| **1. Prototipo UI** | Deck de swipe funcionando con datos falsos, modal de match, pantallas maquetadas | 1–2 días |
| **2. Backend** | Supabase: auth, tablas, perfiles reales, onboarding, subir foto | 1–2 días |
| **3. Matching** | Guardar swipes, trigger de match, lista de matches, RLS | 1 día |
| **4. Chat** | Mensajes en tiempo real | 1 día |
| **5. PWA + pulido** | Manifest, íconos, instalable, animaciones, estados vacíos ("no hay más hackers") | 1 día |
| **6. V2** | Filtros, compatibilidad por skills, equipos, notificaciones | según tiempo |

**Total MVP: ~1 semana** para una persona (o un fin de semana de hackathon con 2–3 personas repartiendo frontend / backend / diseño).

---

## 9. Riesgos y cosas a cuidar

- **Arranque en frío**: la app no sirve si hay poca gente en el evento → aliarse con organizadores, código QR en el evento, o mostrar perfiles de seed en la demo.
- **Privacidad**: no exponer email; links solo visibles tras match (opcional).
- **Moderación**: botón de reportar/bloquear desde el MVP+1.
- **Gestos en iOS Safari**: probar en dispositivo real; evitar conflicto con el gesto de "atrás".

---

## 10. Próximo paso concreto

1. Decidir: ¿prototipo con datos falsos primero, o directo con Supabase?
2. Crear el proyecto Next.js + Tailwind + Framer Motion.
3. Construir el **layout móvil + deck de swipe** con 10 perfiles de ejemplo — es la pieza que más "vende" la idea.

# TinderHack — Plan del proyecto

> Una web app con look & feel de app móvil para **conocer gente en hackathones**: hacer swipe sobre perfiles de otros hackers para **ligar / tener citas**, **hacer amigos** o **armar equipo**. Si los dos dicen "sí", hay match y pueden chatear.

---

## 1. Concepto

La idea principal es que **chicos y chicas que van a hackathones se conozcan más**. Comparten intereses (tecnología, construir cosas, eventos) pero en un hackathon casi no hay tiempo de hablar con gente fuera de tu equipo. TinderHack rompe el hielo.

### Tres modos (como Bumble Date / BFF)
| Modo | Para qué | Quién te aparece |
|---|---|---|
| 💘 **Date** (modo principal) | Ligar, conocer a alguien, tener una cita | Según tu género y a quién te interesa ver |
| 🤝 **Amigos** | Conocer gente, hacer networking, ir juntos al after | Todos los que activaron este modo |
| 🛠️ **Equipo** | Encontrar compañeros para el hackathon | Todos, ordenados por skills complementarias |

- Cada usuario elige qué modos activa (puede tener solo *Date*, o los tres).
- **Los matches están separados por modo**: un like en *Equipo* nunca cuenta como like en *Date*. Así nadie se siente incómodo.

### Qué tiene de "hacker" vs. un Tinder normal
| Tinder | TinderHack |
|---|---|
| Fotos y bio | Fotos, bio, **rol y stack**, "mi primer lenguaje", proyecto del que estoy orgulloso, GitHub |
| Ubicación / distancia | **Hackathon** al que vas (o hackathones pasados en común) |
| Prompts tipo "Mi domingo ideal…" | Prompts nerd: "Tabs o spaces", "Mi peor bug", "Te invito un café si…", "Mi stack para una cita: …" |
| Match → chat | Match → chat → icebreakers: "¿Nos vemos en el coffee break?", "¿Vamos juntos a la charla de X?" |

### Usuario objetivo
Personas de 18 años o más que van a hackathones, quieren conocer gente del ambiente tech y no necesariamente buscan solo equipo.

---

## 2. Funcionalidades

### MVP
1. **Registro / login** con Google o GitHub y **confirmar que eres mayor de 18**.
2. **Onboarding / perfil**
   - 2–6 fotos, nombre, edad, bio
   - **Género** (hombre / mujer / no binario / otro) y **me interesa ver** (hombres / mujeres / todos). Solo se usa en el modo *Date*.
   - Modos activos: Date / Amigos / Equipo
   - Lado tech: rol, skills, nivel, GitHub (opcional)
   - 2–3 **prompts** con respuestas
3. **Elegir hackathon** (lista o código). Opción "conocer gente de cualquier hackathon de mi ciudad".
4. **Deck de swipe** con selector de modo arriba (💘 / 🤝 / 🛠️).
5. **Match** → pantalla "It's a match!" con animación.
6. **Matches + chat** en tiempo real, con icebreakers sugeridos.
7. **Seguridad básica**: bloquear, reportar y deshacer match. (Es obligatorio en una app de citas, no puede ser opcional.)
8. **Navegación inferior**: Descubrir · Matches · Perfil.

### V2
- **Modo "En el evento"**: ver quién está en el mismo hackathon *ahora mismo* y proponer verse en el coffee break, en la comida o en el after.
- Likes a una foto o a un prompt específico, con comentario (como Hinge).
- Super-like ⚡.
- Compatibilidad: intereses y stacks en común ("¡Los dos usan Rust!").
- Filtros: edad, modo, rol.
- Notificaciones push (PWA).
- Verificación de perfil con selfie.
- Crear equipo a partir de matches de *Equipo*.
- Panel para organizadores (los hackathones pueden ofrecerlo como actividad social).

---

## 3. Seguridad y privacidad (muy importante en una app de citas)

- **Solo mayores de 18**: confirmar la edad en el registro y, en V2, verificar con selfie.
- **Nadie ve quién le dio like** hasta que hay match.
- **No se muestra el email, el teléfono ni el apellido**. El GitHub y el LinkedIn son opcionales.
- **Bloquear**: la persona bloqueada desaparece de tu deck y de tus matches para siempre (y tú del suyo).
- **Reportar**: con motivos (acoso, perfil falso, menor de edad, contenido inapropiado) y una cola de moderación para los admins.
- **Cada modo respeta tus preferencias**: si solo activaste *Equipo*, nunca apareces en *Date*.
- Rate limit de likes y mensajes para evitar spam.
- Código de conducta en el onboarding (los hackathones ya suelen tener uno: enlazarlo).
- Ubicación: **nunca exacta**, solo "está en el mismo hackathon".

---

## 4. Que se vea como app móvil (en web)

- **Layout centrado tipo teléfono**: en el móvil ocupa toda la pantalla; en la computadora se muestra un "marco" de ~420 px centrado.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` + `env(safe-area-inset-*)` para el notch.
- Altura con `100dvh`.
- **Bottom tab bar** fija y transiciones entre pantallas.
- **Gestos**: drag de tarjetas con física (Framer Motion), rotación, sellos "LIKE" / "NOPE". Tocar los lados de la tarjeta cambia de foto.
- `overscroll-behavior: none` en la pantalla de swipe.
- **PWA**: manifest + service worker → instalable, pantalla completa e ícono propio.
- `navigator.vibrate()` al hacer match (en Android).

---

## 5. Stack recomendado

| Capa | Herramienta | Por qué |
|---|---|---|
| Frontend | **Next.js + TypeScript** | Estándar y fácil de desplegar |
| Estilos | **Tailwind CSS** | Rápido para hacer UI móvil |
| Animaciones / swipe | **Framer Motion** | Drag y animaciones de resorte |
| Backend / BD | **Supabase** (Postgres + Auth + Realtime + Storage) | Login, BD, chat en tiempo real y fotos sin escribir un servidor |
| PWA | manifest + SW (`next-pwa` o Serwist) | Instalable en el teléfono |
| Deploy | **Vercel** | Gratis y con deploy automático |

---

## 6. Modelo de datos (Supabase / Postgres)

```text
profiles
  id (uuid = auth.users.id)
  name, birthdate, bio
  gender            -- 'man' | 'woman' | 'nonbinary' | 'other'
  interested_in     -- text[]  ej. {woman} o {man, woman, nonbinary}
  modes             -- text[]  {date, friends, team}
  role, skills (text[]), level, github_url
  prompts           -- jsonb [{question, answer}]
  is_verified, created_at

profile_photos
  id, profile_id, url, position

hackathons
  id, name, city, starts_at, ends_at, join_code

hackathon_participants
  hackathon_id, profile_id, checked_in_at   -- PK compuesta

swipes
  swiper_id, swiped_id, mode, direction ('like'|'pass'|'superlike'), created_at
  UNIQUE (swiper_id, swiped_id, mode)

matches
  id, mode, user_a, user_b, created_at, unmatched_at   -- user_a < user_b

messages
  id, match_id, sender_id, body, created_at, read_at

blocks
  blocker_id, blocked_id, created_at

reports
  id, reporter_id, reported_id, reason, details, status, created_at
```

**Lógica clave**
- **Deck (modo Date)**: participantes del mismo hackathon (o ciudad), mayores de 18, con `date` en `modes`, **compatibilidad mutua de género** (yo estoy en su `interested_in` y él/ella en el mío), y que no estén swipeados ni bloqueados en ninguna dirección.
- **Deck (Amigos / Equipo)**: lo mismo, pero sin el filtro de género.
- **Match**: un trigger de Postgres, al recibir un `like`, busca el like inverso **en el mismo modo** y, si existe, crea el match.
- **RLS**: cada uno solo lee sus swipes, sus matches y sus mensajes. Las fotos y los perfiles solo son visibles para usuarios autenticados.
- La consulta del deck va en una **función RPC de Postgres** (`get_deck(mode, hackathon_id)`), así los filtros de seguridad no se pueden saltar desde el cliente.

---

## 7. Pantallas

1. **Landing / Login**: logo, tagline ("Hackea tu vida amorosa 💘"), "Entrar con Google/GitHub".
2. **Onboarding** (5–6 pasos): nombre y edad → fotos → género y a quién quiero ver → modos → lado tech → prompts → código de conducta.
3. **Elegir hackathon**.
4. **Descubrir**: selector de modo 💘🤝🛠️, deck de tarjetas (fotos con indicador, nombre, edad, rol, chips de stack) y, al tocar, el perfil completo con prompts.
5. **It's a match!**: las dos fotos, botón "Enviar mensaje" e icebreakers.
6. **Matches**: carrusel de nuevos matches + conversaciones, con pestañas por modo.
7. **Chat**: burbujas, icebreakers y menú ⋯ (deshacer match / bloquear / reportar).
8. **Perfil**: editar, vista previa ("así te ven otros"), ajustes de modos y preferencias, cerrar sesión.

---

## 8. Estructura de carpetas sugerida

```text
tinderhack/
├─ app/
│  ├─ (auth)/login/page.tsx
│  ├─ onboarding/page.tsx
│  ├─ hackathons/page.tsx
│  ├─ (app)/layout.tsx              # marco móvil + bottom nav
│  ├─ (app)/discover/page.tsx
│  ├─ (app)/matches/page.tsx
│  ├─ (app)/matches/[id]/page.tsx   # chat
│  └─ (app)/profile/page.tsx
├─ components/
│  ├─ SwipeDeck.tsx, ProfileCard.tsx, PhotoCarousel.tsx
│  ├─ ModeSwitcher.tsx, MatchModal.tsx
│  ├─ BottomNav.tsx, ChatBubble.tsx, ReportSheet.tsx
├─ lib/supabase/ (client.ts, server.ts)
├─ supabase/migrations/   # tablas, trigger de match, get_deck(), RLS
├─ public/manifest.json, icons/
└─ PLAN.md
```

---

## 9. Roadmap por fases

| Fase | Entregable | Tiempo |
|---|---|---|
| **0. Setup** ✅ | Next.js + Tailwind, layout móvil, bottom nav | ½ día |
| **1. Prototipo UI** ✅ | Deck con datos falsos, selector de modo, carrusel de fotos, modal de match, onboarding, chat simulado, bloquear/reportar, PWA | 1–2 días |
| **2. Backend** | Supabase: auth, onboarding completo, subir fotos | 2 días |
| **3. Matching** | `get_deck()` con filtros de género/modo, swipes, trigger de match, RLS | 1–2 días |
| **4. Chat + seguridad** | Chat en tiempo real, bloquear, reportar, deshacer match | 1–2 días |
| **5. PWA + pulido** | Instalable, animaciones, estados vacíos, icebreakers | 1 día |
| **6. V2** | Modo "En el evento", likes a prompts, verificación, notificaciones | según el tiempo |

**MVP: ~1,5–2 semanas** para una persona.

---

## 10. Riesgos

- **Pocos usuarios** (sobre todo en un modo *Date* con pocas chicas, ya que en los hackathones suele haber más hombres): ofrecer los tres modos ayuda, porque la app sigue siendo útil aunque no haya muchos matches de citas. Aliarse con organizadores y comunidades (Women in Tech, clubes de programación universitarios) y lanzar en un evento concreto.
- **Seguridad y acoso**: bloquear y reportar desde el día 1, moderación activa y política clara.
- **Imagen ante los organizadores**: presentarla como "app social del hackathon" (amigos + equipo + citas), no solo como app de ligue. Así es más fácil que la apoyen.
- **iOS Safari**: probar los gestos en un dispositivo real.

---

## 11. Próximo paso concreto

El MVP de frontend ya está hecho (ver `README.md`): todas las pantallas funcionan con datos de ejemplo guardados en el dispositivo.

1. Desplegar en Vercel y probar en teléfonos reales (sobre todo los gestos en iOS Safari).
2. **Fase 2**: crear el proyecto de Supabase (tablas, RLS, trigger de match y `get_deck()`) e implementar la misma API de `lib/store.tsx` contra Supabase: auth, fotos en Storage y chat con Realtime.

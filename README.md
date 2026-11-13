# asfp.pro — Sfera Print corporate website

Corporate website of «Сфера Принт» / Sfera Print, a full-cycle advertising
production company: outdoor, interior advertising and promotional products.

**Stack:** Next.js 16 (App Router, React Compiler, `cacheComponents`), React 19,
TypeScript, Sass (CSS Modules), Swiper, react-spring. Shipped as a standalone
Docker image.

## Requirements

- Node.js 24 (the image is built on `node:24.13.0-slim`)
- A reachable backend: pages are rendered from its content at build time and at
  request time (see [Backend API](#backend-api))

`.npmrc` pins `legacy-peer-deps`, keep it — `npm install` fails without it.

## Getting started

```bash
cp .env.example .env   # fill in API_SERVER and the counters
npm install
npm run dev            # http://localhost:3000
```

## Commands

| Command                | What it does                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `npm run dev`          | Dev server (Turbopack)                                             |
| `npm run build`        | Production build (standalone output)                               |
| `npm start`            | Serve the build on `:3000`                                         |
| `npm run lint`         | ESLint over `src`, **zero warnings** (`--max-warnings 0`)           |
| `npm run lint:fix`     | ESLint with `--fix`                                                |
| `npm run dev:ts`       | Typecheck (`tsc --noEmit`)                                         |
| `npm run prettier`     | Prettier check over `src`                                          |
| `npm run prettier:fix` | Prettier write over `src`                                          |
| `npm run clean`        | Remove `.next`                                                     |
| `make sync`            | Update local `dev` from `origin/master` (rebase) + `npm install`    |
| `make sync-force`      | Hard-reset `dev` to `origin/master` + `npm install`                |

Run `npm run lint && npm run dev:ts` after any change; `npm run build` before
handing a release over.

## Environment

| Variable                        | Scope         | Purpose                                                                    |
| ------------------------------- | ------------- | -------------------------------------------------------------------------- |
| `API_SERVER`                    | server        | Backend origin. Proxy, server fetchers, `video-proxy`                       |
| `NEXT_PUBLIC_API_SERVER`        | build + client | Same origin, fallback when `API_SERVER` is not set                          |
| `SECRET_TOKEN`                  | server        | `?secret=` for `/api/revalidate`                                            |
| `BITRIX24_REST_ENDPOINT`         | server        | Bitrix24 REST base for lead creation                                         |
| `BITRIX24_TOKEN`                 | server        | Bitrix24 webhook token (lead creation)                                      |
| `NEXT_PUBLIC_BITRIX_FORM_SRC`   | build         | Bitrix24 CRM form loader script                                             |
| `NEXT_PUBLIC_BITRIX_FORM_DATA`  | build         | Bitrix24 CRM form id (`inline/<id>/<hash>`)                                 |
| `NEXT_PUBLIC_YANDEX_ID`          | build         | Yandex Metrica counter                                                      |
| `NEXT_PUBLIC_MAILRU_ID`          | build         | Mail.ru (Top.Mail.Ru) counter                                               |
| `CIRCLE_CAROUSEL_SLIDE_DURATION`| build         | Home carousel autoplay delay, ms (default `3000`)                           |
| `URL`                           | server/build  | Canonical site origin for metadata, sitemap and robots (default `https://asfp.pro`) |
| `ANALYZE`                       | build         | `true` — build with the bundle analyzer                                     |

Backend address fallback order is the same everywhere:
`API_SERVER` → `NEXT_PUBLIC_API_SERVER` → `https://sferaprint.istarck.ru`.

`NEXT_PUBLIC_*` values are inlined into the client bundle **at build time** — set
them while building the image, not only at runtime. Server-only variables
(`API_SERVER`, `SECRET_TOKEN`, `BITRIX24_*`) are read at runtime and can be passed
to the container.

## Backend API

The site never talks to the backend API directly from the browser. Every request
goes to the same origin and is proxied on the server, so the backend address stays
a server-only secret (`API_SERVER`) and requests do not depend on CORS.

- `src/proxy.ts` (Next.js proxy/middleware) rewrites `/api/*`, `/media/*` and
  `/policies/*` to `${API_SERVER}` (`/policies/*` → the backend's `/media/policies/*`).
- Route handlers owned by the app are excluded from the rewrite and keep being
  served by `src/app/api/`:

| Route                | Method | Purpose                                                                 |
| -------------------- | ------ | ----------------------------------------------------------------------- |
| `/api/create-lead`   | POST   | Creates a lead in Bitrix24 (`BITRIX24_*` stay on the server)              |
| `/api/health`        | GET    | Liveness probe: `{ status, timestamp, uptime }`                          |
| `/api/revalidate`    | GET    | `?secret=&path=/blog/&type=page\|layout` or `?tag=blog`; `path=/` refreshes everything |
| `/api/video-proxy`   | GET    | `?url=` returns the video with its content type — for players that need a CORS-free origin |

- `src/shared/lib/hooks/useFetch.ts` builds same-origin paths (`/api/<endpoint>/`)
  for all client-side requests.
- Server-side helpers (`src/shared/lib/api/getPage.ts`, `getPosts.ts`) fetch the
  backend directly, are marked `server-only` and cache with tags equal to the
  page slug / list name, which `/api/revalidate` invalidates.
- `src/proxy.ts` also captures UTM parameters and stores them in cookies.

`public/media/` holds local fallback files (placeholder covers and a sample
policy PDF). They let the Image Optimizer serve images without an external host
and keep the site renderable while the backend media is unreachable.

## How the site is put together

```
src/app/                 App Router
  (main)/                public pages: /, /blog, /cases, /contacts, /documents,
                         /features, /philosophy, /technologies and their detail pages
  api/                   route handlers owned by the app
  layout.tsx template.tsx  root layout and the page shell (<header id="header">, <main id="main">)
  globals.scss styles/   design tokens (CSS custom properties), Sass mixins
src/components/          page-level and feature components (navbar, map, portfolio, post, …)
src/shared/
  const/                 shared constants (ROOT_ID, OVERLAY_Z_INDEX, SITE_*)
  lib/                   api fetchers, helpers, hooks, providers, metrika, utm
  types/                 shared types
  ui/                    design system primitives (button, header, sliders, modals, …)
public/                  images, svg, videos, models (GLB)
```

Everything lives in one route group `(main)` and is rendered as panels over the
main screen:

- `src/components/layout/page-layout.tsx` — the page panel: title, back arrow,
  slide-in/slide-out animation.
- `sectionMode` pages (`/cases`, `/blog`, `/contacts`, `/documents`,
  `/features`, `/philosophy`, `/technologies`) keep a strip of the main screen
  visible on ≥ `lg` (70% width, aligned right) and render a transparent
  `.backdrop` under the panel, so a click next to the page closes it.
  Full-width detail pages (`sectionMode={false}`) are closed by the arrow or
  `Escape` — there is nothing visible to click beside them.
- The menu (`Drawer` inside `src/shared/ui/modals/drawer`) stays mounted
  **underneath** the page: closing a page returns to the menu that opened it. It
  is not closed on navigation by design (`closeOnOverlayClick` is passed from
  `NavMenu`).
- `src/shared/lib/helpers/escape.ts` — a single `Escape` registry: the key goes
  to the topmost layer by `z-index` (ties → the layer opened later), and layers
  can declare themselves inactive. A page above the menu therefore closes
  first; a page that Next.js keeps in the DOM but has hidden is skipped.
  Positions: menu `--overlay-z-index` (100, `src/app/globals.scss`), page
  backdrop `+1`, page panel `+2` (`OVERLAY_Z_INDEX` in `src/shared/const/page.ts`).
- `src/shared/lib/hooks/usePageAnimation.ts` — the panel open/close animation
  (`600ms`, translateY). The element is looked up lazily: panels rendered through
  the nested portal appear a tick after mount.

## Styling conventions

- Prettier: 4 spaces, no semicolons, single quotes, no trailing commas,
  `printWidth: 100` (`.prettierrc.json`), enforced through `eslint-plugin-prettier`.
- Sass modules per component (`Component.module.sass`), class names concatenated
  through `classnames(cls, [...])`; global tokens live in `src/app/globals.scss`
  and `src/app/styles/`.
- SVGs are imported as React components (`svgr`, wired in `next.config.mjs` via
  `turbopack.rules`).
- React Compiler is enabled: no mutation of props/state, no reading or writing refs
  during render.

## Build & deploy

`Dockerfile` is a three-stage build: dependencies (`npm ci`) → builder
(`npm run build`) → runner (`node server.js` on the standalone output, port `3000`,
non-root user `node`).

```bash
docker build \
  --build-arg NEXT_PUBLIC_YANDEX_ID=... \
  --build-arg NEXT_PUBLIC_MAILRU_ID=... \
  --build-arg NEXT_PUBLIC_BITRIX_FORM_SRC=... \
  --build-arg NEXT_PUBLIC_BITRIX_FORM_DATA=... \
  -t asfp.pro .

docker run -d --name asfp-pro -p 3000:3000 --env-file .env asfp.pro
```

- The build reads content from the backend, so the backend must be reachable while
  `npm run build` runs.
- `NEXT_PUBLIC_*` variables are baked into the bundle: after changing them the
  image has to be rebuilt, not just restarted.
- Behind a reverse proxy keep the `/api`, `/media` and `/policies` paths on the
  same origin — that is what the in-app proxy relies on.

## Branches

- `dev` — development; every change goes here and is verified on a production
  build.
- `master` — what is deployed. Merged from `dev` by PR; `make sync` keeps a local
  `dev` up to date.

Never commit `.env*` files or `external_nginx.conf`.

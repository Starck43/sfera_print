# sfera-print.ru

This is a [Next.js](https://nextjs.org/) project.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend API

The site never talks to the backend API directly from the browser. Every request
goes to the same origin and is proxied on the server, so the backend address stays
a server-only secret (`API_SERVER`) and requests do not depend on CORS.

- `src/proxy.ts` (Next.js proxy/middleware) rewrites `/api/*`, `/media/*` and
  `/policies/*` to `${API_SERVER}`.
- Route handlers owned by the app (`/api/create-lead`, `/api/health`,
  `/api/revalidate`, `/api/video-proxy`) are excluded from the rewrite and keep
  being served by `src/app/api/`.
- `src/shared/lib/hooks/useFetch.ts` builds same-origin paths (`/api/<endpoint>/`)
  for all client-side requests.
- Server-side helpers (`src/shared/lib/api/getPage.ts`, `getPosts.ts`) fetch the
  backend directly and are marked `server-only`.

`public/media/` holds local fallback files (placeholder covers and a sample
policy PDF). They let the Image Optimizer serve images without an external host
and keep the site renderable while the backend media is unreachable.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) – learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) – an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) – your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

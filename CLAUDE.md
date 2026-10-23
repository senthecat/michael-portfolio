# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — type-check (`tsc`) then `vite build`; output goes to `dist/`
- `npm run preview` — serve the built `dist/` locally

There is no test runner and no separate lint step; type errors from `tsc` (run as part of `build`) are the only static check. `tsconfig.json` has `strict`, `noUnusedLocals`, and `noUnusedParameters` enabled, so unused imports/vars will fail the build.

## Architecture

Single-page React 18 app built with Vite, TypeScript, and Tailwind. Deployed as static content to GitHub Pages.

### Routing and the GH Pages base path

`vite.config.ts` sets `base: '/michael-portfolio/'` because the site is served from `https://<user>.github.io/michael-portfolio/`. This has a few consequences worth knowing before changing routes:

1. `src/main.tsx` passes `basename={import.meta.env.BASE_URL}` to `BrowserRouter`, so routes are written without the prefix (`/about`, not `/michael-portfolio/about`).
2. `npm run build` copies `dist/index.html` to `dist/404.html`. GitHub Pages serves that for unknown paths, which lets deep links and refreshes (e.g. `/michael-portfolio/projects/me/...`) boot the SPA.
3. Internal navigation uses `react-router-dom`'s `<Link>`/`<NavLink>` (not `<a href>`) so links get the base path and the SPA router handles transitions without a full reload.

`App.tsx` includes a `<ScrollToTop />` effect that resets scroll on every `pathname` change, or scrolls to the home page's project grid when the URL has `?category=`.

### Project data is the single source of truth

`src/data/projects.ts` exports the full `Project[]` list plus helpers:

- `getProjectsByCategory(cat)` — filter by `'cs' | 'me'`
- `getProjectBySlug(cat, slug)` — lookup for the detail page
- `getRecentUpdates(n)` / `formatUpdateDate(date)` — cross-project updates feed on the home page
- `heroTiles` — the photos in the home page mosaic

The home page grid (with category filters), the navbar dropdowns (`src/components/Navbar.tsx`), and the `/projects/:category/:slug` detail pages all read from this same data. `/projects/:category` redirects to `/?category=…` (the filtered home grid). **Adding a new project = adding an entry to `projects.ts`.** Array order is display order: projects with real photos go first.

Each project can have:

- `media` — photos, `.mp4` videos, or YouTube URLs, optionally with a caption (`photo()` / `vid()` helpers). The first item is the card thumbnail.
- `models` — `.glb`/`.gltf`/`.stl` files shown in the lazy-loaded three.js viewer (`src/components/ModelViewer.tsx`). GLBs converted from STEP are meshopt-compressed.
- `updates` — dated timeline entries, newest first, with `date` as `'YYYY-MM-DD'` or `'YYYY-MM'`.
- `status` — `'in-progress'` shows a badge.

### Media files

Everything under `public/` is published. Full-size originals (iPhone HEIC/MOV, STEP files) live in `media-originals/`, which is git-ignored; only web-ready versions go in `public/assets/` (photos ≤1600px JPEG, videos 720p H.264 MP4 with a `<name>_poster.jpg`, models as compressed GLB). Hero mosaic tiles are 480×360 crops in `public/assets/hero/`.

The `Category` union (`'cs' | 'me'`) is used in route params, navbar config, and the data filter — keep them in sync if you add a new category.

### Styling

Tailwind with a small custom theme in `tailwind.config.js`:
- `navy.{700,800,900}` — page/nav background palette
- `accent.{DEFAULT,dark,light}` — blue link/CTA palette
- `font-sans` is Inter (loaded from Google Fonts in `index.html`)

### Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and publishes `dist/` to GitHub Pages. There is no separate staging environment — `main` is production. The `base` in `vite.config.ts` must match the repo name for asset URLs to resolve correctly.

# Agent Guidelines for VaultIt Frontend

## Project Overview
React + TypeScript + Vite + Tailwind v4 + shadcn/ui application. Routes: `/` (component showcase), `/demo` (auth demo), `/zen-notes`, `/card-deck`, `/timeline`. Backend API expected at `http://localhost:3000` (better-auth).

## Core Commands
- `npm run dev` — Start Vite dev server
- `npm run build` — TypeScript project references build (`tsc -b`) then `vite build`
- `npm run lint` — ESLint check (strict config, no unused vars/params)
- `npm run preview` — Preview production build locally

**Important:** Build/lint only when explicitly requested. Do not add tests — no test framework configured.

## TypeScript & Config
- Dual tsconfig: `tsconfig.app.json` (app code, ES2022) + `tsconfig.node.json` (vite config, ES2023)
- Path alias `@/` → `src/` (defined in both tsconfig and `vite.config.ts:10-12`)
- Strict mode with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`
- Module resolution: `bundler` mode, `verbatimModuleSyntax` enabled

## Styling & Theming
- Tailwind v4 via `@tailwindcss/vite` plugin — imports in `src/index.css:1-4`
- Theme uses OKLCH color space with CSS custom properties; light/dark variants (`.dark` class)
- Primary font: Raleway (variable) loaded via `@fontsource-variable/raleway`
- Always use `cn()` utility from `src/lib/utils.ts:4-5` for className merging (combines `clsx` + `tailwind-merge`)
- shadcn components use `data-slot` and `data-variant`/`data-size` attributes for styling variants

## Component Development
- **Only use shadcn/ui components.** Check `src/components/ui/` first; installed via `shadcn` CLI (manifest dependency present)
- Custom compound components live in `src/components/` (e.g., `component-example.tsx`, `example.tsx`)
- Export pattern: default export for component + named exports (e.g., `Card`, `CardHeader`, etc.)
- Components use Radix UI primitives (via `radix-ui` package) and `class-variance-authority` (cva)

## Authentication
- Auth client in `src/lib/auth-client.ts:3-8` — `better-auth/react` with `baseURL: http://localhost:3000`, `credentials: "include"`
- Exports: `useSession()`, `getSession()`, `signUp()`, `signIn()`, `signOut()`
- Session type available as `Session` (inferred from `authClient.$Infer.Session`)
- Backend must be running on port 3000 for auth operations to work

## Routing
- React Router DOM v7 — routes defined in `src/App.tsx:11-16`
- Add new routes inside existing `<Routes>`; do not modify routing structure outside Routes component

## Important Constraints
- Do not create components from scratch — always use shadcn/ui primitives
- No test files or config present; do not introduce testing unless requested
- Some pages (ZenNotes, CardDeck, TimelineNotes) use `localStorage` directly for state persistence — no backend
- All pages are client-side rendered; no SSR or data fetching patterns present

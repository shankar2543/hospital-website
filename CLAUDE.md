# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Architecture

**Hospital management frontend** built with Next.js (Pages Router), React 19, and Tailwind CSS 4. Backend is Parse/Back4App (BaaS).

### Authentication & Roles
- Login at `pages/index.js` authenticates via `Parse.User.logIn()` against Back4App
- Three roles: `admin`, `doctor`, `patient` — stored on the Parse User object
- After login, user data is persisted to `localStorage` and the user is routed to their role-specific dashboard (`/admin/dashboard`, `/doctor/dashboard`, `/patient/dashboard`)

### Key Directories
- `pages/` — Next.js Pages Router routes; subdirectories `admin/`, `doctor/`, `patient/` contain role-specific pages
- `pages/api/` — Next.js API routes
- `components/` — Shared UI: `Layout.js` wraps pages with `Navbar.js` and `Sidebar.js`
- `lib/` — Utilities: `parseConfig.js` initializes the Parse SDK (import this before any Parse calls); `api.js` provides Axios-based HTTP helpers
- `styles/` — `globals.css` for global styles; `.module.css` files for page-scoped styles

### Parse SDK Usage
Import `@/lib/parseConfig` at the top of any file that uses Parse to ensure the SDK is initialized before use. Environment variables (`NEXT_PUBLIC_BACK4APP_APP_ID`, `NEXT_PUBLIC_BACK4APP_JS_KEY`, `NEXT_PUBLIC_BACK4APP_SERVER_URL`) must be set in `.env.local`.

### Path Aliases
`@/` resolves to the project root (configured in `jsconfig.json`), e.g. `import { something } from '@/lib/parseConfig'`.

### Environment Variables
Required in `.env.local`:
- `NEXT_PUBLIC_BACK4APP_APP_ID` / `NEXT_PUBLIC_BACK4APP_JS_KEY` / `NEXT_PUBLIC_BACK4APP_SERVER_URL` — Parse/Back4App credentials
- `NEXT_PUBLIC_API_URL` — Backend REST API base URL
- `BACK4APP_MASTER_KEY` — Server-side only master key
- `ANTHROPIC_API_KEY` — Claude API key (for AI features)

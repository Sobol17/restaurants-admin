# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Lint and auto-fix (ESLint + Prettier)
npm run deploy     # Deploy to GitHub Pages (gh-pages -d dist)
```

No test runner is configured in this project.

## Architecture

Vue 3 SPA admin dashboard for a restaurant management platform. Two distinct user interfaces share the same codebase:

- **Admin interface**: Manages restaurants, users, couriers, orders, and ads
- **Client/Restaurant owner interface**: Manages menu, orders, profile, and analytics

### Data Flow

```
src/api/          → Raw axios calls to backend
src/services/     → TanStack Query wrappers (caching, mutations, query keys)
src/stores/       → Pinia stores (auth state, filters, UI state)
src/views/        → Page components (route targets)
src/components/   → Reusable components
```

The layers are intentionally separated: `api/` handles HTTP, `services/` handles caching/reactivity via TanStack Query, and `stores/` handles app-wide state that doesn't belong to a single query.

### Routing

Two route groups defined in `src/router/index.js`:
- `/admin/*` — admin views
- `/client/*` — restaurant owner views

Authentication is enforced via navigation guards. The auth store (`src/stores/auth.js`) reads `access_token`, `auth_metadata`, and `restaurant_id` from `localStorage`. A `?token=...` URL param is also supported for token injection (e.g., from external redirect).

### Key Patterns

- **Service hooks** in `src/services/use*.js` use TanStack Query (`useQuery`, `useMutation`) and reference query keys from `src/services/queryKeys.js`
- **Pinia stores** in `src/stores/` (and `src/stores/client/`) hold form state, selected items, and filter state that spans multiple components
- **Component auto-import** is configured via `unplugin-vue-components` — PrimeVue components and local components under `src/components/` do not need explicit imports
- **Path alias**: `@/` resolves to `src/`

### Backend

Backend API at `http://87.242.102.227:5000/`. Configured in `src/api/axios.instance.js`, which also attaches the Bearer token to every request and redirects to login on 401.

### UI Stack

- **PrimeVue 4** — primary component library (DataTable, Dialog, Button, etc.)
- **Tailwind CSS** — utility classes, integrated with PrimeUI via `tailwindcss-primeui`
- **PrimeIcons** — icon set
- **Russian locale** configured for PrimeVue date/time components

### Build & Deployment

- Base path is `/front/` (for GitHub Pages subdirectory hosting)
- `npm run deploy` builds and pushes `dist/` to the `gh-pages` branch

# Project Structure

This document describes the top-level layout and key directories of the project.

## Root

- `index.html` - Vite HTML entry.
- `package.json` - scripts and dependencies.
- `package-lock.json` - lockfile for npm.
- `vite.config.mjs` - Vite configuration.
- `tailwind.config.js` - Tailwind CSS configuration.
- `postcss.config.js` - PostCSS configuration.
- `eslint.config.mjs` - ESLint configuration.
- `jsconfig.json` - JS tooling config (aliases, paths).
- `public/` - static assets served as-is.
- `src/` - application source code.
- `node_modules/` - installed dependencies (generated).

## public/

- `public/favicon.ico` - app favicon.
- `public/demo/` - demo assets and fixtures.
  - `public/demo/data/` - JSON datasets used by demo views.
  - `public/demo/images/` - static images/icons used by demo views.

## src/

- `src/main.js` - app bootstrap, plugin setup, and mount.
- `src/App.vue` - root Vue component.
- `src/router/` - Vue Router setup.
  - `src/router/index.js` - route definitions.
- `src/api/` - low-level API wrappers (Axios).
  - `src/api/axios.instance.js` - Axios instance config.
  - `src/api/*.js` - resource-specific API calls.
- `src/services/` - query/mutation hooks and query keys.
  - `src/services/queryKeys.js` - TanStack Query key factory.
  - `src/services/use*.js` - feature-specific data access hooks.
- `src/stores/` - Pinia stores.
  - `src/stores/*.js` - feature stores (auth, restaurants).
- `src/components/` - reusable components.
  - `src/components/ui/` - shared UI primitives.
  - `src/components/layout/` - layout shells for admin and client.
  - `src/components/icons/` - icon components (currently empty).
- `src/views/` - route-level pages.
  - `src/views/admin/` - admin pages and auth screens.
  - `src/views/client/` - client pages (home, orders, menu, profile).
- `src/assets/` - styles and static assets bundled by Vite.
  - `src/assets/styles.scss` - global styles entry.
  - `src/assets/tailwind.css` - Tailwind base entry.
  - `src/assets/layout/` - layout SCSS partials and variables.
  - `src/assets/demo/` - demo styles and assets.
- `src/utils/` - shared utilities (formatters, debounce, photo helpers).

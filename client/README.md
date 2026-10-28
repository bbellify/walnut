# Walnut UI

Vue 3 + TypeScript frontend for Walnut, built with Vite. It loads every dashboard section over REST on startup, then keeps them current through a self-healing SSE connection to the API.

See the [root README](../README.md) for full setup.

## Setup

For development, point the client at the API in `client/.env`:

```bash
VITE_API_URL=http://localhost:3000
```

Leave it unset for production builds, since the API serves the client from the same origin.

## Scripts

```bash
npm run dev         # Vite dev server on :5000
npm run host        # same, exposed on the local network
npm run build       # type-check and build to dist/
npm run preview     # preview the production build
npm run test:unit   # Vitest
npm run lint
npm run format
```

## Layout

- `src/api/`: Axios REST client and SSE service (heartbeat watchdog, backoff, reconnect on tab focus or network change)
- `src/model/state.ts`: reactive dashboard state
- `src/views/`: Dashboard (live), Explorer, Wallet, and Settings (in progress)
- `src/components/`: dashboard sections, nav, and shared tables
- `src/directives/highlightChange.ts`: briefly highlights values when they update

# Walnut API

Express + TypeScript server that reads from a local Bitcoin Core node, computes the dashboard metrics, and pushes live updates to the client over Server-Sent Events. In production it also serves the built client from `../client/dist`.

See the [root README](../README.md) for node setup and the full list of environment variables.

## Scripts

```bash
npm run dev     # run with hot reload (tsx watch)
npm run build   # compile to dist/
npm run start   # run the compiled server
npm run lint
```

## Endpoints

| Route | Description |
| --- | --- |
| `GET /health` | Health check |
| `GET /dashboard/stream` | SSE stream of live dashboard updates |
| `GET /dashboard/{summary,price,status,fees,mining,mempool,difficulty,nextblock,latestblocks}` | Current data for a single dashboard section |

## Layout

- `src/server.ts`: app setup, CORS, static client hosting
- `src/routes/dashboard/`: REST routes (`index.ts`) and metric computation (`data.ts`)
- `src/services/rpc/`: typed JSON-RPC client using cookie auth
- `src/services/zeromq/`: new-block subscriber that triggers SSE broadcasts
- `src/services/sse/`: connected-client manager with heartbeat

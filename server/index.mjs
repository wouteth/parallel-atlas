import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createStore } from "./store.mjs";
import { createApp } from "./app.mjs";
import { events } from "../src/data/events.ts";

const path = resolve(process.env.DATABASE_PATH || "./data/atlas.sqlite");
mkdirSync(dirname(path), { recursive: true });
const store = createStore(path);
const port = Number(process.env.PORT || 4318);
const origin = process.env.APP_ORIGIN || "http://127.0.0.1:4317";
const server = createServer(
  createApp({
    store,
    origin,
    issuer: process.env.OIDC_ISSUER,
    clientId: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    allowedEventIds: new Set(events.map((event) => event.id)),
  }),
);
server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.listen(port, "127.0.0.1", () =>
  console.log(
    `Parallel Atlas server: http://127.0.0.1:${port}\nPublic origin: ${origin}`,
  ),
);
function shutdown() {
  server.close(() => {
    store.close();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

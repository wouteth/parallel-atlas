import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createStore } from "./store.mjs";
import { createApp } from "./app.mjs";

test("API requires authentication, validates writes, enforces origin and persists isolated saved items", async () => {
  const store = createStore();
  const origin = "http://127.0.0.1:4317";
  const server = createServer(
    createApp({ store, origin, allowedEventIds: new Set(["gobekli-tepe"]) }),
  );
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const me = await fetch(`${base}/api/me`).then((response) =>
      response.json(),
    );
    assert.equal(me.account, null);
    assert.equal(me.authAvailable, false);
    assert.equal((await fetch(`${base}/api/library`)).status, 401);
    assert.equal((await fetch(`${base}/api/auth/login`)).status, 503);
    const account = store.upsertAccount("https://idp.test", "abc", "Explorer");
    const token = store.createSession(account.id);
    const headers = {
      cookie: `atlas_session=${token}`,
      origin,
      "content-type": "application/json",
    };
    const items = [{ eventId: "gobekli-tepe", kind: "bookmark" }];
    assert.equal(
      (
        await fetch(`${base}/api/library`, {
          method: "PUT",
          headers: { ...headers, origin: "https://attacker.test" },
          body: JSON.stringify(items),
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await fetch(`${base}/api/library`, {
          method: "PUT",
          headers,
          body: '[{"eventId":"unknown","kind":"bookmark"}]',
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await fetch(`${base}/api/library`, {
          method: "PUT",
          headers,
          body: JSON.stringify(items),
        })
      ).status,
      200,
    );
    assert.deepEqual(
      await fetch(`${base}/api/library`, { headers }).then((response) =>
        response.json(),
      ),
      items,
    );
    assert.equal(
      (await fetch(`${base}/api/auth/logout`, { method: "POST", headers }))
        .status,
      200,
    );
    assert.equal((await fetch(`${base}/api/library`, { headers })).status, 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    store.close();
  }
});

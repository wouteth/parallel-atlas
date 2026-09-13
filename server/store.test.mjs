import { test } from "node:test";
import assert from "node:assert/strict";
import { createStore } from "./store.mjs";

test("account libraries are isolated by issuer and subject; logout revokes the session", () => {
  const store = createStore();
  try {
    const a = store.upsertAccount("https://issuer-a.test", "user-1", "A");
    const b = store.upsertAccount("https://issuer-b.test", "user-1", "B");
    assert.notEqual(a.id, b.id);
    store.putLibrary(a.id, [{ eventId: "atlantis", kind: "bookmark" }]);
    assert.equal(store.getLibrary(a.id).length, 1);
    assert.equal(store.getLibrary(b.id).length, 0);
    const token = store.createSession(a.id);
    assert.equal(store.accountForSession(token).id, a.id);
    assert.equal(store.accountForSession("invalid"), null);
    store.deleteSession(token);
    assert.equal(store.accountForSession(token), null);
  } finally {
    store.close();
  }
});
test("OIDC flows can only be consumed once", () => {
  const store = createStore();
  try {
    const token = store.createFlow("state", "verifier", "nonce");
    assert.equal(store.consumeFlow(token).state, "state");
    assert.equal(store.consumeFlow(token), null);
  } finally {
    store.close();
  }
});

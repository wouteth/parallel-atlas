import { DatabaseSync } from "node:sqlite";
import { createHash, randomBytes } from "node:crypto";

const hash = (value) => createHash("sha256").update(value).digest("hex");
export function createStore(path = ":memory:") {
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS accounts (id TEXT PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (digest TEXT PRIMARY KEY, account_id TEXT NOT NULL REFERENCES accounts(id), expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS library (account_id TEXT NOT NULL REFERENCES accounts(id), event_id TEXT NOT NULL, kind TEXT NOT NULL CHECK(kind IN ('bookmark','favorite')), PRIMARY KEY(account_id,event_id,kind));
    CREATE TABLE IF NOT EXISTS login_flows (digest TEXT PRIMARY KEY, state TEXT NOT NULL, verifier TEXT NOT NULL, nonce TEXT NOT NULL, expires INTEGER NOT NULL);
  `);
  return {
    close: () => db.close(),
    upsertAccount(issuer, subject, name) {
      const id = hash(JSON.stringify([issuer, subject]));
      db.prepare(
        "INSERT INTO accounts VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name",
      ).run(id, name);
      return { id, name };
    },
    createSession(accountId) {
      const token = randomBytes(32).toString("base64url");
      db.prepare("DELETE FROM sessions WHERE expires <= ?").run(Date.now());
      db.prepare("INSERT INTO sessions VALUES (?, ?, ?)").run(
        hash(token),
        accountId,
        Date.now() + 7 * 24 * 3600 * 1000,
      );
      return token;
    },
    accountForSession(token) {
      if (!token) return null;
      return (
        db
          .prepare(
            "SELECT accounts.id, accounts.name FROM sessions JOIN accounts ON accounts.id = sessions.account_id WHERE digest = ? AND expires > ?",
          )
          .get(hash(token), Date.now()) ?? null
      );
    },
    deleteSession(token) {
      if (token)
        db.prepare("DELETE FROM sessions WHERE digest = ?").run(hash(token));
    },
    getLibrary(accountId) {
      return db
        .prepare(
          "SELECT event_id AS eventId, kind FROM library WHERE account_id = ? ORDER BY event_id, kind",
        )
        .all(accountId);
    },
    putLibrary(accountId, items) {
      db.exec("BEGIN");
      try {
        db.prepare("DELETE FROM library WHERE account_id = ?").run(accountId);
        const insert = db.prepare(
          "INSERT OR IGNORE INTO library VALUES (?, ?, ?)",
        );
        for (const item of items)
          insert.run(accountId, item.eventId, item.kind);
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
    },
    createFlow(state, verifier, nonce) {
      db.prepare("DELETE FROM login_flows WHERE expires <= ?").run(Date.now());
      const token = randomBytes(32).toString("base64url");
      db.prepare("INSERT INTO login_flows VALUES (?, ?, ?, ?, ?)").run(
        hash(token),
        state,
        verifier,
        nonce,
        Date.now() + 10 * 60 * 1000,
      );
      return token;
    },
    consumeFlow(token) {
      if (!token) return null;
      // DELETE RETURNING atomically consumes the flow, including on an unsuccessful callback.
      return (
        db
          .prepare("DELETE FROM login_flows WHERE digest = ? RETURNING *")
          .get(hash(token)) ?? null
      );
    },
  };
}

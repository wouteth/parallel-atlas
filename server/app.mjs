import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import * as oidc from "openid-client";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
export function createApp({
  store,
  origin,
  issuer,
  clientId,
  clientSecret,
  dist = resolve("dist"),
  allowedEventIds,
}) {
  const publicOrigin = new URL(origin);
  if (publicOrigin.origin !== origin)
    throw new Error(
      "APP_ORIGIN must be an origin without a path or trailing slash.",
    );
  if (
    publicOrigin.protocol !== "https:" &&
    !["127.0.0.1", "localhost", "[::1]"].includes(publicOrigin.hostname)
  )
    throw new Error("Public deployments require an HTTPS APP_ORIGIN.");
  const secure = publicOrigin.protocol === "https:";
  const configured = Boolean(issuer && clientId && clientSecret);
  const sessionCookie = secure ? "__Host-atlas_session" : "atlas_session";
  const flowCookie = secure ? "__Host-atlas_flow" : "atlas_flow";
  let discovery;
  const configuration = () =>
    (discovery ??= oidc
      .discovery(new URL(issuer), clientId, clientSecret)
      .catch((error) => {
        discovery = undefined;
        throw error;
      }));
  const cookie = (name, token, age) =>
    `${name}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${age}${secure ? "; Secure" : ""}`;
  const cookies = (req) =>
    Object.fromEntries(
      (req.headers.cookie ?? "").split(";").map((part) => {
        const at = part.indexOf("=");
        return at < 0
          ? [part.trim(), ""]
          : [part.slice(0, at).trim(), part.slice(at + 1)];
      }),
    );
  function json(res, code, data) {
    res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(data));
  }
  function redirect(res, target) {
    res.writeHead(302, { Location: target });
    res.end();
  }
  async function readJson(req) {
    if (!(req.headers["content-type"] ?? "").startsWith("application/json"))
      throw Object.assign(new Error("JSON required"), { status: 415 });
    const chunks = [];
    let bytes = 0;
    for await (const chunk of req) {
      bytes += chunk.length;
      if (bytes > 64 * 1024)
        throw Object.assign(new Error("Request too large"), { status: 413 });
      chunks.push(chunk);
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      throw Object.assign(new Error("Invalid JSON"), { status: 400 });
    }
  }
  return async function app(req, res) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "DENY");
    if (secure) res.setHeader("Strict-Transport-Security", "max-age=31536000");
    const url = new URL(req.url, origin);
    const path = url.pathname;
    if (path.startsWith("/api/")) res.setHeader("Cache-Control", "no-store");
    try {
      if (!["GET", "HEAD", "POST", "PUT"].includes(req.method))
        return json(res, 405, { error: "Method not allowed" });
      if (["POST", "PUT"].includes(req.method) && req.headers.origin !== origin)
        return json(res, 403, { error: "Origin not allowed" });
      const jar = cookies(req);
      const account = store.accountForSession(jar[sessionCookie]);
      if (path === "/api/me" && req.method === "GET")
        return json(res, 200, { account, authAvailable: configured });
      if (path === "/api/auth/login" && req.method === "GET") {
        if (!configured)
          return json(res, 503, {
            error: "Account sign-in has not been configured.",
          });
        const config = await configuration();
        const verifier = oidc.randomPKCECodeVerifier();
        const state = oidc.randomState();
        const nonce = oidc.randomNonce();
        const token = store.createFlow(state, verifier, nonce);
        res.setHeader("Set-Cookie", cookie(flowCookie, token, 600));
        const authorization = oidc.buildAuthorizationUrl(config, {
          redirect_uri: `${origin}/api/auth/callback`,
          scope: "openid profile",
          code_challenge: await oidc.calculatePKCECodeChallenge(verifier),
          code_challenge_method: "S256",
          state,
          nonce,
        });
        return redirect(res, authorization.href);
      }
      if (path === "/api/auth/callback" && req.method === "GET") {
        res.setHeader("Set-Cookie", cookie(flowCookie, "", 0));
        try {
          const flow = store.consumeFlow(jar[flowCookie]);
          if (!configured || !flow || flow.expires <= Date.now())
            throw new Error("Invalid login flow");
          const config = await configuration();
          const tokens = await oidc.authorizationCodeGrant(config, url, {
            pkceCodeVerifier: flow.verifier,
            expectedState: flow.state,
            expectedNonce: flow.nonce,
            idTokenExpected: true,
          });
          const claims = tokens.claims();
          if (!claims?.sub || typeof claims.iss !== "string")
            throw new Error("Missing identity");
          const user = store.upsertAccount(
            claims.iss,
            claims.sub,
            typeof claims.name === "string"
              ? claims.name.slice(0, 100)
              : "Atlas explorer",
          );
          store.deleteSession(jar[sessionCookie]);
          const token = store.createSession(user.id);
          res.setHeader("Set-Cookie", [
            cookie(flowCookie, "", 0),
            cookie(sessionCookie, token, 7 * 24 * 3600),
          ]);
          return redirect(res, `${origin}/#/library`);
        } catch {
          return redirect(res, `${origin}/?auth=failed#/account`);
        }
      }
      if (path === "/api/auth/logout" && req.method === "POST") {
        store.deleteSession(jar[sessionCookie]);
        res.setHeader("Set-Cookie", cookie(sessionCookie, "", 0));
        return json(res, 200, { ok: true });
      }
      if (path === "/api/library" && ["GET", "PUT"].includes(req.method)) {
        if (!account)
          return json(res, 401, { error: "Sign in to access your library." });
        if (req.method === "GET")
          return json(res, 200, store.getLibrary(account.id));
        const items = await readJson(req);
        if (
          !Array.isArray(items) ||
          items.length > 1000 ||
          items.some(
            (item) =>
              !item ||
              typeof item !== "object" ||
              !allowedEventIds.has(item.eventId) ||
              !["bookmark", "favorite"].includes(item.kind),
          )
        )
          return json(res, 400, { error: "Invalid saved items." });
        store.putLibrary(account.id, items);
        return json(res, 200, { ok: true });
      }
      if (path.startsWith("/api/"))
        return json(res, 404, { error: "API route not found" });
      if (!["GET", "HEAD"].includes(req.method))
        return json(res, 405, { error: "Method not allowed" });
      let file;
      try {
        file = resolve(
          dist,
          `.${decodeURIComponent(path === "/" ? "/index.html" : path)}`,
        );
      } catch {
        return json(res, 400, { error: "Invalid path" });
      }
      if (!file.startsWith(`${resolve(dist)}${sep}`))
        return json(res, 403, { error: "Path not allowed" });
      try {
        if (!(await stat(file)).isFile())
          return json(res, 404, { error: "Not found" });
      } catch {
        return json(res, 404, {
          error: "Not found. Run pnpm build before pnpm start.",
        });
      }
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
      );
      res.setHeader(
        "Cache-Control",
        path.startsWith("/assets/")
          ? "public, max-age=31536000, immutable"
          : "no-cache",
      );
      res.writeHead(200, {
        "Content-Type": mime[extname(file)] ?? "application/octet-stream",
      });
      res.end(req.method === "HEAD" ? undefined : await readFile(file));
    } catch (error) {
      // Do not log token responses, callback URLs, cookies, or provider errors.
      if (!res.headersSent)
        json(res, Number.isInteger(error.status) ? error.status : 500, {
          error: "Request could not be completed.",
        });
      else res.end();
    }
  };
}

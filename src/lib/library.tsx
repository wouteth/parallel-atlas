import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Account, SavedItem } from "../data/types";
import { eventById } from "../data/events";

const STORAGE_KEY = "parallel-atlas-library-v1";
const validItems = (value: unknown): SavedItem[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is SavedItem =>
          !!item &&
          typeof item === "object" &&
          typeof item.eventId === "string" &&
          !!eventById[item.eventId] &&
          ["bookmark", "favorite"].includes(item.kind),
      )
    : [];
function loadGuest(): SavedItem[] {
  try {
    return validItems(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return [];
  }
}
interface Library {
  items: SavedItem[];
  account: Account | null;
  authAvailable: boolean;
  busy: boolean;
  error: string;
  toggle: (eventId: string, kind: SavedItem["kind"]) => Promise<void>;
  logout: () => Promise<void>;
}
const Context = createContext<Library | null>(null);
export function LibraryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(loadGuest);
  const [account, setAccount] = useState<Account | null>(null);
  const [authAvailable, setAuthAvailable] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function initialize() {
      try {
        const response = await fetch("/api/me", { signal: controller.signal });
        if (!response.ok)
          throw new Error(
            "Account service is unavailable. Browser bookmarks still work.",
          );
        const result = await response.json();
        setAuthAvailable(result.authAvailable === true);
        if (result.account) {
          const saved = await fetch("/api/library", {
            signal: controller.signal,
          });
          if (!saved.ok)
            throw new Error(
              "Could not load your account library. Please reload before saving.",
            );
          setItems(validItems(await saved.json()));
          setAccount(result.account);
        }
      } catch (err) {
        if (!controller.signal.aborted)
          setError(
            err instanceof Error ? err.message : "Account service unavailable.",
          );
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    }
    void initialize();
    return () => controller.abort();
  }, []);
  async function toggle(eventId: string, kind: SavedItem["kind"]) {
    if (busy) return;
    const exists = items.some(
      (item) => item.eventId === eventId && item.kind === kind,
    );
    const next = exists
      ? items.filter(
          (item) => !(item.eventId === eventId && item.kind === kind),
        )
      : [...items, { eventId, kind }];
    setBusy(true);
    setError("");
    try {
      if (account) {
        const response = await fetch("/api/library", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        });
        if (!response.ok)
          throw new Error(
            "Your change was not saved. Please try again or sign in again.",
          );
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      setItems(next);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Storage is unavailable. Your change was not saved.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok)
        throw new Error("Could not sign out. Please try again.");
      setAccount(null);
      setItems(loadGuest());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign out.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Context.Provider
      value={{ items, account, authAvailable, busy, error, toggle, logout }}
    >
      {children}
    </Context.Provider>
  );
}
export function useLibrary() {
  const value = useContext(Context);
  if (!value) throw new Error("LibraryProvider missing");
  return value;
}

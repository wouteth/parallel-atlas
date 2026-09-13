import { useSyncExternalStore } from "react";

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}
export function useRoute() {
  return useSyncExternalStore(
    subscribe,
    () => location.hash.slice(1) || "/timeline",
  );
}
export function navigate(path: string) {
  location.hash = path;
}

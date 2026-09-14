import { useSyncExternalStore } from "react";
import { eventPath, updateExplorerRoute } from "./explorer";

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
export function replaceRoute(path: string) {
  if (location.hash.slice(1) === path) return;
  history.replaceState(null, "", `#${path}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}
export function timelineEventHref(id: string) {
  return `#${eventPath(id, location.hash.slice(1))}`;
}

export function timelineFocusHref(id: string) {
  const current = location.hash.slice(1);
  const base =
    current.startsWith("/timeline") && current.includes("?")
      ? `/timeline?${current.split("?")[1]}`
      : "/timeline";
  return `#${updateExplorerRoute(base, { focus: id, view: null, from: null, to: null })}`;
}

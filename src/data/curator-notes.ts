import type { TrackId } from "./types";

export interface CuratorNoteEntry {
  author: string;
  body: string;
  updated: string; // ISO date: YYYY-MM-DD
}

// Add reviewed, attributed contributions here. No specialists have contributed yet.
// Updates are reviewed in the repository and included in the next static build.
export const curatorNotes: Partial<Record<TrackId, CuratorNoteEntry>> = {};

import type { TrackId } from "../data/types";
import { curatorNotes } from "../data/curator-notes";

export function CuratorNote({ trackId }: { trackId: TrackId }) {
  const note = curatorNotes[trackId];
  if (!note) return null;
  return (
    <aside className="curator-note">
      <h3>Specialist note</h3>
      <p className="whitespace-pre-wrap">{note.body}</p>
      <small>
        {note.author} · updated {note.updated}
      </small>
    </aside>
  );
}

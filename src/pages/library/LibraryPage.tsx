import { useState } from "react";
import { useLibrary } from "../../lib/library";
import { eventById } from "../../data/events";
import { EventCard } from "../../components/EventCard";
import { Icon } from "../../components/Icon";

export function LibraryPage() {
  const library = useLibrary();
  const [tab, setTab] = useState<"bookmark" | "favorite">("bookmark");
  const entries = library.items
    .filter((item) => item.kind === tab)
    .map((item) => eventById[item.eventId])
    .filter((event) => !!event);
  return (
    <main className="reference-page">
      <section className="page-intro">
        <span className="eyebrow">YOUR PERSONAL FIELD NOTES</span>
        <h1>
          Keep a thread.
          <br />
          <em>Come back to it.</em>
        </h1>
        <p>
          {library.account
            ? `Welcome, ${library.account.name}. Your library is saved to your account.`
            : "A quiet place for the stories you want to return to. Guest saves stay in this browser."}
        </p>
      </section>
      <div className="library-account">
        <div className="account-avatar">
          <Icon name="user" size={25} />
        </div>
        <div>
          <strong>{library.account?.name ?? "Your browser library"}</strong>
          <p>
            {library.account
              ? "Account bookmarks and favorites"
              : "No account needed to start exploring."}
          </p>
        </div>
        {library.account ? (
          <button
            className="button secondary"
            disabled={library.busy}
            onClick={() => void library.logout()}
          >
            Sign out
          </button>
        ) : (
          <a href="#/account" className="button secondary">
            Account settings <Icon name="arrow" size={14} />
          </a>
        )}
      </div>
      <div className="reference-tools">
        <div className="segmented">
          {(["bookmark", "favorite"] as const).map((kind) => (
            <button
              key={kind}
              aria-pressed={tab === kind}
              onClick={() => setTab(kind)}
            >
              <Icon
                name={kind === "bookmark" ? "bookmark" : "heart"}
                size={16}
              />
              {kind === "bookmark" ? "Bookmarks" : "Favorites"}
              <span>
                {library.items.filter((item) => item.kind === kind).length}
              </span>
            </button>
          ))}
        </div>
      </div>
      {library.error && (
        <p role="status" className="notice">
          {library.error}
        </p>
      )}
      <div className="event-grid">
        {entries.map((event) => (
          <div key={event.id}>
            <EventCard event={event} />
            <button
              className="text-button remove-saved"
              disabled={library.busy}
              onClick={() => void library.toggle(event.id, tab)}
            >
              Remove {tab}
            </button>
          </div>
        ))}
      </div>
      {!entries.length && (
        <div className="empty-state library-empty">
          <Icon name={tab === "bookmark" ? "bookmark" : "heart"} size={32} />
          <h2>Your next discovery belongs here.</h2>
          <p>Open any timeline entry and save it as a {tab}.</p>
          <a href="#/timeline" className="button primary">
            Explore the timeline <Icon name="arrow" />
          </a>
        </div>
      )}
    </main>
  );
}
export function AccountPage() {
  const library = useLibrary();
  const failed = new URLSearchParams(location.search).get("auth") === "failed";
  return (
    <main className="reference-page account-page">
      <section className="page-intro">
        <span className="eyebrow">YOUR CORNER OF THE ATLAS</span>
        <h1>
          A place for
          <br />
          <em>your discoveries.</em>
        </h1>
        <p>
          Save favorites, bookmark sources, and pick up the thread another day.
        </p>
      </section>
      <section className="account-panel">
        <Icon name="user" size={36} />
        <h2>
          {library.account
            ? `Hello, ${library.account.name}.`
            : "Bring your library with you."}
        </h2>
        {library.account ? (
          <>
            <p>
              You are signed in. Account saves are stored securely on the
              server. Guest saves remain separate in this browser.
            </p>
            <a className="button primary" href="#/library">
              Open your library <Icon name="arrow" />
            </a>
            <button
              className="text-button"
              disabled={library.busy}
              onClick={() => void library.logout()}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <p>
              Browser bookmarks work now. Account sign-in enables a personal
              library across devices once the project’s identity provider is
              connected.
            </p>
            {library.authAvailable ? (
              <a className="button primary" href="/api/auth/login">
                Sign in securely <Icon name="arrow" />
              </a>
            ) : (
              <span className="notice">
                Account sign-in is not configured for this installation yet.
              </span>
            )}
            <a className="button secondary" href="#/library">
              Continue with browser bookmarks
            </a>
            <p className="fine-print">
              Signing in opens a separate account library. Existing browser
              saves are retained on this device.
            </p>
          </>
        )}
        {failed && (
          <p className="notice" role="alert">
            Sign-in could not be completed. Try again or contact the project
            administrator.
          </p>
        )}
        {library.error && (
          <p className="notice" role="status">
            {library.error}
          </p>
        )}
      </section>
    </main>
  );
}

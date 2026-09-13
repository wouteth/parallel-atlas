import { useEffect, useState } from "react";
import { useRoute } from "./lib/router";
import { useLibrary } from "./lib/library";
import { TimelinePage } from "./pages/timeline/TimelinePage";
import { GlossaryPage } from "./pages/glossary/GlossaryPage";
import { SymbolsPage } from "./pages/symbols/SymbolsPage";
import { MissionPage } from "./pages/mission/MissionPage";
import { AccountPage, LibraryPage } from "./pages/library/LibraryPage";
import { SourcesPage } from "./pages/sources/SourcesPage";
import { ComparePage } from "./pages/compare/ComparePage";
import { Icon } from "./components/Icon";
import { tracks } from "./data/tracks";

export default function App() {
  const route = useRoute();
  const [menu, setMenu] = useState(false);
  const library = useLibrary();
  const section = route.split("/")[1]?.split("?")[0] ?? "timeline";
  const id = route.split("/")[2]?.split("?")[0];
  useEffect(() => {
    setMenu(false);
    if (!route.includes("/event/"))
      window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `${section === "timeline" ? "Many stories. One shared past." : section.charAt(0).toUpperCase() + section.slice(1)} — Parallel Atlas`;
  }, [route, section]);
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a href="#/timeline" className="brand" aria-label="Parallel Atlas home">
          <span className="brand-mark">
            {tracks.slice(0, 5).map((track) => (
              <i key={track.id} style={{ background: track.color }} />
            ))}
          </span>
          <span>
            parallel<span className="brand-second">atlas</span>
            <sup>↗</sup>
          </span>
        </a>
        <nav className={menu ? "open" : ""} aria-label="Main navigation">
          {[
            ["timeline", "The timeline"],
            ["compare", "Compare"],
            ["glossary", "Glossary"],
            ["symbols", "Symbol encyclopedia"],
            ["sources", "Sources"],
            ["mission", "Our mission"],
          ].map(([path, label]) => (
            <a
              key={path}
              href={`#/${path}`}
              aria-current={section === path ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="library-link"
            href="#/library"
            aria-label="My collection"
          >
            <Icon name="bookmark" size={17} />
            <span>My collection</span>
            {library.items.length > 0 && <b>{library.items.length}</b>}
          </a>
          <a
            className="account-link"
            href="#/account"
            aria-label="Your account"
          >
            <Icon name="user" size={21} />
          </a>
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
          >
            <Icon name={menu ? "close" : "menu"} />
          </button>
        </div>
      </header>
      <div className="app-content" id="main-content" tabIndex={-1}>
        {section === "timeline" ? (
          <TimelinePage route={route} />
        ) : section === "glossary" ? (
          <GlossaryPage id={id} />
        ) : section === "symbols" ? (
          <SymbolsPage id={id} />
        ) : section === "sources" ? (
          <SourcesPage />
        ) : section === "compare" ? (
          <ComparePage route={route} />
        ) : section === "mission" ? (
          <MissionPage />
        ) : section === "library" ? (
          <LibraryPage />
        ) : section === "account" ? (
          <AccountPage />
        ) : (
          <main className="reference-page">
            <h1>A thread out of place.</h1>
            <a href="#/timeline">Return to the timeline</a>
          </main>
        )}
      </div>
      <footer className="site-footer">
        <a className="footer-brand" href="#/timeline">
          parallel atlas <span>↗</span>
        </a>
        <span>An independent exploration. An open mind.</span>
        <div>
          <a href="#/mission">About the project</a>
          <span>Research edition · 0.3</span>
        </div>
      </footer>
    </>
  );
}

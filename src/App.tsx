import { Button } from "./components/ui/Controls";
import { DropdownMenu } from "@radix-ui/themes";
import {
  MethodologyPage,
  QuestsPage,
  WhatChangesPage,
  CollaboratorsPage,
  ChangelogPage,
} from "./pages/research/ResearchPages";
import { ConnectionsPage } from "./pages/connections/ConnectionsPage";
import { MapPage } from "./pages/map/MapPage";
import { useEffect, useRef, useState } from "react";
import { useRoute } from "./lib/router";
import { TimelinePage } from "./pages/timeline/TimelinePage";
import { GlossaryPage } from "./pages/glossary/GlossaryPage";
import { SymbolsPage } from "./pages/symbols/SymbolsPage";
import { MissionPage } from "./pages/mission/MissionPage";
import { SourcesPage } from "./pages/sources/SourcesPage";
import { BookCoveragePage } from "./pages/sources/BookCoveragePage";
import { ComparePage } from "./pages/compare/ComparePage";
import { Icon } from "./components/Icon";
import { tracks } from "./data/tracks";

export default function App() {
  const route = useRoute();
  const [menu, setMenu] = useState(false);
  const timelineRoute = useRef("/timeline");
  if (route.startsWith("/timeline"))
    timelineRoute.current = `/timeline${route.includes("?") ? "?" + route.split("?")[1] : ""}`;
  const section = route.split("/")[1]?.split("?")[0] ?? "timeline";
  const id = route.split("/")[2]?.split("?")[0];
  useEffect(() => {
    setMenu(false);
    document.title = `${section.charAt(0).toUpperCase() + section.slice(1).replaceAll("-", " ")} — Project Timeline`;
  }, [route, section]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [section]);
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
        <a
          href="#/timeline"
          className="brand"
          aria-label="Project Timeline home"
        >
          <span className="brand-mark">
            {tracks.slice(0, 5).map((track) => (
              <i key={track.id} style={{ background: track.color }} />
            ))}
          </span>
          <span>
            Project <span className="brand-second">Timeline</span>
          </span>
        </a>
        <nav className={menu ? "open" : ""} aria-label="Main navigation">
          {[
            ["timeline", "The timeline"],
            ["compare", "Compare"],
            ["map", "World map"],
            ["connections", "Connections"],
          ].map(([path, label]) => (
            <a
              key={path}
              href={`#${path === "timeline" ? timelineRoute.current : `/${path}`}`}
              aria-current={section === path ? "page" : undefined}
            >
              {label}
            </a>
          ))}
          {[
            {
              title: "Reference",
              links: [
                ["glossary", "Glossary"],
                ["symbols", "Symbol encyclopedia"],
                ["sources", "Sources"],
                ["books", "Book coverage"],
              ],
            },
            {
              title: "About & research",
              links: [
                ["methodology", "Methodology"],
                ["quests", "Research questions"],
                ["mission", "Our mission"],
                ["what-would-change", "What would change"],
                ["collaborators", "We need collaborators"],
                ["changelog", "Changelog"],
              ],
            },
          ].map((group) => (
            <DropdownMenu.Root key={group.title}>
              <DropdownMenu.Trigger>
                <Button variant="ghost" className="nav-menu-button">
                  {group.title} <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                {group.links.map(([path, label]) => (
                  <DropdownMenu.Item asChild key={path}>
                    <a
                      href={`#/${path}`}
                      aria-current={section === path ? "page" : undefined}
                    >
                      {label}
                    </a>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ))}
        </nav>
        <div className="header-actions">
          <Button
            className="icon-button mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
          >
            <Icon name={menu ? "close" : "menu"} />
          </Button>
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
        ) : section === "books" ? (
          <BookCoveragePage />
        ) : section === "compare" ? (
          <ComparePage route={route} />
        ) : section === "mission" ? (
          <MissionPage />
        ) : section === "methodology" ? (
          <MethodologyPage />
        ) : section === "connections" ? (
          <ConnectionsPage />
        ) : section === "map" ? (
          <MapPage />
        ) : section === "quests" ? (
          <QuestsPage />
        ) : section === "what-would-change" ? (
          <WhatChangesPage />
        ) : section === "collaborators" ? (
          <CollaboratorsPage />
        ) : section === "changelog" ? (
          <ChangelogPage />
        ) : (
          <main className="reference-page">
            <h1>Page not found</h1>
            <a href="#/timeline">Return to the timeline</a>
          </main>
        )}
      </div>
      <footer className="site-footer">
        <a className="footer-brand" href="#/timeline">
          Project Timeline
        </a>
        <div>
          <a href="#/mission">About the project</a>
          <span>Pre-launch · 0.4.8</span>
        </div>
      </footer>
    </>
  );
}

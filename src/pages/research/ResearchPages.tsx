import { Card } from "@radix-ui/themes";
import { LinkButton } from "../../components/ui/Controls";
import type { ReactNode } from "react";
import { quests, disagreements, projectHistory } from "../../data/comparative";
import { tracks } from "../../data/tracks";
import { events, eventById } from "../../data/events";
import { CuratorNote } from "../../components/CuratorNote";
export function ResearchShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="reference-page research-page">
      <section className="page-intro">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
      </section>
      {children}
    </main>
  );
}
export function MethodologyPage() {
  return (
    <ResearchShell title="Methodology" eyebrow="WORKING DRAFT · 0.4">
      <p>
        We compare traditions that may describe the same events or figures under
        different names. Each proposed connection records similarities,
        contradictions and the evidence still needed.
      </p>
      <div className="research-grid">
        <Card asChild size="3">
          <article className="research-card">
            <h2>1. Compare narrative roles</h2>
            <p>
              Compare functions such as rebellion, flood, or a civilization’s
              fall, regardless of names. Record exact passages, translations and
              the reason for selecting the pair. Broadly common motifs alone are
              weak evidence.
            </p>
          </article>
        </Card>
        <Card asChild size="3">
          <article className="research-card">
            <h2>2. Check the context</h2>
            <p>
              Compare timing, geography and consequences, including
              disagreements. Distinguish when a text was written from when it
              sets its story. Test borrowing, shared predecessors and
              translation effects before calling sources independent.
            </p>
          </article>
        </Card>
        <Card asChild size="3">
          <article className="research-card">
            <h2>3. Rate the proposed match</h2>
            <p>
              <strong>Strong match:</strong> several independent lines align.{" "}
              <strong>Suggestive match:</strong> one or two overlaps warrant
              investigation. <strong>Speculative match:</strong> thematic
              resemblance only. These are editorial assessments of a proposed
              connection, not proof of historicity.
            </p>
          </article>
        </Card>
      </div>
      <Card asChild size="3">
        <section className="research-card">
          <h2>Source independence</h2>
          <p>
            Convergence between demonstrably independent sources deserves more
            weight than one account repeated many times. A modern book drawing
            on an ancient text is not a second independent ancient witness.
            Authored fiction, sacred narratives, archaeological evidence and
            editorial hypotheses retain their own labels.
          </p>
          <p>
            Graph numbers count comparison points. Event counts list the tracks
            and sources in a reviewed group, counting each once. Neither number
            measures credibility.
          </p>
        </section>
      </Card>
      <Card asChild size="3">
        <section className="research-card">
          <h2>Worked example: Ragnarok and Lucifer</h2>
          <p>
            The initial overlap is conflict involving a supernatural order.
            Context does not yet align: the narratives describe different
            outcomes, and Ragnarok has no verified calendar placement. Urantia
            53:4.1 places its manifesto about 200,000 years ago. The proposed
            connection is <strong>Speculative match</strong>.
          </p>
          <LinkButton className="chip" href="#/connections">
            Inspect the connection
          </LinkButton>
          <LinkButton className="chip" href="#/quests">
            Research question
          </LinkButton>
          <LinkButton
            className="chip"
            href="#/timeline/event/urantia-lucifer-rebellion"
          >
            Read the cited passage
          </LinkButton>
        </section>
      </Card>
      <p>
        Dates use BCE/CE without year zero. Relative dates include their
        reference year. Accounts without a supported calendar date appear in the
        account list.
      </p>
    </ResearchShell>
  );
}
export function QuestsPage() {
  return (
    <ResearchShell
      title="Research questions"
      eyebrow="OPEN QUESTIONS · UPDATED 14 SEPTEMBER 2026"
    >
      <p>Open questions, findings so far and sources still to check.</p>
      <div className="research-grid">
        {quests.map((quest, index) => (
          <Card asChild size="3" key={quest.id}>
            <article className="research-card" id={quest.id} key={quest.id}>
              <span className="eyebrow">
                QUESTION {index + 1} · {quest.status}
              </span>
              <h2>{quest.title}</h2>
              <p>{quest.question}</p>
              <p>{quest.findings}</p>
              <h3>Next steps</h3>
              <ul>
                {quest.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              {quest.eventIds.map((id) => (
                <LinkButton
                  className="chip"
                  key={id}
                  href={`#/timeline/event/${id}`}
                >
                  {eventById[id]?.title}
                </LinkButton>
              ))}
            </article>
          </Card>
        ))}
      </div>
    </ResearchShell>
  );
}
export function DisagreementsPanel() {
  return (
    <section className="combination-panel">
      <h2>Conflicting accounts</h2>
      <p>Claims that conflict under the interpretations described below.</p>
      {disagreements.map((item) => (
        <Card asChild size="3" key={item.id}>
          <article className="research-card" key={item.id}>
            <h3>{item.title}</h3>
            <div className="research-grid">
              <p>{item.leftClaim}</p>
              <p>{item.rightClaim}</p>
            </div>
            <p>
              <strong>Why they conflict:</strong> {item.incompatibility}
            </p>
            <p>{item.qualification}</p>
            <LinkButton
              className="chip"
              href={`#/compare?left=${item.leftId}&right=${item.rightId}`}
            >
              Compare claims and citations
            </LinkButton>
          </article>
        </Card>
      ))}
    </section>
  );
}
export function WhatChangesPage() {
  return (
    <ResearchShell title="What would change?">
      <p>
        Solid evidence of a civilization preceding known human civilizations
        would change our account of the past. The extent of the change would
        depend on what was actually discovered: its date, makers, technology and
        context.
      </p>
      <div className="research-grid">
        <Card asChild size="3">
          <article className="research-card">
            <h2>Archaeology</h2>
            <p>
              Securely dated sites, artifacts and production systems could move
              accepted chronologies and reshape models of settlement, technology
              and cultural transmission. Independent excavation, provenance and
              reproducible dating would be essential. An anomalous object alone
              would not establish a civilization.
            </p>
          </article>
        </Card>
        <Card asChild size="3">
          <article className="research-card">
            <h2>Religion and tradition</h2>
            <p>
              Traditions could be reread in light of new material evidence. A
              parallel with one passage would not validate every claim in a
              text, settle theology or make different religious communities
              respond alike.
            </p>
          </article>
        </Card>
        <Card asChild size="3">
          <article className="research-card">
            <h2>History and education</h2>
            <p>
              Textbooks, museum interpretation and research priorities would
              need revision wherever evidence changes the chronology. Claims
              about a nonhuman civilization would require evidence about its
              makers, beyond evidence that a site is simply older.
            </p>
          </article>
        </Card>
      </div>
      <Card asChild size="3">
        <section className="research-card">
          <h2>What would count as evidence?</h2>
          <p>
            The claim would need securely dated material evidence that other
            researchers could examine. Narrative similarities alone would not
            establish an earlier civilization. This page describes a possible
            discovery, not one the project has made.
          </p>
          <LinkButton className="chip" href="#/methodology">
            Read the methodology
          </LinkButton>
        </section>
      </Card>
    </ResearchShell>
  );
}
export function CollaboratorsPage() {
  return (
    <ResearchShell title="We need collaborators" eyebrow="VOLUNTEER ROLES">
      <p>
        We need one volunteer specialist per track to check passages, dates,
        cultural context and proposed connections. These roles are unpaid.
      </p>
      <p>
        Contributions should include the source edition, passage, proposed text,
        dating basis and any contradictory evidence. Contact details have not
        been added yet.
      </p>
      <div className="research-grid">
        {tracks.map((track) => (
          <Card asChild size="3" key={track.id}>
            <article
              className="research-card"
              key={track.id}
              style={{ borderTop: `4px solid ${track.color}` }}
            >
              <span className="eyebrow">
                {track.status ?? "Confirmed"} TRACK
              </span>
              <h2>{track.name} specialist</h2>
              <p>{track.description}</p>
              <p>
                {events.filter((event) => event.trackId === track.id).length}{" "}
                catalog records. {track.researchNote}
              </p>
              <CuratorNote trackId={track.id} />
            </article>
          </Card>
        ))}
      </div>
    </ResearchShell>
  );
}
export function ChangelogPage() {
  return (
    <ResearchShell
      title="Changelog"
      eyebrow="PRE-LAUNCH · CURRENT VERSION 0.4.8"
    >
      <p>
        Started September 13, 2026. Versions remain 0.x during development; the
        launch release will be 1.0.
      </p>
      <ol className="project-history">
        {projectHistory.map((item) => (
          <li className="research-card" key={item.version}>
            <time>{item.date}</time>
            <h2>Version {item.version}</h2>
            <p>{item.changes}</p>
          </li>
        ))}
      </ol>
      <Card asChild size="3">
        <section className="research-card">
          <h2>Prompt history</h2>
          <p>
            Build briefs 6, 7, 7.1, 0.3 and 0.4 record the requested features.
            The entries above record what has been built.
          </p>
          <p>
            This is a public preview. The source repository is currently
            private; an open-source release is planned.
          </p>
        </section>
      </Card>
    </ResearchShell>
  );
}

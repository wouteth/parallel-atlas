import { supportConfig } from "../../data/sources";
import { Icon } from "../../components/Icon";

export function MissionPage() {
  return (
    <main className="reference-page mission-page">
      <section className="page-intro">
        <span className="eyebrow">WHO WE ARE · A WORKING MISSION</span>
        <h1>
          Stay curious.
          <br />
          <em>Keep the sources close.</em>
        </h1>
        <p>
          Parallel Atlas is a place to explore how different traditions tell the
          story of our past—and to make those differences easier to see.
        </p>
      </section>
      <div className="mission-principles">
        <article>
          <span className="section-number">01</span>
          <h2>One scale. Many voices.</h2>
          <p>
            We place archaeology, sacred texts, classical literature, and
            alternative accounts beside one another. Shared position means a
            shared date scale. Each account keeps its own evidence label and
            context.
          </p>
        </article>
        <article>
          <span className="section-number">02</span>
          <h2>A path back to the source.</h2>
          <p>
            Every event should lead to a specific passage, chapter, or record.
            We distinguish a date stated by a source from a date inferred by an
            editor, and a narrated event from a text’s composition.
          </p>
        </article>
        <article>
          <span className="section-number">03</span>
          <h2>Room for an honest gap.</h2>
          <p>
            When the dataset lacks a counterpart, we say so. “Ignored by
            mainstream history.” is a project label for an absent accepted
            counterpart; it is not a claim that scholars have never engaged with
            the subject.
          </p>
        </article>
      </div>
      <section className="whitepaper-block">
        <Icon name="book" size={32} />
        <span className="eyebrow">THE FOUNDATIONS OF THE PROJECT</span>
        <h2>
          A living mission.
          <br />
          <em>A white paper to come.</em>
        </h2>
        <p>
          This space is reserved for the project’s full methodology, editorial
          principles, and introduction to the people behind the atlas.
        </p>
        {supportConfig.whitePaperUrl ? (
          <a className="button primary" href={supportConfig.whitePaperUrl}>
            Read our white paper <Icon name="arrow" />
          </a>
        ) : (
          <span className="tag">White paper in preparation</span>
        )}
      </section>
      <section className="reference-section">
        <h2>How to read this atlas</h2>
        <div className="mission-reading">
          <p>
            <strong>Calendar dates & years ago.</strong> Dates use BCE and CE,
            without a year zero. “Years ago” is calculated from the current UTC
            calendar year. Scientific BP dates would need their own explicit
            reference year, usually 1950.
          </p>
          <p>
            <strong>Precision & uncertainty.</strong> Zooming in reveals finer
            grid lines; it does not make an approximate event more precise.
            Expand an event for its dating method and uncertainty.
          </p>
          <p>
            <strong>A growing collection.</strong> This first edition is a
            working scaffold. Seed events and reference profiles demonstrate the
            structure; they are not a complete history of any source.
          </p>
          <p>
            <strong>Images & symbols.</strong> Timeline photography is
            illustrative. Symbol diagrams show recognizable forms; cultural
            usage fields remain open for sourced research.
          </p>
        </div>
      </section>
      <section className="support-block">
        <div>
          <span className="eyebrow">SUSTAINING INDEPENDENT EXPLORATION</span>
          <h2>Support the work, directly.</h2>
          <p>
            Future author-direct book links, project merchandise, and Patreon
            support will live here. Commercial links will carry their own
            disclosure.
          </p>
        </div>
        <div>
          {supportConfig.patreonUrl ? (
            <a className="button secondary" href={supportConfig.patreonUrl}>
              Support on Patreon <Icon name="arrow" />
            </a>
          ) : (
            <span className="tag">Patreon · coming later</span>
          )}
          {supportConfig.merchandiseUrl ? (
            <a className="button secondary" href={supportConfig.merchandiseUrl}>
              Visit the shop <Icon name="arrow" />
            </a>
          ) : (
            <span className="tag">Field goods · coming later</span>
          )}
        </div>
      </section>
    </main>
  );
}

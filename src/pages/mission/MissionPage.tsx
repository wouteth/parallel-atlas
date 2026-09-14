import { LinkButton } from "../../components/ui/Controls";
import { supportConfig } from "../../data/sources";

export function MissionPage() {
  return (
    <main className="reference-page mission-page">
      <section className="page-intro">
        <h1>About Project Timeline</h1>
        <p>
          Project Timeline compares historical research, religious texts,
          mythology and alternative accounts on a common timeline.
        </p>
      </section>
      <section className="reference-section">
        <h2>Our mission</h2>
        <p>
          The project aims to help demonstrate that humanity is not the first
          civilization on Earth. This is our starting position, not an
          established historical finding. We document sources, disagreements and
          missing evidence so readers can assess the claims.
        </p>
        <LinkButton className="chip" href="#/methodology">
          Methodology
        </LinkButton>
        <LinkButton className="chip" href="#/what-would-change">
          What would change?
        </LinkButton>
      </section>
      <div className="mission-principles">
        <article>
          <h2>Source types</h2>
          <p>
            Archaeology, religious narratives, fiction and alternative accounts
            are labeled separately. Placing them on the same timeline does not
            give them the same evidential status.
          </p>
        </article>
        <article>
          <h2>Dates and citations</h2>
          <p>
            Entries include passage references and explain how their dates were
            assigned. Dates stated in a source are distinguished from editorial
            estimates and publication dates.
          </p>
        </article>
        <article>
          <h2>Gaps in the collection</h2>
          <p>
            Coverage is incomplete. The label “Ignored by mainstream history.”
            means there is no accepted historical counterpart in this
            collection. It does not mean scholars have never studied the
            subject.
          </p>
        </article>
      </div>
      <section className="reference-section">
        <h2>Reading the timeline</h2>
        <div className="mission-reading">
          <p>
            <strong>Calendar dates.</strong> BCE/CE has no year zero. “Years
            ago” uses the current calendar year. Scientific BP dates use the
            reference year given in the entry, often 1950.
          </p>
          <p>
            <strong>Approximate dates.</strong> Zooming changes the scale, not
            the precision of a date. Open an entry to check its dating basis.
          </p>
          <p>
            <strong>Images.</strong> Many timeline images are illustrations.
            Open an image for its caption and credit.
          </p>
        </div>
        <h2>White paper</h2>
        {supportConfig.whitePaperUrl ? (
          <LinkButton className="chip" href={supportConfig.whitePaperUrl}>
            Read the white paper
          </LinkButton>
        ) : (
          <p>Filipe is preparing the project’s white paper.</p>
        )}
      </section>
      {(supportConfig.patreonUrl || supportConfig.merchandiseUrl) && (
        <section className="reference-section">
          <h2>Support the project</h2>
          {supportConfig.patreonUrl && (
            <LinkButton className="chip" href={supportConfig.patreonUrl}>
              Patreon
            </LinkButton>
          )}
          {supportConfig.merchandiseUrl && (
            <LinkButton className="chip" href={supportConfig.merchandiseUrl}>
              Shop
            </LinkButton>
          )}
        </section>
      )}
    </main>
  );
}

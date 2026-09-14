# Roadmap

The goal is a source-traceable atlas that makes different accounts of the past easier to compare, with explicit dating and evidence context. This roadmap describes priorities, not promised delivery dates. [Issues and pull requests](https://github.com/wouteth/parallel-atlas/issues) are the place to propose and coordinate specific work.

## Available in the research edition

- Six source tracks on a zoomable timeline with desktop and mobile layouts.
- Search, entry details, side-by-side comparisons, and shareable routes.
- Connected source, glossary, and symbol reference collections.
- Explicit date provenance, uncertain ranges, and unplaced records.
- Local guest bookmarks, structured JSON export, and an account API requiring OIDC configuration.

## Current priorities

### Strengthen the research

Add specialist excavation and chronology reports behind broad institutional summaries. Extend passage-level verification, document conflicting dates, and improve artifact-specific symbol contexts. Keep reviewed content and discovery records distinguishable. The [research log](docs/research-log.md#next-research-passes) lists concrete source work.

### Improve access and usability

Test with screen readers and physical touch devices. Address keyboard and small-screen issues reported by contributors. Improve dense timelines while preserving navigation, stable links, and date uncertainty.

### Improve documentary images

Replace generic illustrative photographs with appropriately licensed, site-specific or artifact-specific images where possible. Preserve provenance, alt text, rights information, and the distinction between an illustration and evidence.

### Prepare a deployable service

Verify the live OIDC flow, including logout and account isolation across devices. Define account export/deletion, storage, backups, monitoring, and rate limiting. Evaluate concurrent saved-item updates before relying on the current whole-library replacement behavior for a public service.

### Publish the methodology

Develop the [white paper outline](docs/white-paper.md) into a reviewed methodology covering source selection, chronology, uncertainty, corrections, and editorial independence. The outline is not a published white paper.

## Later possibilities

An editorial CMS, richer date-uncertainty visualization, expanded source coverage, and additional deployment options may follow as contributor needs become clearer. Propose a focused use case before building one of these larger changes.

## How priorities are chosen

Correctness, source traceability, accessibility, and maintainability guide review. Funding or future commercial links must be disclosed and should not determine how an account's evidence is represented. Inclusion of an account does not imply endorsement.

Start with a small correction or a scoped proposal using [CONTRIBUTING.md](CONTRIBUTING.md). The maintainer reviews scope and readiness before merging.

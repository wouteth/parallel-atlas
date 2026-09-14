# Security policy

## Maintenance scope

Project Timeline is an early research edition. Security fixes target the current `main` branch; there are no separately maintained release lines or guaranteed support windows. Operators of their own deployments are responsible for configuration, dependency updates, and user data.

The current edition is a static, read-only site without an account API, sessions or database. Deployment and remaining limitations are documented in [HANDOFF.md](HANDOFF.md).

## Report a vulnerability privately

Use [GitHub's private vulnerability reporting form](https://github.com/wouteth/project-timeline/security/advisories/new). Private reporting is enabled for this repository. Do not open a public issue or pull request containing exploit details, credentials, session cookies, or other people's data.

Include:

- The affected commit or version and relevant component.
- Reproduction steps using a local instance or environment you control.
- Expected and actual behavior, likely impact, and a minimal proof of concept if available.
- Relevant configuration with secrets and personal data removed.

Reports are reviewed by the repository maintainer as availability permits. There is no guaranteed response time or paid bounty program. Use the private advisory thread to coordinate a fix and disclosure.

Test only systems you own or have permission to assess. Stop if testing exposes another person's data and report the issue without collecting more. If private reporting is temporarily unavailable, wait for it to return rather than posting sensitive details publicly.

For ordinary bugs, setup questions, or research corrections, see [SUPPORT.md](SUPPORT.md).

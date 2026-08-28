# Security Policy

## Supported Versions

Security fixes are guaranteed for:

- the current `main` branch
- the latest published version

Older releases should be considered unsupported unless stated otherwise.

## What To Report

Please report vulnerabilities involving:

- malicious or unexpected content injected into generated SVG components (e.g. script injection through icon markup or titles)
- issues in the generation pipeline that could produce unsafe output
- denial-of-service vectors (infinite loops, excessive memory allocation during generation)
- dependency supply-chain issues, including the upstream `@material-design-icons/svg` package

If you are unsure whether something is security-relevant, report it anyway.

## How To Report

Do **not** open public issues for suspected vulnerabilities.

Report them privately to:

- `is.kkokotero@gmail.com`

When possible, include:

- a clear description of the issue
- affected version or commit
- reproduction steps
- proof of concept or sample code
- expected impact
- suggested remediation

## Response Expectations

The project will try to:

- acknowledge reports within 72 hours
- provide an initial assessment within 7 days when practical
- coordinate a fix before public disclosure

These are goals, not guarantees, especially while the project is small.

## Disclosure

Please allow time for coordinated remediation before disclosing a vulnerability publicly.

Once a fix is available, the project may publish:

- a summary of the issue
- affected scope
- remediation guidance

## Security Design Notes

`material-design-icons-svelte` reduces risk by:

- maintaining zero runtime dependencies
- generating static, reviewable Svelte components from a trusted upstream source
- keeping the API surface minimal and predictable (props spread onto a plain `<svg>`)
- failing fast on malformed SVG input during generation

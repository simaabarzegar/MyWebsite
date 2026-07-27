# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single-page static personal website (personal portfolio/CV site) for Sima Barzegar. No build system, package manager, or dependencies — just plain HTML/CSS/JS served as static files.

## Commands

There is no build, lint, or test tooling in this repo. To preview changes:

- Open `index.html` directly in a browser, or
- Serve the folder with any static file server (e.g. `npx serve .` or `python -m http.server`) if you need working `fetch`/relative-path behavior identical to production hosting.

## Architecture

- **`index.html`** — the entire site. All content lives in one page, organized into `<section>` blocks with `id`s (`about`, `profiles`, `research`, `gallery`, `documents`, `milestones`, `survey`, `contact`) that the nav bar links to via anchor hashes (`#section-id`). To add or edit content, edit the relevant section directly in this file — there are no templates or partials.
- **`styles.css`** — single stylesheet. Theming (colors, fonts) is centralized in `:root` CSS custom properties (`--bg`, `--accent`, `--font-heading`, etc.) at the top of the file; prefer changing those over hardcoding new colors. Responsive layout collapses to a single column via one `@media (max-width: 800px)` block near the bottom.
- **`script.js`** — small set of independent, self-contained behaviors, each guarded by a `document.querySelector` null-check so it's safe if a given element isn't present:
  - Footer year injection
  - Mobile nav toggle (`.nav-toggle` button toggles `.nav-open` on `.nav`)
  - Scroll-reveal animation via `IntersectionObserver` (adds `.is-visible` to any `.reveal`-tagged element as it scrolls into view)
  - Certificate image show/hide toggle in the Documents section
  - Survey form handler — **client-side only**: `preventDefault`s the submit, shows a thank-you message, and resets the form. It does not send data anywhere (no backend, no fetch call).
- **`documents/`** — plain-text files (`cv-summary.txt`, `welcome-note.txt`) linked as downloads from the Documents section of `index.html`.

# Architecture

This document describes the repository architecture and build flow.
Use it for context; use `AGENTS.md` for day-to-day operational instructions.

## High-level structure

- Source: `src/`
- Build output: `dist/`
- Build orchestration: `gulpfile.js`
- Image optimization pipeline: `gulpfile.images.js`

## Main technology choices

- Static site generation with Metalsmith.
- Handlebars layouts for HTML templates.
- SCSS modules compiled via Dart Sass + PostCSS.
- JavaScript bundled with esbuild targeting ES2020.
- Asset hashing/rewrite for cache-friendly production output.

## Content and template model

- Content lives in language folders under `src/content/`.
- Markdown frontmatter feeds template data (title, metadata, vcard, lists).
- Layouts live in `src/layouts/`.
- Metalsmith pipeline handles markdown -> permalinks -> handlebars layout rendering.

## JS runtime model

- Entry point: `src/scripts/main.js`.
- Module responsibilities are split in `src/scripts/modules/`.
- Current modules include theme management, i18n, error-code handling, and hole effect logic.
- Browser APIs are used directly (no runtime framework).

## Styling model

- Entry stylesheet: `src/scss/style.scss`.
- SCSS is organized as `utils/` + `modules/`.
- Theme values are exposed as CSS custom properties in `src/scss/utils/_variables.scss`.
- Components generally follow BEM-like naming.

## Gulp build flow

Primary production task (`pnpm build`):

1. Clean output directory.
2. Run in parallel:
   - JS bundling
   - SCSS compilation + PostCSS
   - HTML generation via Metalsmith
   - SVG sprite generation
   - static file copy from `src/_static/`
3. Hash assets and rewrite references in generated HTML/JS.
4. Minify HTML.

Development task (`pnpm start` / `pnpm dev`):

1. Clean output.
2. Build core assets/content.
3. Start BrowserSync HTTPS local server.
4. Watch content, templates, SCSS, JS, and SVG for rebuild/reload.

## Asset behavior

- SVG icons in `src/svg/` are compiled into `dist/assets/images/sprite.svg`.
- CSS/JS/images are revisioned in production via `gulp-rev`.
- Reference rewriting is handled by a custom fs pass in `hashAssets`.

## Operational constraints

- Edit source files only; never hand-edit `dist/` artifacts.
- Preserve multilingual parity when changing shared sections.
- Keep output compatible with static hosting.
- Maintain current performance posture (minimal runtime JS, modern browser targets).

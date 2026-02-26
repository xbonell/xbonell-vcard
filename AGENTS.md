# AGENTS.md

Operational guide for coding agents working in `xbonell-vcard`.
Use this as the first-stop reference for commands and code conventions.

Related context docs:

- `CHANGELOG.md` -> historical versioned changes
- `docs/product-context.md` -> product goals and audience
- `docs/architecture.md` -> system/build architecture details

## 1) Project snapshot

- Type: static personal vCard site (`xbonell.com`)
- Stack: Gulp 5 + Metalsmith + Handlebars + SCSS + ES modules + esbuild
- Package manager: `pnpm` (locked via `packageManager` in `package.json`)
- Languages: `en`, `es`, `ca`
- Output: generated static site in `dist/`

## 2) Environment and setup

- Node: use `.nvmrc` (`lts/krypton`)
- Install deps: `pnpm install`
- Preferred local workflow: run commands from repository root

## 3) Build, lint, and test commands

### Primary commands (from `package.json`)

- `pnpm start` -> default Gulp task (clean + build + dev server + watchers)
- `pnpm dev` -> alias of `pnpm start`
- `pnpm build` -> production build (`gulp build --production`)
- `pnpm images` -> optimize images using `gulpfile.images.js`

### Useful direct Gulp commands

- `pnpm exec gulp` -> same as dev workflow
- `pnpm exec gulp build --production` -> explicit production build
- `pnpm exec gulp build --dest ./dist-preview/` -> build to custom destination

### Lint and formatting status

- There is an ESLint config: `.eslintrc.json`
- There is a Prettier config: `.prettierrc`
- There are currently no dedicated npm scripts for lint/format
- There are no ESLint/Prettier packages pinned in `devDependencies`

### Lint/format commands (only if tools are available in your environment)

- `pnpm exec eslint "src/scripts/**/*.js" "gulpfile*.js"`
- `pnpm exec prettier --check "**/*.{js,scss,md,hbs,json}"`
- `pnpm exec prettier --write "src/**/*.{js,scss,md,hbs}"`

If `pnpm exec` fails due to missing binaries, install tooling first (or use `pnpm dlx`).

### Test status and single-test guidance

- There is no automated test suite configured in this repository right now
- No `test` script exists in `package.json`
- No `*.test.*` / `*.spec.*` files are present
- Single-test command: not applicable at the moment

For validation, rely on:

- `pnpm build` (must succeed)
- `pnpm start` and manual browser checks (desktop + mobile breakpoints)

## 4) Repo-specific constraints and rule files

- Checked for Cursor rules: no `.cursor/rules/` rules found
- Checked for Cursor root rules: no `.cursorrules` found
- Checked for Copilot rules: no `.github/copilot-instructions.md` found

If any of these files appear later, treat them as high priority project instructions.

## 5) Code organization map

- `src/content/` -> Markdown content with frontmatter (`en`, `es`, `ca`)
- `src/layouts/` -> Handlebars templates (`default.hbs`, `error.hbs`)
- `src/scripts/` -> browser JavaScript modules (ESM)
- `src/scss/` -> modular SCSS (`utils/`, `modules/`, `style.scss` entry)
- `src/svg/` -> source SVG icons for sprite generation
- `src/_static/` -> copied static assets
- `gulpfile.js` -> build pipeline and task orchestration

## 6) JavaScript style guide

### Language and modules

- Use modern ES modules (`import`/`export`), not CommonJS in app code
- Keep module files focused and small; one primary responsibility per module
- Prefer named exports for reusable utilities, default export for module singleton/object

### Imports

- Order imports by: platform/library -> internal modules
- Use relative internal imports consistent with nearby files (no path alias setup)
- Keep import specifiers minimal and explicit

### Naming conventions

- `camelCase` for variables/functions/methods
- `PascalCase` for classes (`ThemeManager`, `I18nService`)
- `UPPER_SNAKE_CASE` for constant maps/enums (`THEMES`, `SUPPORTED_LANGUAGES`)
- Use descriptive names over abbreviations unless already established (`i18n` allowed)

### Formatting conventions

- Follow Prettier config: single quotes, print width ~100
- Keep semicolon usage consistent with existing file style
- Prefer trailing commas where formatter inserts them
- Avoid deeply nested conditionals; use early returns

### Types and documentation

- Project is plain JavaScript (no TypeScript)
- Add JSDoc only for non-trivial public methods or utility behavior
- Keep docs accurate; remove stale comments during refactors

### Error handling

- Wrap browser APIs that may fail (`localStorage`, `matchMedia`, DOM queries) in `try/catch`
- Fail soft in UI modules: `console.warn` for recoverable issues
- Reserve `console.error` for initialization/runtime failures that block core behavior
- Always provide a safe fallback path when possible

### DOM and events

- Cache repeatedly used DOM nodes where practical
- Bind/cleanup event listeners explicitly; provide `destroy()` when module lifecycle requires it
- Guard against missing elements before mutation
- Keep accessibility attributes (`aria-*`, labels) in sync with dynamic UI updates

## 7) SCSS and CSS style guide

- Use `@use` modules; avoid legacy `@import`
- Keep tokens in `src/scss/utils/_variables.scss`
- Use helper functions/mixins from `utils/functions` and `utils/mixins`
- Prefer CSS custom properties for theme values
- Use BEM-like class naming in components (`.theme-switcher__icon`, modifiers like `--clicked`)
- Keep media queries centralized through existing mixin patterns
- Prefer `rem`/`em` helpers over hardcoded px where project already does so

## 8) Templates and content conventions

- Keep Handlebars templates semantic and accessible
- Preserve existing metadata and structured data patterns
- In multilingual content, keep feature parity across `en`, `es`, and `ca`
- Frontmatter keys should stay consistent across language variants
- Do not hardcode production-only URLs unless already intended by template logic

## 9) Build and performance expectations

- Maintain native ES2020 output target (configured in esbuild task)
- Do not reintroduce heavy transpilation unless explicitly requested
- Preserve hashed asset pipeline behavior (`hashAssets` task)
- Keep production output minified and cache-friendly

## 10) Agent workflow checklist

Before changes:

1. Read nearby module/template styles and follow local patterns
2. Prefer minimal, targeted edits over broad rewrites

After changes:

1. Run `pnpm build`
2. If UI affected, run `pnpm start` and verify manually
3. Confirm no broken language variants when content/template changes are made

## 11) What to avoid

- Do not add new dependencies without clear need
- Do not change generated `dist/` files directly; edit `src/` and rebuild
- Do not introduce unrelated formatting churn in untouched files
- Do not remove accessibility attributes for convenience

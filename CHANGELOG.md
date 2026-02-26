# Changelog

All notable changes to this project should be documented in this file.

Notes:
- Dates below were normalized from git commit history.
- Release tags through `v1.10.6` are now present in the repository.

## [Unreleased]

## [1.10.7] - 2026-02-26

### Changed
- Reorganized agent-facing documentation into focused files.
- Kept `AGENTS.md` as an operational guide and moved context into dedicated docs.

### Added
- Added `docs/product-context.md` for product goals, audience, and outcomes.
- Added `docs/architecture.md` for build/runtime architecture and project structure.

### Documentation
- Added and normalized `CHANGELOG.md` entries and release compare links.
- Added release tags for versions `v1.9.1` through `v1.10.6`.

### Documentation
- Ongoing documentation improvements are tracked here.

## [1.10.6] - 2026-02-09

### Changed
- Updated pnpm package manager from `10.28.2` to `10.29.2`.

## [1.10.5] - 2026-01-27

### Changed
- Upgraded Node.js baseline to v24 LTS and refreshed dependencies.
- Simplified Browserslist configuration (`2026-01-09` follow-up).

## [1.10.4] - 2026-01-08

### Changed
- Deployment workflow excludes `nginx.conf` from VPS sync to avoid overwriting server-managed configuration.

## [1.10.3] - 2026-01-07

### Added
- Fade-in intro animation for error page H1 title.

### Changed
- Error page H1 stays hidden until initialized, then animates in.
- Updated `src/scss/modules/_error.scss` for opacity + keyframe behavior.
- Updated `src/scripts/modules/errorCode.js` to trigger animation via `requestAnimationFrame`.

## [1.10.2] - 2026-01-07

### Added
- Dynamic HTTP error code detection on error pages.
- New `errorCode.js` module that inspects URL patterns, query params, and Performance API.

### Changed
- Error page H1 now shows actual status code (for example `404`, `500`) instead of generic text.

## [1.10.1] - 2026-01-06

### Changed
- Migrated build file from Babel-based setup to native ESM `gulpfile.js`.
- Added `"type": "module"` in `package.json`.
- Added `dev` script alias for `gulp`.
- Refactored gulpfile to use `fileURLToPath`/`dirname` and `createRequire`.

### Removed
- Babel toolchain dependencies no longer needed for this build.

## [1.10.0] - 2026-01-06

### Changed
- Migrated package manager from Yarn to pnpm.
- Updated CI/CD workflow to use pnpm + Corepack.
- Updated docs and lockfile strategy to pnpm.

### Fixed
- Dart Sass compatibility fixes in SCSS `rgba()` usage.

## [1.9.9] - 2026-01-05

### Added
- `Sitemap` directive in `robots.txt`.

## [1.9.8] - 2026-01-05

### Changed
- Enabled HTTPS for local BrowserSync development.

### Added
- `sitemap.xml` with multilingual hreflang entries.

## [1.9.7] - 2025-12-08

### Changed
- Replaced Browserify/Babel/Uglify pipeline with esbuild-based bundling.
- Significant build performance improvements in JS bundling.

### Removed
- Legacy JS bundling/transpilation dependencies.

## [1.9.6] - 2025-12-08

### Changed
- Updated multilingual SEO metadata to reflect current React/Vue/WordPress focus.

## [1.9.5] - 2025-12-04

### Changed
- Tuned light-theme background variables for better visual hierarchy.

## [1.9.4] - 2025-12-04

### Fixed
- Asset URL rewriting in hashed output.

### Changed
- Replaced `gulp-rev-rewrite` usage with custom fs-based rewrite approach for Gulp 5 compatibility.

## [1.9.3] - 2025-12-04

### Fixed
- iOS Safari viewport and rendering issues in layout/hole behavior.

### Changed
- Centralized browser target configuration and improved async flow in hash task.

## [1.9.1] - 2025-12-04

### Changed
- Refactored interactive hole/logo mask rendering and theme-aware behavior.
- Improved parallax and shadow layering.

## [1.9.0] - 2025-12-03

### Added
- Interactive HTML viewer with circular viewport.

[Unreleased]: https://github.com/xbonell/xbonell-vcard/compare/v1.10.7...HEAD
[1.10.7]: https://github.com/xbonell/xbonell-vcard/compare/v1.10.6...v1.10.7
[1.10.6]: https://github.com/xbonell/xbonell-vcard/compare/v1.10.5...v1.10.6
[1.10.5]: https://github.com/xbonell/xbonell-vcard/compare/v1.10.4...v1.10.5
[1.10.4]: https://github.com/xbonell/xbonell-vcard/compare/v1.10.3...v1.10.4
[1.10.3]: https://github.com/xbonell/xbonell-vcard/compare/v1.10.2...v1.10.3
[1.10.2]: https://github.com/xbonell/xbonell-vcard/compare/v1.10.1...v1.10.2
[1.10.1]: https://github.com/xbonell/xbonell-vcard/compare/v1.10.0...v1.10.1
[1.10.0]: https://github.com/xbonell/xbonell-vcard/compare/v1.9.9...v1.10.0
[1.9.9]: https://github.com/xbonell/xbonell-vcard/compare/v1.9.8...v1.9.9
[1.9.8]: https://github.com/xbonell/xbonell-vcard/compare/v1.9.7...v1.9.8
[1.9.7]: https://github.com/xbonell/xbonell-vcard/compare/v1.9.6...v1.9.7
[1.9.6]: https://github.com/xbonell/xbonell-vcard/compare/v1.9.5...v1.9.6
[1.9.5]: https://github.com/xbonell/xbonell-vcard/compare/v1.9.4...v1.9.5
[1.9.4]: https://github.com/xbonell/xbonell-vcard/compare/v1.9.3...v1.9.4
[1.9.3]: https://github.com/xbonell/xbonell-vcard/compare/v1.9.1...v1.9.3
[1.9.1]: https://github.com/xbonell/xbonell-vcard/compare/v1.9.0...v1.9.1
[1.9.0]: https://github.com/xbonell/xbonell-vcard/releases/tag/v1.9.0

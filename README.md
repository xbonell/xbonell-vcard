# xbonell.com vcard

A permanently temporal business vcard site for [xbonell.com](http://xbonell.com).

## Overview

This project is the source code for the personal vCard website of xbonell.com. It serves as a digital business card, providing a concise and elegant way to share professional information, contact details, and links.

**Current Version**: 1.10.3

## Features

- **Multi-language Support**: English, Spanish, and Catalan versions
- **Modern Build System**: Gulp + Metalsmith with ES2015+ support
- **Interactive HTML Viewer**: Full viewport logo mask displaying the page's HTML source code with syntax highlighting, theme-aware mask inversion, and scroll-based parallax effects
- **Responsive Design**: Optimized for all devices and screen sizes
- **Performance Optimized**: Minified assets, image optimization, and fast loading
- **Self-contained**: No external dependencies required for deployment
- **Easy Deployment**: Static files ready for any hosting provider

## Technology Stack

- **Build System**: Gulp with Babel
- **Static Site Generator**: Metalsmith
- **Templating**: Handlebars
- **Styling**: SCSS/Sass with PostCSS
- **JavaScript**: ES2015+ with esbuild
- **Package Manager**: pnpm
- **Node.js**: v22.17.1+ supported

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 22.17.1+ recommended)
- [pnpm](https://pnpm.io/) (for dependency management)

### Installation

Clone the repository:

```bash
git clone https://github.com/xbonell/xbonell-vcard.git
cd xbonell-vcard
```

Install dependencies:

```bash
pnpm install
```

### Development

To start a local development server with live reload:

```bash
pnpm start
# or
pnpm dev
```

### Building

To build the site for production:

```bash
pnpm build
```

### Image Optimization

To optimize images:

```bash
pnpm images
```

### Deployment

The build process generates static files in the `dist/` directory that can be deployed to any static hosting provider (e.g., Vercel, Netlify, GitHub Pages).

## Project Structure

```
src/
├── _static/          # Static assets (robots.txt, humans.txt, etc.)
├── content/          # Multi-language content (en/, es/, ca/)
├── images/           # Image assets
├── layouts/          # Handlebars templates
├── scripts/          # JavaScript source files
├── scss/             # SCSS stylesheets
└── svg/              # SVG icons
```

## Multi-language Support

The site supports three languages:
- **English** (`/en/`) - Default language
- **Spanish** (`/es/`) - Spanish version
- **Catalan** (`/ca/`) - Catalan version

Content is organized in the `src/content/` directory with language-specific subdirectories.

## Build Process

The build system uses Gulp with the following features:
- **Sass compilation** with PostCSS processing (autoprefixer, cssnano)
- **JavaScript bundling** with esbuild (native ES2020 output)
- **HTML generation** with Metalsmith and Handlebars
- **Image optimization** pipeline
- **SVG sprite generation**
- **Live reload** during development

## Recent Updates

- **Version 1.10.3**: Added fade-in intro animation for error page H1 - title is hidden until initialized and performs smooth fade-in when error code is detected
- **Version 1.10.2**: Added dynamic error code detection for error pages - H1 now displays actual HTTP error codes (404, 500, etc.) instead of generic "Error" text
- **Version 1.10.1**: Migrated gulpfile from Babel to native ES modules, removed Babel dependencies, simplified build configuration
- **Version 1.10.0**: Migrated package manager from Yarn to pnpm 10.27.0, updated CI/CD pipeline, fixed SCSS compatibility issues
- **Version 1.9.9**: Added Sitemap directive to robots.txt for improved SEO discoverability
- **Version 1.9.8**: Enabled HTTPS for local development server, added sitemap.xml with multi-language hreflang support for improved SEO
- **Version 1.9.7**: Modernized JS build pipeline - replaced Browserify/Babel/Uglify with esbuild (~50% faster builds, 541ms vs 1.08s), removed 11 dependencies
- **Version 1.9.6**: Updated SEO metadata (description and keywords) across all language versions to reflect current professional focus on React, Vue.js, and WordPress
- **Version 1.9.5**: Adjusted light mode theme background colors for improved visual hierarchy (`--color-bg` is now 10% lighter, previous value moved to `--color-backstage`)
- **Version 1.9.4**: Fixed asset URL rewriting in hashAssets gulp task for both HTML and JS files, replaced gulp-rev-rewrite with custom fs-based approach for Gulp 5 compatibility
- **Version 1.9.3**: iOS Safari compatibility fixes (dvh viewport, GPU acceleration, debounced resize), centralized browserslist, Yarn 4.12.0
- **Version 1.9.1**: Refactored hole module with full viewport logo mask, theme-aware inversion, and improved parallax scrolling
- **Version 1.9.0**: Added interactive HTML viewer with circular viewport
- **July 2025**: Complete dependency modernization
- Updated to Node.js v22.17.1+ support
- Migrated from Node Sass to Dart Sass
- Updated Gulp, Babel, PostCSS, and related tooling
- Enhanced build system with modern optimizations

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or suggestions.

## License

[MIT](LICENSE)

---

> _This project is maintained by [xbonell](https://xbonell.com)._

# xbonell.com vcard

A permanently temporal business vcard site for [xbonell.com](http://xbonell.com).

## Overview

This project is the source code for the personal vCard website of xbonell.com. It serves as a digital business card, providing a concise and elegant way to share professional information, contact details, and links.

For version history and notable changes, see [CHANGELOG.md](CHANGELOG.md).

**Current Version**: 1.10.8

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

## Changelog

All release notes and notable changes are maintained in [CHANGELOG.md](CHANGELOG.md).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or suggestions.

## License

[MIT](LICENSE)

---

> _This project is maintained by [xbonell](https://xbonell.com)._

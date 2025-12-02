# xbonell.com vcard

A permanently temporal business vcard site for [xbonell.com](http://xbonell.com).

## Overview

This project is the source code for the personal vCard website of xbonell.com. It serves as a digital business card, providing a concise and elegant way to share professional information, contact details, and links.

**Current Version**: 1.9.0

## Features

- **Multi-language Support**: English, Spanish, and Catalan versions
- **Modern Build System**: Gulp + Metalsmith with ES2015+ support
- **Interactive HTML Viewer**: Circular viewport displaying the page's HTML source code with syntax highlighting, interactive positioning, and scroll-based parallax effects
- **Responsive Design**: Optimized for all devices and screen sizes
- **Performance Optimized**: Minified assets, image optimization, and fast loading
- **Self-contained**: No external dependencies required for deployment
- **Easy Deployment**: Static files ready for any hosting provider

## Technology Stack

- **Build System**: Gulp with Babel
- **Static Site Generator**: Metalsmith
- **Templating**: Handlebars
- **Styling**: SCSS/Sass with PostCSS
- **JavaScript**: ES2015+ with Browserify
- **Package Manager**: Yarn
- **Node.js**: v22.17.1+ supported

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 22.17.1+ recommended)
- [Yarn](https://yarnpkg.com/) (for dependency management)

### Installation

Clone the repository:

```bash
git clone https://github.com/xbonell/xbonell-vcard.git
cd xbonell-vcard
```

Install dependencies:

```bash
yarn install
```

### Development

To start a local development server with live reload:

```bash
yarn start
# or
yarn dev
```

### Building

To build the site for production:

```bash
yarn build
```

### Image Optimization

To optimize images:

```bash
yarn images
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
- **JavaScript bundling** with Browserify and Babel
- **HTML generation** with Metalsmith and Handlebars
- **Image optimization** pipeline
- **SVG sprite generation**
- **Live reload** during development

## Recent Updates

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

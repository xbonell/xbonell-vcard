# AGENTS.md - Project Context for AI Agents

This document provides essential project context for AI agents working on the xbonell-vcard project.

---

## Project Overview

### Overview
A permanently temporal business vcard site for xbonell.com - a personal portfolio/vcard website for Xavier Bonell, Front-End Web Developer.

### Project Details
- **Project Name**: xbonell-vcard
- **Version**: 1.10.0
- **Type**: Personal vCard Website
- **Author**: Xavier Bonell Iturbe
- **Domain**: xbonell.com
- **Repository**: https://github.com/xbonell/xbonell-vcard.git

### Technology Stack
- **Build System**: Gulp with Babel
- **Static Site Generator**: Metalsmith
- **Templating**: Handlebars
- **Styling**: SCSS/Sass
- **JavaScript**: ES2015+ with esbuild (native ES2020 output)
- **Icons**: SVG with svgxuse
- **Package Manager**: pnpm

### Multi-language Support
The site supports multiple languages:
- English (en)
- Spanish (es) 
- Catalan (ca)

### Build Process
- Development: `pnpm start` (gulp default)
- Production: `pnpm build` (gulp build --production)
- Uses autoprefixer, cssnano, and other optimizations
- Browser-sync for development server
- Image optimization pipeline

### Current State
- Project is fully modernized as of July 2025
- All critical, significant, and standard dependencies updated (Node.js v22.17.1+)
- Gulp-based build system upgraded and validated
- Multi-language content structure in place
- SCSS modular architecture implemented
- Content reflects current professional focus: Front-end development specializing in React, Vue.js, and WordPress
- Services and toolkit sections showcase modern development stack (React/Next.js, Vue.js/Nuxt.js, Vite/Webpack, Jest/Vitest, Docker, Netlify/Vercel)
- Project is stable, maintainable, and ready for new enhancements or migration planning
- VAN review completed confirming excellent project health
- Repository status review completed (January 2025)
- Build performance excellent (541ms build time with esbuild)

### Recent Modernization
- Completed comprehensive dependency and build system update (July 2025)
- Node.js v22.17.1+ supported (previously v16.0.0)
- Migrated from Node Sass to Dart Sass
- Updated Gulp, Babel, PostCSS, and related tooling
- Validated build and development workflows on modern stack
- Build performance excellent (541ms build time with esbuild)
- Project version updated to 1.9.0
- Content updated to reflect current professional focus on React, Vue.js, and modern development tools
- Services and toolkit sections modernized with current technology stack
- Repository status review completed (January 2025)

### Version 1.9.1 Updates
- Refactored hole module: replaced SVG clipPath with CSS clip-path path() for better control
- Updated logo mask from fixed bottom-right corner to full viewport coverage
- Added theme-aware mask inversion (inverted in light mode, normal in dark mode)
- Implemented shadow element with theme-aware rendering and MutationObserver for dynamic theme updates
- Improved parallax scrolling by re-rendering canvas content instead of transforming canvas element
- Updated styling: replaced underline with background highlight for em tags
- Added CSS variables for shadow colors and improved z-index layering

### Version 1.9.3 Updates
- iOS Safari compatibility fixes for hole module and layout
- Added dynamic viewport height (dvh) for better mobile browser support
- Added GPU layer acceleration to prevent element repositioning during scroll
- Debounced window resize handling to filter iOS browser chrome changes
- Centralized browserslist configuration (removed duplicate targets from Babel/Gulp)
- Refactored hashAssets gulp task with proper async/await two-pass approach
- Updated Yarn from v4.9.2 to v4.12.0
- Added @babel/plugin-bugfix-firefox-class-in-computed-class-key dependency

### Version 1.9.4 Updates
- Fixed asset URL rewriting in hashAssets gulp task
- Replaced gulp-rev-rewrite with custom fs-based approach due to Gulp 5 incompatibility
- Asset references in both HTML and JS files are now correctly rewritten with hashed paths
- Removed gulp-rev-rewrite dependency from package.json

### Version 1.9.5 Updates
- Adjusted light mode theme background colors for improved visual hierarchy
- `--color-backstage` now uses the previous `--color-bg` value (`#e9e7e3`)
- `--color-bg` is now 10% lighter (`#ebe9e6`) using Sass `color.scale()` function
- Provides better contrast between the main background and backstage (hole) background in light mode

### Version 1.9.6 Updates (December 2025)
- Updated SEO metadata across all language versions (English, Spanish, Catalan)
- Description now highlights React, Vue.js, and WordPress specialization
- Keywords modernized to reflect current technology stack and professional focus
- Removed outdated terms (freelance, web designer) in favor of current role description

### Version 1.9.7 Updates (December 2025)
- Modernized JavaScript build pipeline by replacing Browserify/Babel/Uglify with esbuild
- Build time improved ~50% (541ms vs 1.08s), JS bundling ~78% faster (210ms vs 979ms)
- Removed 11 dependencies: browserify, babelify, envify, vinyl-source-stream, vinyl-buffer, gulp-uglify, gulp-terser, gulp-jslint, gulp-sourcemaps, gulp-if, core-js
- Added esbuild for modern, fast JavaScript bundling with native ES2020 output
- Simplified gulpfile with cleaner esbuild API integration
- No more heavy Babel transpilation needed for modern browsers

### Version 1.9.8 Updates (January 2025)
- Enabled HTTPS for local development server (browser-sync now uses HTTPS)
- Updated domain configuration to use HTTPS for localhost development
- Added sitemap.xml with multi-language hreflang support for improved SEO
- Sitemap includes all language versions (ca/, en/, es/) with proper alternate language links

### Version 1.9.9 Updates (January 2025)
- Added Sitemap directive to robots.txt pointing to https://xbonell.com/sitemap.xml
- Improves SEO discoverability by informing search engines about the sitemap location

### Version 1.10.0 Updates (January 2026)
- Migrated package manager from Yarn 4.12.0 to pnpm 10.27.0
- Updated CI/CD pipeline (`.github/workflows/deploy.yml`) to use pnpm with Corepack
- Removed Yarn configuration files (`.yarnrc.yml`, `.yarn/` directory, `yarn.lock`)
- Added `pnpm-lock.yaml` lockfile
- Fixed SCSS `rgba()` function calls in `_error.scss` for Dart Sass compatibility (use SCSS variables instead of CSS custom properties)
- Added `$color-black` SCSS variable to `_variables.scss`
- Updated documentation (`README.md`, `AGENTS.md`) with pnpm commands

---

## Product Context

### Product Vision
A professional, modern vCard website that serves as Xavier Bonell's digital business card and portfolio presence. The site embodies the concept of being "permanently temporal" - a lasting digital presence that can evolve over time.

### Target Audience
- **Primary**: Potential clients, employers, and professional contacts
- **Secondary**: Peers in the web development community
- **Geographic**: International audience (multi-language support)

### Core Value Proposition
- Clean, professional presentation of Xavier Bonell's professional identity
- Multi-language accessibility (English, Spanish, Catalan)
- Fast, optimized performance for excellent user experience
- Modern web standards and responsive design

### Key Features
- **Professional Profile**: Name, title, contact information
- **Multi-language Support**: Content available in 3 languages (English, Spanish, Catalan)
- **Theme System**: Dark/light/system theme switching with localStorage persistence and system preference detection
- **Services Showcase**: Front-end development, responsive web applications, performance optimization, accessibility implementation, WordPress development, web design & development, email template development
- **Toolkit Display**: Modern development stack including React/Next.js, Vue.js/Nuxt.js, Vite/Webpack, Node.js, testing frameworks (Jest/Vitest), and deployment tools (Netlify/Vercel, Docker)
- **Interactive HTML Viewer**: Full viewport logo mask ("hole") displaying the page's HTML source code with syntax highlighting, theme-aware mask inversion, and scroll-based parallax effects
- **Responsive Design**: Works across all device types
- **Performance Optimized**: Fast loading times with requestIdleCallback for non-critical operations
- **SEO Friendly**: Proper meta tags and structure
- **Accessibility**: WCAG compliant design patterns

### Content Strategy
- **Minimalist Approach**: Focus on essential professional information
- **Visual Hierarchy**: Clear information architecture
- **Contact-Focused**: Easy ways to get in touch
- **Professional Branding**: Consistent with Xavier's professional image

### User Experience Goals
- **Speed**: Sub-2 second load times
- **Clarity**: Information is immediately accessible
- **Accessibility**: Works for users with disabilities
- **Cross-platform**: Consistent experience across devices
- **Professional**: Conveys competence and attention to detail

### Success Metrics
- Page load performance
- Contact form submissions/interactions
- Multi-language usage patterns
- Mobile vs desktop usage
- Professional inquiries generated

### Brand Characteristics
- **Professional**: Clean, modern, trustworthy
- **Technical**: Showcases web development expertise
- **International**: Multi-cultural accessibility
- **Efficient**: No unnecessary complexity
- **Personal**: Authentic representation of Xavier

---

## Technical Context

### Build System Architecture
- **Primary Build Tool**: Gulp 5.0 with Babel transpilation
- **Task Runner**: Gulp with ES6+ syntax support via babel-register
- **Module Bundler**: esbuild for fast JavaScript bundling (native ES2020)
- **Development Server**: Browser-sync with live reloading

### Frontend Technology Stack
- **Templating Engine**: Handlebars via handlebars
- **CSS Preprocessor**: Sass/SCSS with gulp-sass
- **CSS Post-processing**: 
  - Autoprefixer for vendor prefixes
  - cssnano for minification
  - postcss-combine-media-query for optimization
- **JavaScript**: ES2015+ bundled with esbuild (native ES2020 output, no heavy transpilation)
- **JavaScript Modules**: 
  - Theme management (themeManager) with dark/light/system mode support
  - Theme switcher UI component
  - Internationalization (i18n) support
  - Interactive HTML viewer (hole) with syntax highlighting, theme-aware mask inversion, and parallax effects
- **SVG Management**: SVG sprite system via gulp-svgstore

### Static Site Generation
- **Generator**: Metalsmith
- **Content Processing**: 
  - metalsmith-markdown for Markdown processing
  - metalsmith-layouts for template rendering
  - metalsmith-permalinks for URL structure
- **Multi-language Support**: Directory-based (ca/, en/, es/)

### Development Dependencies
- **Code Quality**: ESLint + Prettier configuration
- **Image Optimization**: gulp-image for asset optimization
- **SVG Processing**: gulp-svgmin + gulp-svgstore
- **File Management**: rimraf for cleanup, yargs for CLI args

### Runtime Dependencies
- **Core Libraries**: None (vanilla JavaScript ES6+ modules)
- **Theme System**: Built-in theme management with localStorage persistence
- **Internationalization**: Built-in i18n module for multi-language support

### Browser Support
- Last 2 versions of major browsers
- \> 5% market share (via browserslist)

### File Structure Patterns
- Source files in `src/` directory
- Build output to `dist/` directory
- Templates in `src/layouts/` (Handlebars templates)
- Styles in `src/scss/` with modular architecture
- Content in `src/content/` with language subdirectories (ca/, en/, es/)
- Static assets in `src/_static/`
- JavaScript modules in `src/scripts/` with ES6+ module pattern
- SVG icons in `src/svg/` for sprite generation

---

## System Patterns

### Architecture Patterns

#### Static Site Generation Pattern
- **Pattern**: JAMstack architecture with build-time generation
- **Implementation**: Metalsmith for content processing
- **Benefits**: Fast delivery, security, scalability
- **Content Flow**: Markdown → Metalsmith → Handlebars → HTML

#### Multi-language Architecture
- **Pattern**: Directory-based internationalization
- **Structure**: 
  ```
  src/content/
  ├── ca/     # Catalan content
  ├── en/     # English content
  ├── es/     # Spanish content
  └── 404.md  # Fallback content
  ```
- **Benefits**: Simple content management, clear separation

#### Build Pipeline Pattern
- **Pattern**: Task-based build automation
- **Implementation**: Gulp task orchestration
- **Stages**:
  1. Content processing (Metalsmith)
  2. Template rendering (Handlebars)
  3. Style compilation (SCSS)
  4. JavaScript bundling (esbuild)
  5. Asset optimization
  6. Development server (Browser-sync)

### Code Organization Patterns

#### Modular SCSS Architecture
- **Pattern**: Component-based styling
- **Structure**:
  ```
  src/scss/
  ├── modules/    # Reusable components
  ├── utils/      # Utilities and mixins
  └── style.scss  # Main entry point
  ```

#### JavaScript Module Pattern
- **Pattern**: ES6+ modules with esbuild bundling
- **Architecture**: Modular structure with separate modules for theme management, theme switcher UI, and internationalization
- **Performance**: Uses requestIdleCallback for non-critical UI initialization
- **Benefits**: Code organization, dependency management, performance optimization
- **Output**: Native ES2020 (no heavy transpilation needed for modern browsers)

#### Template Inheritance Pattern
- **Pattern**: Handlebars template layouts
- **Implementation**: metalsmith-layouts
- **Benefits**: DRY principle, consistent structure

### Development Patterns

#### Live Development Pattern
- **Pattern**: Hot reloading development server
- **Implementation**: Browser-sync
- **Features**: Auto-refresh, cross-device sync

#### Asset Optimization Pattern
- **Pattern**: Build-time optimization
- **CSS**: Autoprefixer + cssnano + media query combining
- **Images**: gulp-image optimization
- **SVG**: Minification and sprite generation
- **JavaScript**: esbuild minification for production (with console/debugger stripping)

#### Environment-based Configuration
- **Pattern**: Development vs Production builds
- **Implementation**: Yargs CLI arguments
- **Differences**: 
  - Development: Source maps, unminified, local domain
  - Production: Minified, optimized, production domain

### Performance Patterns

#### Critical Resource Optimization
- **CSS**: Inline critical styles, async non-critical
- **JavaScript**: Defer non-critical scripts
- **Images**: Optimization and proper sizing
- **SVG**: Sprite system for icon reuse

#### Caching Strategy
- **Static Assets**: Long-term caching with versioning
- **HTML**: Short-term caching for content updates
- **CDN Ready**: Absolute paths for production

### Quality Patterns

#### Code Quality
- **Linting**: ESLint + JSLint for JavaScript
- **Formatting**: Prettier for consistent code style
- **Build Validation**: Fail fast on errors

#### Browser Compatibility
- **Autoprefixer**: Automatic vendor prefixes
- **Browserslist**: Target specific browser versions
- **Progressive Enhancement**: Core functionality first

### Deployment Patterns

#### Build Artifact Pattern
- **Pattern**: Separate source and distribution
- **Source**: `src/` directory
- **Output**: `dist/` directory
- **Benefits**: Clean deployment, version control separation

#### Multi-environment Support
- **Development**: Local server with live reload
- **Production**: Optimized static files
- **Configuration**: Environment-specific settings

---


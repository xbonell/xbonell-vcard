# AGENTS.md - Project Context for AI Agents

This document provides essential project context for AI agents working on the xbonell-vcard project.

---

## Project Overview

### Overview
A permanently temporal business vcard site for xbonell.com - a personal portfolio/vcard website for Xavier Bonell, Front-End Web Developer.

### Project Details
- **Project Name**: xbonell-vcard
- **Version**: 1.8.16
- **Type**: Personal vCard Website
- **Author**: Xavier Bonell Iturbe
- **Domain**: xbonell.com
- **Repository**: https://github.com/xbonell/xbonell-vcard.git

### Technology Stack
- **Build System**: Gulp with Babel
- **Static Site Generator**: Metalsmith
- **Templating**: Handlebars
- **Styling**: SCSS/Sass
- **JavaScript**: ES2015+ with Browserify
- **Icons**: SVG with svgxuse
- **Package Manager**: Yarn v4.9.2

### Multi-language Support
The site supports multiple languages:
- English (en)
- Spanish (es) 
- Catalan (ca)

### Build Process
- Development: `yarn start` (gulp default)
- Production: `yarn build` (gulp build --production)
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
- Build performance excellent (1.04s build time)

### Recent Modernization
- Completed comprehensive dependency and build system update (July 2025)
- Node.js v22.17.1+ supported (previously v16.0.0)
- Migrated from Node Sass to Dart Sass
- Updated Gulp, Babel, PostCSS, and related tooling
- Validated build and development workflows on modern stack
- Build performance excellent (1.04s build time)
- Project version updated to 1.8.16
- Content updated to reflect current professional focus on React, Vue.js, and modern development tools
- Services and toolkit sections modernized with current technology stack
- Repository status review completed (January 2025)

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
- **Primary Build Tool**: Gulp 4.0.2 with Babel transpilation
- **Task Runner**: Gulp with ES6+ syntax support via babel-register
- **Module Bundler**: Browserify for JavaScript bundling
- **Development Server**: Browser-sync with live reloading

### Frontend Technology Stack
- **Templating Engine**: Handlebars via handlebars
- **CSS Preprocessor**: Sass/SCSS with gulp-sass
- **CSS Post-processing**: 
  - Autoprefixer for vendor prefixes
  - cssnano for minification
  - postcss-combine-media-query for optimization
- **JavaScript**: ES2015+ with Babel transpilation
- **JavaScript Modules**: 
  - Theme management (themeManager) with dark/light/system mode support
  - Theme switcher UI component
  - Internationalization (i18n) support
- **SVG Management**: SVG sprite system via gulp-svgstore

### Static Site Generation
- **Generator**: Metalsmith
- **Content Processing**: 
  - metalsmith-markdown for Markdown processing
  - metalsmith-layouts for template rendering
  - metalsmith-permalinks for URL structure
- **Multi-language Support**: Directory-based (ca/, en/, es/)

### Development Dependencies
- **Linting**: gulp-jslint for JavaScript linting
- **Code Quality**: ESLint + Prettier configuration
- **Image Optimization**: gulp-image for asset optimization
- **SVG Processing**: gulp-svgmin + gulp-svgstore
- **Source Maps**: gulp-sourcemaps for debugging
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
  4. JavaScript bundling (Browserify)
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
- **Pattern**: ES6+ modules with Browserify bundling
- **Architecture**: Modular structure with separate modules for theme management, theme switcher UI, and internationalization
- **Performance**: Uses requestIdleCallback for non-critical UI initialization
- **Benefits**: Code organization, dependency management, performance optimization
- **Transpilation**: Babel for ES2015+ support

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
- **JavaScript**: Uglification for production

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


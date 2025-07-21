# Technical Context: xbonell-vcard

## Build System Architecture
- **Primary Build Tool**: Gulp 4.0.2 with Babel transpilation
- **Task Runner**: Gulp with ES6+ syntax support via babel-register
- **Module Bundler**: Browserify for JavaScript bundling
- **Development Server**: Browser-sync with live reloading

## Frontend Technology Stack
- **Templating Engine**: HAML via hamljs
- **CSS Preprocessor**: Sass/SCSS with gulp-sass
- **CSS Post-processing**: 
  - Autoprefixer for vendor prefixes
  - cssnano for minification
  - postcss-combine-media-query for optimization
- **JavaScript**: ES2015+ with Babel transpilation
- **Animation Library**: GSAP (GreenSock Animation Platform)
- **SVG Management**: svgxuse for SVG sprite support

## Static Site Generation
- **Generator**: Metalsmith
- **Content Processing**: 
  - metalsmith-markdown for Markdown processing
  - metalsmith-layouts for template rendering
  - metalsmith-permalinks for URL structure
- **Multi-language Support**: Directory-based (ca/, en/, es/)

## Development Dependencies
- **Linting**: gulp-jslint for JavaScript linting
- **Code Quality**: ESLint + Prettier configuration
- **Image Optimization**: gulp-image for asset optimization
- **SVG Processing**: gulp-svgmin + gulp-svgstore
- **Source Maps**: gulp-sourcemaps for debugging
- **File Management**: rimraf for cleanup, yargs for CLI args

## Runtime Dependencies
- **Core Libraries**:
  - GSAP v3.6.1 for animations
  - svgxuse v1.2.6 for SVG polyfill
  - global v4.4.0 for global scope management

## Browser Support
- Last 2 versions of major browsers
- \> 5% market share (via browserslist)

## File Structure Patterns
- Source files in `src/` directory
- Build output to `dist/` directory
- Templates in `src/_templates/`
- Styles in `src/scss/` with modular architecture
- Content in `src/content/` with language subdirectories
- Static assets in `src/_static/`

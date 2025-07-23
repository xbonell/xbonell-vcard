# System Patterns: xbonell-vcard

## Architecture Patterns

### Static Site Generation Pattern
- **Pattern**: JAMstack architecture with build-time generation
- **Implementation**: Metalsmith for content processing
- **Benefits**: Fast delivery, security, scalability
- **Content Flow**: Markdown → Metalsmith → Handlebars → HTML

### Multi-language Architecture
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

### Build Pipeline Pattern
- **Pattern**: Task-based build automation
- **Implementation**: Gulp task orchestration
- **Stages**:
  1. Content processing (Metalsmith)
  2. Template rendering (Handlebars)
  3. Style compilation (SCSS)
  4. JavaScript bundling (Browserify)
  5. Asset optimization
  6. Development server (Browser-sync)

## Code Organization Patterns

### Modular SCSS Architecture
- **Pattern**: Component-based styling
- **Structure**:
  ```
  src/scss/
  ├── modules/    # Reusable components
  ├── utils/      # Utilities and mixins
  └── style.scss  # Main entry point
  ```

### JavaScript Module Pattern
- **Pattern**: ES6+ modules with Browserify bundling
- **Benefits**: Code organization, dependency management
- **Transpilation**: Babel for ES2015+ support

### Template Inheritance Pattern
- **Pattern**: Handlebars template layouts
- **Implementation**: metalsmith-layouts
- **Benefits**: DRY principle, consistent structure

## Development Patterns

### Live Development Pattern
- **Pattern**: Hot reloading development server
- **Implementation**: Browser-sync
- **Features**: Auto-refresh, cross-device sync

### Asset Optimization Pattern
- **Pattern**: Build-time optimization
- **CSS**: Autoprefixer + cssnano + media query combining
- **Images**: gulp-image optimization
- **SVG**: Minification and sprite generation
- **JavaScript**: Uglification for production

### Environment-based Configuration
- **Pattern**: Development vs Production builds
- **Implementation**: Yargs CLI arguments
- **Differences**: 
  - Development: Source maps, unminified, local domain
  - Production: Minified, optimized, production domain

## Performance Patterns

### Critical Resource Optimization
- **CSS**: Inline critical styles, async non-critical
- **JavaScript**: Defer non-critical scripts
- **Images**: Optimization and proper sizing
- **SVG**: Sprite system for icon reuse

### Caching Strategy
- **Static Assets**: Long-term caching with versioning
- **HTML**: Short-term caching for content updates
- **CDN Ready**: Absolute paths for production

## Quality Patterns

### Code Quality
- **Linting**: ESLint + JSLint for JavaScript
- **Formatting**: Prettier for consistent code style
- **Build Validation**: Fail fast on errors

### Browser Compatibility
- **Autoprefixer**: Automatic vendor prefixes
- **Browserslist**: Target specific browser versions
- **Progressive Enhancement**: Core functionality first

## Deployment Patterns

### Build Artifact Pattern
- **Pattern**: Separate source and distribution
- **Source**: `src/` directory
- **Output**: `dist/` directory
- **Benefits**: Clean deployment, version control separation

### Multi-environment Support
- **Development**: Local server with live reload
- **Production**: Optimized static files
- **Configuration**: Environment-specific settings

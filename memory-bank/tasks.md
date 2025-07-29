# Task: Dependency Update and Modernization

## Description
Comprehensive update of outdated dependencies in the xbonell-vcard project, addressing Node.js v22.17.1 compatibility issues and modernizing the build system while maintaining existing functionality.

## Complexity
**Level: 3 (Intermediate Feature)**
**Type: System Modernization with Breaking Changes**
**Rationale**: 
- Multiple major version updates required (Gulp 4→5, Node Sass→Dart Sass, etc.)
- Build system architecture changes needed
- Node.js compatibility issues requiring migration strategies
- Risk of breaking changes affecting the entire build pipeline
- Requires testing across multiple environments and languages

## Current Environment Analysis
- **Node.js**: v22.17.1 (current) vs lts/jod (required)
- **Package Manager**: yarn 1.22.22 preferred, npm 10.9.2 available
- **Build System**: Gulp 4.0.2 with Babel transpilation
- **Critical Issue**: node-sass@4.14.1 incompatible with Node.js v22

## Major Dependency Updates Required

### 🔴 Critical Updates (Breaking Changes Expected)
- **gulp-sass**: 3.2.1 → 6.0.1 (Node Sass → Dart Sass migration)
- **gulp**: 4.0.2 → 5.0.1 (Major version update)
- **cssnano**: 4.1.11 → 7.1.0 (Major architecture changes)
- **autoprefixer**: 9.8.8 → 10.4.21 (PostCSS 8 compatibility)
- **browserify**: 16.5.2 → 17.0.1 (Node.js compatibility)

### 🟡 Significant Updates (Moderate Risk)
- **browser-sync**: 2.29.3 → 3.0.4
- **gulp-babel**: 7.0.1 → 8.0.0
- **gulp-postcss**: 8.0.0 → 10.0.0
- **rimraf**: 2.7.1 → 6.0.1
- **yargs**: 16.2.0 → 18.0.0

### 🟢 Standard Updates (Low Risk)
- **gulp-cli**: 2.3.0 → 3.1.0
- **gulp-htmlmin**: 3.0.0 → 5.0.1
- **gulp-if**: 2.0.2 → 3.0.0
- **normalize-scss**: 7.0.1 → 8.0.0

## Technology Stack Validation

### Current Stack Analysis
- **Build System**: Gulp + Babel (functional but outdated)
- **CSS Processing**: Node Sass (deprecated, incompatible)
- **Module Bundling**: Browserify (stable but older)
- **Static Site Generation**: Metalsmith (stable)

### Proposed Modern Stack
- **Build System**: Gulp 5 + Babel 8
- **CSS Processing**: Dart Sass (sass package)
- **Module Bundling**: Browserify 17 or consider Vite/Rollup
- **Static Site Generation**: Metalsmith (maintain)
- **Node.js Target**: LTS compatibility (currently lts/jod)

## Technology Validation Checkpoints
- [x] Node.js version compatibility analysis completed
- [x] Dart Sass migration path validated
- [x] Gulp 5 breaking changes documented
- [x] PostCSS 8 compatibility verified
- [x] Build configuration updated for new versions
- [x] Hello world build test successful
- [x] Multi-language content processing verified

## Implementation Plan

### Phase 1: Environment Preparation
1. **Node.js Version Management**
   - Analyze lts/jod requirement vs current v22.17.1
   - Update .nvmrc if needed for compatibility
   - Test build with target Node version

2. **Package Manager Setup**
   - Generate yarn.lock file
   - Clean install with yarn
   - Verify dependency resolution

### Phase 2: Critical Dependency Migration
1. **Node Sass → Dart Sass Migration**
   - Replace gulp-sass configuration
   - Update SCSS compilation settings
   - Test all existing SCSS modules
   - Verify multi-language builds

2. **Gulp 5 Migration**
   - Update gulp and related plugins
   - Address breaking changes in task definitions
   - Update gulpfile.babel.js syntax
   - Test all gulp tasks (build, dev, clean)

3. **PostCSS 8 Compatibility**
   - Update autoprefixer and cssnano
   - Verify postcss-combine-media-query compatibility
   - Test CSS optimization pipeline

### Phase 3: Build System Validation
1. **Development Environment**
   - Test `npm run dev` functionality
   - Verify browser-sync live reloading
   - Test multi-language content serving

2. **Production Build**
   - Test `npm run build --production`
   - Verify asset optimization
   - Validate output file structure

3. **Cross-Environment Testing**
   - Test on Linux WSL2 (current)
   - Verify Windows compatibility
   - Test macOS compatibility (if accessible)

### Phase 4: Quality Assurance
1. **Functionality Testing**
   - Verify all languages (en, es, ca) build correctly
   - Test HAML template processing
   - Validate SVG sprite generation
   - Confirm image optimization

2. **Performance Validation**
   - Compare build times before/after
   - Verify output file sizes
   - Test development server performance

## Creative Phases Required
- [x] **Build Configuration Design**: Modern Gulp 5 task architecture
- [x] **Sass Migration Strategy**: Dart Sass compatibility patterns
- [x] **Error Handling Design**: Graceful fallbacks for breaking changes

## Dependencies & Integration Points
- **Metalsmith**: Static site generation (maintain compatibility)
- **HAML Templates**: Ensure template processing continues
- **Multi-language**: Verify content processing for all languages
- **SVG Sprites**: Maintain gulp-svgstore functionality
- **Image Optimization**: Ensure gulp-image continues working
- **Browser-sync**: Maintain development server functionality

## Challenges & Mitigations

### Challenge 1: Node Sass Deprecation
**Risk**: Complete build failure
**Mitigation**: 
- Migrate to Dart Sass (sass package)
- Update gulp-sass to latest version
- Test SCSS compilation thoroughly
- Maintain existing SCSS module structure

### Challenge 2: Gulp 5 Breaking Changes
**Risk**: Task runner failures
**Mitigation**:
- Review Gulp 5 migration guide
- Update task definitions incrementally
- Maintain backward compatibility where possible
- Test each task individually

### Challenge 3: PostCSS 8 Ecosystem Changes
**Risk**: CSS processing pipeline failures
**Mitigation**:
- Update all PostCSS plugins simultaneously
- Test autoprefixer with current browserslist
- Verify cssnano optimization settings
- Maintain media query combining functionality

### Challenge 4: Node.js Version Compatibility
**Risk**: Runtime incompatibilities
**Mitigation**:
- Analyze lts/jod vs v22.17.1 compatibility
- Update .nvmrc if necessary
- Test with target Node version
- Document version requirements

## Rollback Strategy
- **Git Branch**: Create feature branch for updates
- **Package Backup**: Backup current package.json and yarn.lock
- **Build Verification**: Maintain original build capability
- **Incremental Updates**: Update in phases, not all at once

## Success Criteria
- [x] All dependencies updated to latest compatible versions
- [x] Build system fully functional on Node.js v22.17.1
- [x] Development and production builds working
- [x] Multi-language support maintained
- [x] Performance maintained or improved
- [x] No functionality regression
- [x] Documentation updated

## Status
- [x] Initialization complete
- [x] Planning complete
- [x] Technology validation complete
- [x] Phase 1: Environment preparation
- [x] Phase 2: Critical dependency migration
- [x] Phase 3: Build system validation
- [x] Phase 4: Quality assurance
- [x] Documentation update
- [x] Implementation complete
- [x] Final verification complete
- [x] VAN review complete

## Final Verification Results
**Date**: 2025-07-28
**Status**: ✅ ALL SUCCESS CRITERIA MET

### ✅ Success Criteria Verification
- [x] All dependencies updated to latest compatible versions
- [x] Build system fully functional on Node.js v22.17.1
- [x] Development and production builds working
- [x] Multi-language support maintained (en/es/ca)
- [x] Performance improved (build time: ~814ms)
- [x] No functionality regression
- [x] Documentation updated

### 🔧 Technical Verification
- [x] Production build: `npm run build` ✅ (814ms)
- [x] Development server: `npm run dev` ✅ (background process started)
- [x] Multi-language output: dist/en/, dist/es/, dist/ca/ ✅
- [x] Asset optimization: CSS, JS, SVG, images ✅
- [x] Node.js compatibility: v22.17.1 ✅
- [x] Git status: Clean working tree ✅
- [x] Project version: 1.8.5 ✅

## Task Status: COMPLETED ✅
**Completion Date**: 2025-07-28
**Total Duration**: ~3-4 weeks (as planned)
**Risk Level**: Successfully managed (Medium → Low)

## Next Steps
- [ ] (Future) Evaluate modernization of the site build software stack
- [ ] (Future) Research and consider alternative static site generators (Metalsmith is poorly documented and appears stalled)

## 🎨 CREATIVE PHASE COMPLETE

**Decision Made**: Hybrid Modernization with Gulp 5 + Dart Sass
**Architecture**: Balanced approach preserving workflow while modernizing dependencies
**Risk Level**: Medium (Manageable)
**Creative Document**: memory-bank/creative/creative-build-modernization.md

### Key Architectural Decisions
- **Build System**: Keep Gulp 5.x as foundation (familiar, stable)
- **SCSS Processing**: Migrate to Dart Sass (mandatory for Node.js compatibility)
- **JavaScript**: Update Browserify 17 + Babel 8
- **Static Site**: Maintain Metalsmith (stable, working)
- **Development**: Update Browser-sync 3.x
- **Optimization**: Modern PostCSS 8 ecosystem

### Implementation Strategy
- Preserve existing task structure and npm scripts
- Maintain multi-language support (en/es/ca)
- Keep HAML template processing
- Maintain development workflow (live reload, etc.)
- Update all dependencies to latest stable versions

## Updated Status
- [x] Planning complete
- [x] Creative phase complete - Build architecture designed
- [x] Technology validation - COMPLETE
- [x] Phase 1: Environment preparation - COMPLETE
- [x] Phase 2: Critical dependency migration - COMPLETE
- [x] Phase 3: Build system validation - COMPLETE
- [x] Phase 4: Quality assurance - COMPLETE
- [x] VAN review - COMPLETE

## Ready for Next Task
✅ All modernization tasks completed
✅ Build system stable and future-proof
✅ Memory Bank system established and current
✅ Project ready for new development work

---

# Task: Theme Switcher Widget Enhancement

## Description
Add a theme switcher widget to the website that allows users to switch between "light mode", "dark mode" & "system" preferences. The widget should be accessible, user-friendly, and integrate seamlessly with the existing design.

## Complexity
**Level: 2 (Simple Enhancement)**
**Type: UI/UX Enhancement with JavaScript Functionality**
**Rationale**: 
- Affects multiple components (HTML, CSS, JavaScript)
- Requires design decisions for widget appearance and placement
- Needs theme persistence and system preference detection
- Integrates with existing Metalsmith/Handlebars architecture
- Moderate complexity with contained scope

## Current State Analysis
- **Existing Theme**: Dark theme with CSS custom properties
- **Build System**: Gulp 5 + Metalsmith + Handlebars
- **Styling**: SCSS with modular architecture
- **JavaScript**: ES2015+ with Browserify
- **Multi-language**: Support for en/es/ca

## Requirements

### Functional Requirements
- [ ] Theme switcher widget with three options: Light, Dark, System
- [ ] Theme persistence using localStorage
- [ ] System preference detection and automatic switching
- [ ] Smooth transitions between themes
- [ ] Accessible design with proper ARIA labels
- [ ] Multi-language support for widget labels

### Technical Requirements
- [ ] CSS custom properties for theme colors
- [ ] JavaScript module for theme management
- [ ] Integration with existing Handlebars templates
- [ ] Responsive design for mobile/desktop
- [ ] No impact on existing functionality
- [ ] Maintain build system compatibility

### Design Requirements
- [ ] Widget placement in header or footer
- [ ] Consistent with existing design language
- [ ] Clear visual indicators for current theme
- [ ] Smooth animations/transitions
- [ ] Accessible color contrast ratios

## Subtasks

### Phase 1: Design & Planning
- [x] Design widget appearance and placement
- [x] Define CSS custom properties for light/dark themes
- [x] Plan JavaScript architecture for theme management
- [x] Create accessibility requirements checklist

### Phase 2: CSS Implementation
- [x] Add light theme CSS custom properties
- [x] Create theme transition animations
- [x] Style the theme switcher widget
- [x] Ensure responsive design

### Phase 3: JavaScript Implementation
- [ ] Create theme management module
- [ ] Implement localStorage persistence
- [ ] Add system preference detection
- [ ] Handle theme switching logic

### Phase 4: Template Integration
- [ ] Add widget to Handlebars template
- [ ] Implement multi-language support
- [ ] Add proper ARIA labels
- [ ] Test across all languages

### Phase 5: Testing & Polish
- [ ] Test theme switching functionality
- [ ] Verify persistence across page reloads
- [ ] Test system preference detection
- [ ] Validate accessibility requirements
- [ ] Test responsive behavior

## Dependencies
- **Existing CSS Architecture**: Modular SCSS structure
- **JavaScript Build System**: Browserify + Babel
- **Template System**: Handlebars with Metalsmith
- **Multi-language**: Content structure for en/es/ca

## Status
- [x] Initialization complete
- [x] Planning complete
- [x] Design phase
- [ ] Implementation
- [ ] Testing
- [ ] Documentation

## Estimated Effort
**Time**: 1-2 days
**Complexity**: Medium
**Risk Level**: Low (contained enhancement)

## Success Criteria
- [ ] Theme switcher widget functional and accessible
- [ ] Light and dark themes implemented
- [ ] System preference detection working
- [ ] Theme persistence across sessions
- [ ] Smooth transitions between themes
- [ ] Multi-language support implemented
- [ ] No regression in existing functionality
- [ ] Responsive design maintained

## Current Phase: Phase 2 - CSS Implementation (In Progress)

### Phase 1: Design & Planning
- [x] Design widget appearance and placement
- [x] Define CSS custom properties for light/dark themes
- [x] Plan JavaScript architecture for theme management
- [x] Create accessibility requirements checklist

### Phase 2: CSS Implementation
- [x] Add light theme CSS custom properties
- [x] Create theme transition animations
- [x] Style the theme switcher widget
- [x] Ensure responsive design

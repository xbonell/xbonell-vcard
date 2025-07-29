# 🎨 CREATIVE PHASE: Theme Switcher Widget Design

**Project**: xbonell-vcard Theme Switcher Enhancement
**Phase**: Design & Planning
**Date**: 2025-07-28
**Complexity**: Level 2 - Simple Enhancement

## PROBLEM STATEMENT

The current website uses a dark theme by default, but users may prefer light themes or want to follow their system preferences. We need to add a theme switcher widget that allows users to choose between light, dark, and system themes while maintaining the existing design language and accessibility standards.

**Core Challenge**: How to implement a theme switcher that integrates seamlessly with the existing design while providing a smooth, accessible user experience?

🎨🎨🎨 ENTERING CREATIVE PHASE: THEME SWITCHER DESIGN 🎨🎨🎨

## DESIGN DECISIONS

### 1. Widget Placement & Layout

**Decision**: Place widget in footer next to language switcher
**Rationale**:
- Consistent with existing footer controls pattern
- Non-intrusive to main content
- Accessible but not prominent
- Follows established design patterns
- Maintains visual hierarchy

**Implementation**:
```html
<footer role="contentinfo">
  <p class="copyright">...</p>
  <ul class="lang">...</ul>
  <div class="theme-switcher">...</div>
</footer>
```

### 2. Widget Design & Interaction

**Widget Type**: Dropdown/Select-style with icons
**Visual Design**:
- **Size**: Similar to language switcher (11px font)
- **Style**: Consistent with footer styling
- **Icons**: Sun (light), Moon (dark), Monitor (system)
- **State**: Shows current theme with visual indicator
- **Animation**: Smooth transitions (0.3s ease-in-out)

**Interaction Pattern**:
1. Click to open dropdown
2. Select theme option
3. Immediate visual feedback
4. Smooth transition to new theme
5. Persist preference in localStorage

### 3. Light Theme Color Palette

**Background Colors**:
- `--color-bg`: `#f8f9fa` (light gray)
- `--color-text`: `#2c3e50` (dark gray)
- `--color-grey`: `#6c757d` (medium gray)

**Accent Colors** (maintained for consistency):
- `--color-red`: `#e44424` (unchanged)
- `--color-yellow`: `#f4c430` (unchanged)
- `--color-alt`: `#a79c8e` (unchanged)

**Social Colors** (maintained):
- `--color-github`: `#111` (unchanged)
- `--color-twitter`: `#00aced` (unchanged)
- `--color-linkedin`: `#007bb6` (unchanged)
- `--color-mastodon`: `#2f93d7` (unchanged)

**Shadow & Effects**:
- `--color-shadow`: `rgba(0, 0, 0, 0.1)` (light shadow)

### 4. JavaScript Architecture

**Module Structure**: `src/scripts/modules/themeManager.js`
**Class Design**:
```javascript
class ThemeManager {
  constructor() {
    this.currentTheme = 'system';
    this.themes = ['light', 'dark', 'system'];
  }
  
  init() { /* Initialize theme system */ }
  setTheme(theme) { /* Apply theme */ }
  getSystemPreference() { /* Detect OS preference */ }
  savePreference(theme) { /* Save to localStorage */ }
  loadPreference() { /* Load from localStorage */ }
}
```

**Integration Points**:
- **Main Entry**: `src/scripts/main.js` imports and initializes
- **Template**: Handlebars template with data binding
- **Event Handling**: Click events for theme switching
- **Persistence**: localStorage with fallback

### 5. Accessibility Design

**ARIA Implementation**:
- `role="button"` for theme switcher
- `aria-label="Theme switcher"` for screen readers
- `aria-expanded="true/false"` for dropdown state
- `aria-pressed="true"` for current theme
- `aria-describedby="theme-description"` for context

**Keyboard Navigation**:
- Tab navigation support
- Enter/Space key activation
- Arrow key navigation for options
- Escape key to close dropdown

**Screen Reader Support**:
- Clear labels: "Light theme", "Dark theme", "System preference"
- Announce current theme on page load
- Announce theme changes when switching
- Provide context about theme options

**Color Contrast**:
- Light theme: Dark text on light background (high contrast)
- Dark theme: Light text on dark background (high contrast)
- Meet WCAG AA standards (4.5:1 ratio minimum)

### 6. Multi-language Support

**Translation Keys**:
- `theme-switcher`: "Theme switcher"
- `theme-light`: "Light theme"
- `theme-dark`: "Dark theme"
- `theme-system`: "System preference"

**Language Files**:
- English: Default labels
- Spanish: "Tema claro", "Tema oscuro", "Preferencia del sistema"
- Catalan: "Tema clar", "Tema fosc", "Preferència del sistema"

### 7. Responsive Design

**Mobile Considerations**:
- Touch-friendly button size (44px minimum)
- Clear visual feedback on touch
- Maintain readability on small screens
- Ensure dropdown doesn't overflow viewport

**Desktop Considerations**:
- Hover states for better UX
- Keyboard navigation support
- Smooth animations and transitions

## TECHNICAL IMPLEMENTATION PLAN

### Phase 1: CSS Custom Properties
1. Add light theme variables to `_variables.scss`
2. Create theme transition animations
3. Ensure all components work in both themes
4. Test color contrast ratios

### Phase 2: JavaScript Module
1. Create `themeManager.js` module
2. Implement theme switching logic
3. Add localStorage persistence
4. Add system preference detection
5. Integrate with main.js

### Phase 3: Template Integration
1. Add widget to Handlebars template
2. Implement multi-language support
3. Add proper ARIA attributes
4. Test across all languages

### Phase 4: Testing & Polish
1. Test theme switching functionality
2. Verify persistence across sessions
3. Test system preference detection
4. Validate accessibility requirements
5. Test responsive behavior

## SUCCESS METRICS

### Functional Requirements
- [ ] Theme switcher widget functional and accessible
- [ ] Light and dark themes implemented
- [ ] System preference detection working
- [ ] Theme persistence across sessions
- [ ] Smooth transitions between themes
- [ ] Multi-language support implemented

### Technical Requirements
- [ ] No regression in existing functionality
- [ ] Responsive design maintained
- [ ] Build system compatibility preserved
- [ ] Performance impact minimal

### Accessibility Requirements
- [ ] WCAG AA compliance achieved
- [ ] Screen reader compatibility
- [ ] Keyboard navigation support
- [ ] Color contrast requirements met

## RISK MITIGATION

### Potential Issues & Solutions

**Issue 1**: Flash of unstyled content (FOUC)
**Solution**: Apply theme immediately in `<head>` before CSS loads

**Issue 2**: localStorage not available
**Solution**: Graceful fallback to system preference

**Issue 3**: System preference detection not supported
**Solution**: Default to dark theme with clear user choice

**Issue 4**: Performance impact
**Solution**: Minimal CSS changes, efficient JavaScript

**Issue 5**: Accessibility compliance
**Solution**: Comprehensive ARIA implementation and testing

## DESIGN VALIDATION

### User Experience Goals
- **Intuitive**: Users understand widget purpose immediately
- **Accessible**: Works for all users including those with disabilities
- **Responsive**: Works well on all device sizes
- **Fast**: No noticeable performance impact
- **Consistent**: Matches existing design language

### Technical Goals
- **Maintainable**: Clean, well-documented code
- **Extensible**: Easy to add new themes in future
- **Compatible**: Works with existing build system
- **Reliable**: Handles edge cases gracefully

🎨🎨🎨 EXITING CREATIVE PHASE - DESIGN COMPLETE 🎨🎨🎨

## IMPLEMENTATION READINESS

**Design Phase**: ✅ Complete
**Technical Architecture**: ✅ Planned
**Accessibility Requirements**: ✅ Defined
**Multi-language Support**: ✅ Designed
**Risk Assessment**: ✅ Identified and mitigated

**Next Steps**:
1. Begin CSS implementation with custom properties
2. Create JavaScript theme management module
3. Integrate with Handlebars templates
4. Implement comprehensive testing

This creative phase provides the complete design foundation for implementing the theme switcher widget while maintaining the existing design language and ensuring accessibility compliance. 
// Theme Management Module

// Theme constants
const THEMES = {
  SYSTEM: 'system',
  DARK: 'dark',
  LIGHT: 'light'
};

class ThemeManager {
  constructor() {
    this.currentTheme = THEMES.SYSTEM;
    this.eventListeners = new Map();
  }

  applyTheme(themeMode) {
    if (themeMode === THEMES.SYSTEM) {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDarkMode ? THEMES.DARK : THEMES.LIGHT);
    } else {
      document.documentElement.setAttribute('data-theme', themeMode);
    }
  }

  cycleTheme() {
    const newTheme =
      this.currentTheme === THEMES.SYSTEM
        ? THEMES.DARK
        : this.currentTheme === THEMES.DARK
        ? THEMES.LIGHT
        : THEMES.SYSTEM;
    this.currentTheme = newTheme;
    localStorage.setItem('theme', newTheme);
    this.applyTheme(newTheme);
    this.emit('themeChanged', newTheme);
  }

  handleKeyDown(e) {
    if (e.ctrlKey && (e.altKey || e.metaKey) && e.key === 't') {
      this.cycleTheme();
    }
  }

  handleSystemThemeChange() {
    if (this.currentTheme === THEMES.SYSTEM) {
      this.applyTheme(THEMES.SYSTEM);
    }
  }

  init() {
    // Load saved theme, default to 'system'
    const savedTheme = localStorage.getItem('theme') || THEMES.SYSTEM;
    this.currentTheme = savedTheme;
    this.applyTheme(savedTheme);

    // Add keyboard event listener
    window.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Add system theme change listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
  }

  // Public method to manually cycle theme
  toggleTheme() {
    this.cycleTheme();
  }

  // Public method to set specific theme
  setTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
    this.emit('themeChanged', theme);
  }

  // Public method to get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Event listener methods
  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  removeEventListener(event, callback) {
    if (this.eventListeners.has(event)) {
      const callbacks = this.eventListeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        callback(data);
      });
    }
  }
}

// Create and export a singleton instance
const themeManager = new ThemeManager();

export default themeManager;

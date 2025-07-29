// Theme Management Module

// Theme constants
export const THEMES = {
  SYSTEM: 'system',
  DARK: 'dark',
  LIGHT: 'light',
};

class ThemeManager {
  constructor() {
    this.currentTheme = THEMES.SYSTEM;
    this.eventListeners = new Map();
    this.mediaQuery = null;
    this.isInitialized = false;
  }

  applyTheme(themeMode) {
    try {
      if (themeMode === THEMES.SYSTEM) {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDarkMode ? THEMES.DARK : THEMES.LIGHT);
      } else {
        document.documentElement.setAttribute('data-theme', themeMode);
      }
    } catch (error) {
      console.warn('Theme application failed:', error);
      // Fallback to light theme
      document.documentElement.setAttribute('data-theme', THEMES.LIGHT);
    }
  }

  cycleTheme() {
    const themeOrder = [THEMES.SYSTEM, THEMES.DARK, THEMES.LIGHT];
    const currentIndex = themeOrder.indexOf(this.currentTheme);
    const newTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    
    this.setTheme(newTheme);
  }

  handleSystemThemeChange = () => {
    if (this.currentTheme === THEMES.SYSTEM) {
      this.applyTheme(THEMES.SYSTEM);
      this.emit('themeChanged', this.currentTheme);
    }
  };

  init() {
    if (this.isInitialized) return;
    
    try {
      // Load saved theme, default to 'system'
      const savedTheme = localStorage.getItem('theme') || THEMES.SYSTEM;
      this.currentTheme = savedTheme;
      this.applyTheme(savedTheme);

      // Add system theme change listener with proper cleanup
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);
      
      this.isInitialized = true;
    } catch (error) {
      console.warn('Theme initialization failed:', error);
      // Fallback initialization
      this.currentTheme = THEMES.LIGHT;
      this.applyTheme(THEMES.LIGHT);
    }
  }

  // Public method to manually cycle theme
  toggleTheme() {
    this.cycleTheme();
  }

  // Public method to set specific theme
  setTheme(theme) {
    if (!Object.values(THEMES).includes(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return;
    }
    
    this.currentTheme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
    this.applyTheme(theme);
    this.emit('themeChanged', theme);
  }

  // Public method to get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Event listener methods with improved performance
  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);
  }

  removeEventListener(event, callback) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.warn('Event listener error:', error);
        }
      });
    }
  }

  // Cleanup method
  destroy() {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
      this.mediaQuery = null;
    }
    this.eventListeners.clear();
    this.isInitialized = false;
  }
}

// Create and export a singleton instance
const themeManager = new ThemeManager();

export default themeManager;

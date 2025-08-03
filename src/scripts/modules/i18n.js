// Internationalization (i18n) Module

// Supported languages
export const SUPPORTED_LANGUAGES = {
  EN: 'en',
  ES: 'es',
  CA: 'ca',
};

// Default language fallback
const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.EN;

// Translation strings object
const TRANSLATIONS = {
  [SUPPORTED_LANGUAGES.EN]: {
    // Theme related
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'theme.toggle': 'Toggle theme (Ctrl+Alt/Cmd+T)',
    'theme.aria.title': 'Current theme: "{currentTheme}". Click to cycle themes.',
  },

  [SUPPORTED_LANGUAGES.ES]: {
    // Theme related
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    'theme.system': 'Sistema',
    'theme.toggle': 'Alternar tema (Ctrl+Alt/Cmd+T)',
    'theme.aria.title': 'Tema actual: "{currentTheme}". Haz clic para cambiar de tema.',
  },

  [SUPPORTED_LANGUAGES.CA]: {
    // Theme related
    'theme.light': 'Clar',
    'theme.dark': 'Fosc',
    'theme.system': 'Sistema',
    'theme.toggle': 'Alternar tema (Ctrl+Alt/Cmd+T)',
    'theme.aria.title': 'Tema actual: "{currentTheme}". Clica per canviar de tema.',
  },
};

class I18nService {
  constructor() {
    this.currentLanguage = null;
    this.eventListeners = new Map();
    this.isInitialized = false;
  }

  /**
   * Get the current language from the HTML tag's lang attribute
   * @returns {string} The current language code
   */
  getCurrentLanguage() {
    try {
      const htmlLang = document.documentElement.getAttribute('lang');
      if (htmlLang && Object.values(SUPPORTED_LANGUAGES).includes(htmlLang)) {
        return htmlLang;
      }
      return DEFAULT_LANGUAGE;
    } catch (error) {
      console.warn('Failed to get current language from HTML tag:', error);
      return DEFAULT_LANGUAGE;
    }
  }

  /**
   * Set the current language and update the HTML lang attribute
   * @param {string} language - The language code to set
   */
  setLanguage(language) {
    if (!Object.values(SUPPORTED_LANGUAGES).includes(language)) {
      console.warn(`Unsupported language: ${language}`);
      return;
    }

    try {
      this.currentLanguage = language;
      document.documentElement.setAttribute('lang', language);
      this.emit('languageChanged', language);
    } catch (error) {
      console.warn('Failed to set language:', error);
    }
  }

  /**
   * Translate a string ID to the current language
   * @param {string} key - The translation key
   * @param {Object} params - Optional parameters for string interpolation
   * @returns {string} The translated string or the key if not found
   */
  translate(key, params = {}) {
    if (!key || typeof key !== 'string') {
      console.warn('Invalid translation key:', key);
      return key || '';
    }

    const language = this.currentLanguage || this.getCurrentLanguage();
    const translations = TRANSLATIONS[language] || TRANSLATIONS[DEFAULT_LANGUAGE];

    let translation = translations[key];

    if (!translation) {
      // Fallback to default language if not found in current language
      if (language !== DEFAULT_LANGUAGE) {
        translation = TRANSLATIONS[DEFAULT_LANGUAGE][key];
      }

      // If still not found, return the key itself
      if (!translation) {
        console.warn(`Translation not found for key: ${key} in language: ${language}`);
        return key;
      }
    }

    // Handle string interpolation with parameters
    if (params && typeof params === 'object') {
      translation = this.interpolate(translation, params);
    }

    return translation;
  }

  /**
   * Interpolate parameters into a translation string
   * @param {string} text - The text with placeholders
   * @param {Object} params - The parameters to interpolate
   * @returns {string} The interpolated string
   */
  interpolate(text, params) {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * Get all available languages
   * @returns {Array} Array of supported language codes
   */
  getSupportedLanguages() {
    return Object.values(SUPPORTED_LANGUAGES);
  }

  /**
   * Check if a language is supported
   * @param {string} language - The language code to check
   * @returns {boolean} True if the language is supported
   */
  isLanguageSupported(language) {
    return Object.values(SUPPORTED_LANGUAGES).includes(language);
  }

  /**
   * Get all translations for a specific language
   * @param {string} language - The language code
   * @returns {Object} All translations for the language
   */
  getTranslations(language = null) {
    const lang = language || this.currentLanguage || this.getCurrentLanguage();
    return TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANGUAGE];
  }

  /**
   * Initialize the i18n service
   */
  init() {
    if (this.isInitialized) return;

    try {
      this.currentLanguage = this.getCurrentLanguage();
      this.isInitialized = true;
      this.emit('initialized', this.currentLanguage);
    } catch (error) {
      console.warn('i18n initialization failed:', error);
      this.currentLanguage = DEFAULT_LANGUAGE;
      this.isInitialized = true;
    }
  }

  // Event listener methods
  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);
  }

  removeEventListener(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.warn(`Error in i18n event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Clean up the i18n service
   */
  destroy() {
    this.eventListeners.clear();
    this.isInitialized = false;
  }
}

// Create and export a singleton instance
const i18n = new I18nService();

// Export the singleton instance and the class for testing
export default i18n;
export { I18nService };

// Convenience function for quick translations
export const t = (key, params) => i18n.translate(key, params);

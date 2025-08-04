// main.js
import themeManager from './modules/themeManager';
import { createThemeSwitcher } from './modules/themeSwitcher';
import i18n from './modules/i18n';

// Performance optimization: Use requestIdleCallback if available
const scheduleTask = (task) => {
  if (window.requestIdleCallback) {
    requestIdleCallback(task, { timeout: 1000 });
  } else {
    setTimeout(task, 0);
  }
};

document.addEventListener(
  'DOMContentLoaded',
  () => {
    try {
      // Initialize core functionality immediately
      i18n.init();
      themeManager.init();

      // Initialize theme switcher with themeManager instance
      // Use requestIdleCallback for non-critical UI initialization
      scheduleTask(() => {
        try {
          const themeSwitcher = createThemeSwitcher(themeManager);
          themeSwitcher.init();
        } catch (error) {
          console.warn('Theme switcher initialization failed:', error);
        }
      });
    } catch (error) {
      console.error('Application initialization failed:', error);
    }
  },
  false
);

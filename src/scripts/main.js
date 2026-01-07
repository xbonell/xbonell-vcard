// main.js
import themeManager from './modules/themeManager';
import { createThemeSwitcher } from './modules/themeSwitcher';
import i18n from './modules/i18n';
import hole from './modules/hole';
import errorCode from './modules/errorCode';

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
      // Initialize error code detection first (if on error page)
      errorCode.init();

      // Initialize core functionality immediately
      i18n.init();
      themeManager.init();
      hole.init();

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

// main.js
import domTweak from './modules/domTweak';
import themeManager from './modules/themeManager';
import { createThemeSwitcher } from './modules/themeSwitcher';

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
      const NODE_ENV = process.env.NODE_ENV;

      if (NODE_ENV === 'production') {
        if (!window.console) window.console = {};
        const methods = ['log', 'debug', 'warn', 'info'];
        methods.forEach((method) => {
          console[method] = () => {};
        });
      }

      // Initialize core functionality immediately
      domTweak();
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

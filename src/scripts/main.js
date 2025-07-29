// main.js
import domTweak from './modules/domTweak';
import themeManager from './modules/themeManager';
import { createThemeSwitcher } from './modules/themeSwitcher';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const NODE_ENV = process.env.NODE_ENV;

    if (NODE_ENV === 'production') {
      if (!window.console) window.console = {};
      const methods = ['log', 'debug', 'warn', 'info'];
      methods.forEach((method) => {
        console[method] = () => {};
      });
    }

    domTweak();
    themeManager.init();
    
    // Initialize theme switcher with themeManager instance
    const themeSwitcher = createThemeSwitcher(themeManager);
    themeSwitcher.init();
  },
  false
);

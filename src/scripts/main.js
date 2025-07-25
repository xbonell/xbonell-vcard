// main.js
import domTweak from './modules/domTweak';

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
  },
  false
);

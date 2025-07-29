// Theme Switcher Module
// Receives themeManager instance as argument and generates theme switcher functionality

import { THEMES } from './themeManager';

class ThemeSwitcher {
  constructor(themeManager) {
    this.themeManager = themeManager;
    this.switcherElement = null;
    this.iconElement = null;
    this.labelIcon = null;
    this.labelText = null;
    this.clickTimeout = null;
    this.isDestroyed = false;
    
    // Bind methods to avoid creating new functions on each call
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  // Create the theme switcher HTML element
  createSwitcherElement() {
    const switcher = document.createElement('button');
    switcher.className = 'theme-switcher';
    switcher.setAttribute('aria-label', 'Toggle theme');
    switcher.setAttribute('title', 'Toggle theme (Ctrl+Alt/Cmd+T)');

    // Create label element
    const label = document.createElement('span');
    const labelText = document.createElement('span');
    labelText.className = 'theme-switcher__label-text';
    const labelIcon = document.createElement('span');
    labelIcon.className = 'theme-switcher__label-icon';
    labelIcon.innerHTML = this.getIconForTheme(this.themeManager.getCurrentTheme());
    label.className = 'theme-switcher__label';
    label.appendChild(labelIcon);
    label.appendChild(labelText);
    switcher.appendChild(label);

    // Create icon element
    const icon = document.createElement('span');
    icon.className = 'theme-switcher__icon';
    icon.innerHTML = this.getIconForTheme(this.themeManager.getCurrentTheme());

    switcher.appendChild(icon);

    return switcher;
  }

  // Get appropriate icon for current theme - cached for performance
  getIconForTheme(theme) {
    const iconMap = {
      [THEMES.DARK]: '<svg aria-hidden="true"><use xlink:href="/assets/images/sprite.svg#moon"></use></svg>',
      [THEMES.LIGHT]: '<svg aria-hidden="true"><use xlink:href="/assets/images/sprite.svg#sun"></use></svg>',
      [THEMES.SYSTEM]: '<svg aria-hidden="true"><use xlink:href="/assets/images/sprite.svg#contrast"></use></svg>'
    };
    
    return iconMap[theme] || iconMap[THEMES.SYSTEM];
  }

  // Cache DOM elements for better performance
  cacheElements() {
    if (!this.switcherElement) return;
    
    this.iconElement = this.switcherElement.querySelector('.theme-switcher__icon');
    this.labelIcon = this.switcherElement.querySelector('.theme-switcher__label-icon');
    this.labelText = this.switcherElement.querySelector('.theme-switcher__label-text');
  }

  // Update switcher appearance based on current theme
  updateSwitcherAppearance() {
    if (!this.switcherElement || this.isDestroyed) return;

    try {
      const currentTheme = this.themeManager.getCurrentTheme();
      const iconHtml = this.getIconForTheme(currentTheme);

      // Update cached elements
      if (this.iconElement) {
        this.iconElement.innerHTML = iconHtml;
      }
      if (this.labelIcon) {
        this.labelIcon.innerHTML = iconHtml;
      }
      if (this.labelText) {
        this.labelText.textContent = `Enabled "${currentTheme
          .charAt(0)
          .toUpperCase()}${currentTheme.slice(1)}" theme`;
      }

      // Update aria-label for accessibility
      this.switcherElement.setAttribute(
        'aria-label',
        `Current theme: ${currentTheme}. Click to cycle themes.`
      );
    } catch (error) {
      console.warn('Failed to update switcher appearance:', error);
    }
  }

  // Handle click event on theme switcher
  handleClick() {
    if (this.isDestroyed) return;
    
    try {
      this.themeManager.toggleTheme();
      this.updateSwitcherAppearance();

      // Clear existing timeout to prevent multiple timeouts
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
      }

      // Add visual feedback
      this.switcherElement.classList.add('theme-switcher--clicked');
      this.clickTimeout = setTimeout(() => {
        if (!this.isDestroyed && this.switcherElement) {
          this.switcherElement.classList.remove('theme-switcher--clicked');
        }
        this.clickTimeout = null;
      }, 2000);
    } catch (error) {
      console.warn('Theme toggle failed:', error);
    }
  }

  handleKeyDown(e) {
    if (this.isDestroyed) return;
    
    if (e.ctrlKey && (e.altKey || e.metaKey) && e.key === 't') {
      e.preventDefault(); // Prevent default browser behavior
      this.handleClick();
    }
  }

  // Initialize the theme switcher
  init(containerSelector = 'body') {
    if (this.isDestroyed) return;
    
    try {
      // Create switcher element
      this.switcherElement = this.createSwitcherElement();

      // Cache DOM elements
      this.cacheElements();

      // Add click event listener
      this.switcherElement.addEventListener('click', this.handleClick);

      // Insert into DOM
      const container = document.querySelector(containerSelector);
      if (container) {
        container.appendChild(this.switcherElement);
      } else {
        document.body.appendChild(this.switcherElement);
      }

      // Update initial appearance
      this.updateSwitcherAppearance();

      // Add keyboard event listener
      window.addEventListener('keydown', this.handleKeyDown);
      
      // Listen for theme changes from themeManager
      this.themeManager.addEventListener('themeChanged', this.updateSwitcherAppearance.bind(this));
    } catch (error) {
      console.warn('Theme switcher initialization failed:', error);
    }
  }

  // Public method to destroy the switcher
  destroy() {
    this.isDestroyed = true;
    
    // Clear any pending timeouts
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }

    // Remove event listeners
    try {
      window.removeEventListener('keydown', this.handleKeyDown);
      if (this.switcherElement) {
        this.switcherElement.removeEventListener('click', this.handleClick);
      }
      this.themeManager.removeEventListener('themeChanged', this.updateSwitcherAppearance);
    } catch (error) {
      console.warn('Error removing event listeners:', error);
    }

    // Remove from DOM
    if (this.switcherElement && this.switcherElement.parentNode) {
      this.switcherElement.parentNode.removeChild(this.switcherElement);
    }
    
    // Clear cached references
    this.switcherElement = null;
    this.iconElement = null;
    this.labelIcon = null;
    this.labelText = null;
  }

  // Public method to get the switcher element
  getElement() {
    return this.switcherElement;
  }
}

// Factory function to create theme switcher with themeManager
export function createThemeSwitcher(themeManager) {
  return new ThemeSwitcher(themeManager);
}

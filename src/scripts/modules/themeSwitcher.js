// Theme Switcher Module
// Receives themeManager instance as argument and generates theme switcher functionality

class ThemeSwitcher {
  constructor(themeManager) {
    this.themeManager = themeManager;
    this.switcherElement = null;
    this.iconElement = null;
  }

  // Create the theme switcher HTML element
  createSwitcherElement() {
    const switcher = document.createElement('button');
    switcher.className = 'theme-switcher';
    switcher.setAttribute('aria-label', 'Toggle theme');
    switcher.setAttribute('title', 'Toggle theme (Ctrl+Alt+T)');
    
    // Create icon element
    const icon = document.createElement('span');
    icon.className = 'theme-switcher__icon';
    icon.innerHTML = this.getIconForTheme(this.themeManager.getCurrentTheme());
    
    switcher.appendChild(icon);
    
    return switcher;
  }

  // Get appropriate icon for current theme
  getIconForTheme(theme) {
    switch (theme) {
      case 'dark':
        return '<svg aria-hidden="true"><use xlink:href="/assets/images/sprite.svg#moon"></use></svg>';
      case 'light':
        return '<svg aria-hidden="true"><use xlink:href="/assets/images/sprite.svg#sun"></use></svg>';
      case 'system':
      default:
        return '<svg aria-hidden="true"><use xlink:href="/assets/images/sprite.svg#contrast"></use></svg>';
    }
  }



  // Update switcher appearance based on current theme
  updateSwitcherAppearance() {
    if (!this.switcherElement) return;
    
    const currentTheme = this.themeManager.getCurrentTheme();
    const iconElement = this.switcherElement.querySelector('.theme-switcher__icon');
    
    if (iconElement) {
      iconElement.innerHTML = this.getIconForTheme(currentTheme);
    }
    
    // Update aria-label for accessibility
    this.switcherElement.setAttribute('aria-label', `Current theme: ${currentTheme}. Click to cycle themes.`);
  }

  // Handle click event on theme switcher
  handleClick() {
    this.themeManager.toggleTheme();
    this.updateSwitcherAppearance();
    
    // Add visual feedback
    this.switcherElement.classList.add('theme-switcher--clicked');
    setTimeout(() => {
      this.switcherElement.classList.remove('theme-switcher--clicked');
    }, 200);
  }

  // Initialize the theme switcher
  init(containerSelector = 'body') {
    // Create switcher element
    this.switcherElement = this.createSwitcherElement();
    
    // Add click event listener
    this.switcherElement.addEventListener('click', this.handleClick.bind(this));
    
    // Insert into DOM
    const container = document.querySelector(containerSelector);
    if (container) {
      container.appendChild(this.switcherElement);
    } else {
      document.body.appendChild(this.switcherElement);
    }
    
    // Update initial appearance
    this.updateSwitcherAppearance();
    
    // Listen for theme changes from themeManager
    this.themeManager.addEventListener('themeChanged', () => {
      this.updateSwitcherAppearance();
    });
  }

  // Public method to destroy the switcher
  destroy() {
    if (this.switcherElement && this.switcherElement.parentNode) {
      this.switcherElement.parentNode.removeChild(this.switcherElement);
    }
    this.switcherElement = null;
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

// Default export for backward compatibility
export default ThemeSwitcher;

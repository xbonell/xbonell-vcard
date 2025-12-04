// Hole Module
// Appends a div with id="hole" to the document with logo-shaped mask

class Hole {
  constructor() {
    this.holeElement = null;
    this.shadowElement = null;
    this.canvasElement = null;
    this.resizeObserver = null;
    this.themeObserver = null;
    this.resizeTimeout = null;
    this.windowResizeTimeout = null;
    this.isInitialized = false;

    // Cache viewport dimensions to detect real resizes vs iOS browser chrome changes
    this.lastViewportWidth = 0;
    this.lastViewportHeight = 0;

    // Shadow offset and blur settings
    this.shadowOffsetX = 50;
    this.shadowOffsetY = 50;
    this.shadowScale = 1.08; // Larger for wider shadow spread

    // Logo path data from logo.svg
    // viewBox: 0 0 194 146
    // Group transform: matrix(1,0,0,1,0,-27.0766) - translates Y by -27.0766
    this.logoPath1 = 'M0,46.57L28.537,46.578L140.98,158.791L88.682,158.791L51.162,121.752L0,172.306L0,119.756L24.693,95.284L0,70.812L0,46.57Z';
    this.logoPath2 = 'M94.472,27.077L147.281,27.077L109.996,61.802L193.674,62.15L193.674,100.624L94.348,100.404L56.858,63.919L94.472,27.077Z';
    this.logoPath3 = 'M193.674,119.756L113.295,119.756L151.179,158.791L193.674,158.755L193.674,119.756Z';
    // ViewBox of the logo
    this.logoViewBox = { x: 0, y: 0, width: 194, height: 146 };
    // Group transform Y translation
    this.logoGroupTransformY = -27.0766;

    // Syntax highlighting colors
    this.colors = {
      tag: '#9c637a', // Purple for tags
      attribute: '#994500', // Orange for attributes
      value: '#22a2c9', // Blue for attribute values
      text: '#666666', // Black for text content
      punctuation: '#666666', // Black for < > / = etc.
    };

    // Bind event handlers
    this.handleScroll = this.handleScroll.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  /**
   * Generates the combined SVG path for the logo, applying transforms
   * @param {number} translateX - X translation
   * @param {number} translateY - Y translation  
   * @param {number} scaleX - X scale factor
   * @param {number} scaleY - Y scale factor
   * @returns {string} The transformed path data
   */
  generateTransformedPath(translateX, translateY, scaleX, scaleY) {
    // Parse and transform all paths
    const paths = [this.logoPath1, this.logoPath2, this.logoPath3];
    const transformedPaths = [];

    // Y offset from original SVG group transform
    const groupOffsetY = this.logoGroupTransformY;

    for (const pathData of paths) {
      // Parse the path commands and transform coordinates
      const transformed = pathData.replace(
        /([MLZ])([^MLZ]*)/g,
        (match, cmd, coords) => {
          if (cmd === 'Z') return cmd;
          
          // Parse coordinate pairs
          const parts = coords.split(/[,\s]+/).filter(p => p !== '');
          const transformedParts = [];
          
          for (let i = 0; i < parts.length; i += 2) {
            const x = parseFloat(parts[i]);
            const y = parseFloat(parts[i + 1]);
            
            // Apply group transform (Y offset), then scale, then translate
            const newX = (x * scaleX) + translateX;
            const newY = ((y + groupOffsetY) * scaleY) + translateY;
            
            transformedParts.push(`${newX.toFixed(2)},${newY.toFixed(2)}`);
          }
          
          return cmd + transformedParts.join(' ');
        }
      );
      transformedPaths.push(transformed);
    }

    return transformedPaths.join(' ');
  }

  /**
   * Gets the page's HTML as text (minified)
   * @returns {string} The minified HTML content of the page
   */
  getPageHTML() {
    try {
      let html = document.documentElement.outerHTML;
      
      // Remove line breaks and normalize whitespace
      // Be careful to preserve spaces between attributes within tags
      
      // Step 1: Remove line breaks and carriage returns (but preserve spaces)
      html = html.replace(/\r?\n|\r/g, ' ');
      
      // Step 2: Remove spaces ONLY between tags (not within tags)
      // Match pattern: closing tag > followed by whitespace followed by opening tag <
      // This preserves spaces between attributes like: <div class="foo" id="bar">
      html = html.replace(/>\s+</g, '><');
      
      // Step 3: Normalize multiple consecutive spaces/tabs to single space
      // This only affects sequences of 2+ spaces, preserving single spaces between attributes
      html = html.replace(/[ \t]{2,}/g, ' ');
      
      // Step 4: Trim leading/trailing whitespace
      html = html.trim();
      
      return html;
    } catch (error) {
      console.warn('Failed to get page HTML:', error);
      return '';
    }
  }

  /**
   * Tokenizes HTML text for syntax highlighting
   * @param {string} html - The HTML string to tokenize
   * @returns {Array} Array of tokens with type and text
   */
  tokenizeHTML(html) {
    const tokens = [];
    let i = 0;
    let inTag = false;
    let inAttributeValue = false;
    let quoteChar = '';
    let expectingAttribute = false;
    let currentToken = { type: 'text', text: '' };

    while (i < html.length) {
      const char = html[i];

      if (char === '<' && !inTag) {
        // Start of tag
        if (currentToken.text.trim()) {
          tokens.push(currentToken);
        }
        inTag = true;
        expectingAttribute = false;
        tokens.push({ type: 'punctuation', text: '<' });
        currentToken = { type: 'tag', text: '' };
      } else if (char === '>' && inTag) {
        // End of tag
        if (currentToken.text) {
          tokens.push(currentToken);
        }
        tokens.push({ type: 'punctuation', text: '>' });
        inTag = false;
        inAttributeValue = false;
        expectingAttribute = false;
        currentToken = { type: 'text', text: '' };
      } else if (char === '/' && inTag && !inAttributeValue) {
        // Closing tag slash or self-closing (only when not inside attribute value)
        if (currentToken.text) {
          tokens.push(currentToken);
        }
        tokens.push({ type: 'punctuation', text: '/' });
        if (currentToken.type === 'tag') {
          currentToken = { type: 'tag', text: '' };
        }
        expectingAttribute = false;
      } else if (inTag && char === '=' && !inAttributeValue) {
        // Attribute equals sign
        if (currentToken.text) {
          tokens.push(currentToken);
        }
        tokens.push({ type: 'punctuation', text: '=' });
        currentToken = { type: 'value', text: '' };
        expectingAttribute = false;
      } else if (inTag && (char === '"' || char === "'")) {
        // Quote for attribute value
        if (!inAttributeValue && currentToken.type === 'value') {
          // Start of quoted value
          inAttributeValue = true;
          quoteChar = char;
          tokens.push({ type: 'punctuation', text: char });
        } else if (inAttributeValue && char === quoteChar) {
          // End of quoted value
          if (currentToken.text) {
            tokens.push(currentToken);
          }
          tokens.push({ type: 'punctuation', text: char });
          inAttributeValue = false;
          currentToken = { type: 'attribute', text: '' };
          expectingAttribute = false;
        } else {
          // Quote character inside value (shouldn't happen in valid HTML, but handle it)
          currentToken.text += char;
        }
      } else if (inTag && char === ' ' && !inAttributeValue) {
        // Space in tag - preserve it as punctuation
        if (currentToken.text) {
          tokens.push(currentToken);
        }
        // Add space as punctuation token to preserve it
        tokens.push({ type: 'punctuation', text: ' ' });
        if (currentToken.type === 'tag' || currentToken.type === 'attribute') {
          expectingAttribute = true;
          currentToken = { type: 'attribute', text: '' };
        }
      } else {
        // Regular character - accumulate into current token
        // When inAttributeValue is true, all characters go into the value token
        if (inTag) {
          if (inAttributeValue) {
            // Inside quoted attribute value - accumulate all characters
            currentToken.text += char;
          } else if (currentToken.type === 'text') {
            currentToken = { type: 'tag', text: char };
          } else {
            currentToken.text += char;
          }
        } else {
          currentToken.text += char;
        }
      }

      i++;
    }

    // Add remaining token
    if (currentToken.text) {
      tokens.push(currentToken);
    }

    return tokens;
  }

  /**
   * Handles canvas resize with debouncing
   */
  handleResize = () => {
    if (!this.canvasElement) return;

    // Clear existing timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    // Debounce resize to avoid too many rerenders
    this.resizeTimeout = setTimeout(() => {
      this.renderHTMLOnCanvas();
    }, 100);
  };

  /**
   * Handles window resize to update clip-path position
   * Debounced and filters out iOS browser chrome changes
   */
  handleWindowResize() {
    // Clear existing timeout
    if (this.windowResizeTimeout) {
      clearTimeout(this.windowResizeTimeout);
    }

    // Debounce resize to avoid too many updates (especially on iOS)
    this.windowResizeTimeout = setTimeout(() => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      // On iOS, the browser chrome showing/hiding only changes height, not width
      // Only update clip-path if:
      // 1. Width has changed (real resize or orientation change)
      // 2. Height changed significantly (more than 100px, likely orientation change)
      const widthChanged = Math.abs(currentWidth - this.lastViewportWidth) > 1;
      const heightChangedSignificantly = Math.abs(currentHeight - this.lastViewportHeight) > 100;

      if (widthChanged || heightChangedSignificantly) {
        this.lastViewportWidth = currentWidth;
        this.lastViewportHeight = currentHeight;
        this.updateClipPath();
      }
    }, 150);
  }

  /**
   * Sets up resize observer for the canvas
   */
  setupResizeObserver() {
    if (!this.canvasElement || !window.ResizeObserver) return;

    try {
      // Clean up existing observer
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }

      // Create new resize observer
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === this.canvasElement) {
            this.handleResize();
          }
        }
      });

      // Observe the canvas element
      this.resizeObserver.observe(this.canvasElement);
    } catch (error) {
      console.warn('Failed to setup resize observer:', error);
    }
  }

  /**
   * Renders HTML text on the canvas with parallax scroll offset
   */
  renderHTMLOnCanvas() {
    if (!this.canvasElement) return;

    try {
      const canvas = this.canvasElement;
      const ctx = canvas.getContext('2d');
      const htmlText = this.getPageHTML();

      // Get current display size
      const displayWidth = canvas.offsetWidth || canvas.width || 800;
      const displayHeight = canvas.offsetHeight || canvas.height || 600;

      // Set canvas internal size to match display size (prevents distortion)
      canvas.width = displayWidth;
      canvas.height = displayHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate font size from vmin (2vmin = 2% of smaller viewport dimension)
      // Ensure minimum font size of 14px and maximum of 18px
      const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
      const fontSize = Math.min(30, Math.max(14, 2 * vmin));

      // Set text rendering properties
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = 'top';

      // Calculate line height as 150% of font size
      const lineHeight = fontSize * 1.25;

      // Get scroll offset for parallax (content scrolls up as page scrolls down)
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const parallaxOffset = scrollTop * 0.3;

      // Tokenize HTML for syntax highlighting
      const tokens = this.tokenizeHTML(htmlText);

      // First pass: build all lines
      const maxWidth = canvas.width;
      const lines = [];
      let currentLineTokens = [];
      let currentLineWidth = 0;

      tokens.forEach((token) => {
        const tokenWidth = ctx.measureText(token.text).width;
        const testWidth = currentLineWidth + tokenWidth;

        if (testWidth > maxWidth && currentLineTokens.length > 0) {
          lines.push([...currentLineTokens]);
          currentLineTokens = [token];
          currentLineWidth = tokenWidth;
        } else {
          currentLineTokens.push(token);
          currentLineWidth = testWidth;
        }
      });

      if (currentLineTokens.length > 0) {
        lines.push(currentLineTokens);
      }

      // Second pass: render lines with scroll offset applied
      // Start Y position accounts for parallax scroll (negative = content moves up)
      let y = -parallaxOffset;

      lines.forEach((lineTokens) => {
        // Only render lines that are visible on canvas
        if (y + lineHeight > 0 && y < canvas.height) {
          let lineX = 0;
          lineTokens.forEach((lineToken) => {
            ctx.fillStyle = this.colors[lineToken.type] || this.colors.text;
            ctx.fillText(lineToken.text, lineX, y);
            lineX += ctx.measureText(lineToken.text).width;
          });
        }
        y += lineHeight;

        // Stop if we're past the canvas bottom
        if (y > canvas.height) {
          return;
        }
      });
    } catch (error) {
      console.warn('Failed to render HTML on canvas:', error);
    }
  }

  /**
   * Creates and appends a canvas element inside the hole div
   */
  createCanvas() {
    if (!this.holeElement) return;

    try {
      // Check if canvas already exists
      const existingCanvas = this.holeElement.querySelector('canvas');
      if (existingCanvas) {
        this.canvasElement = existingCanvas;
        // Setup resize observer for existing canvas
        this.setupResizeObserver();
        return;
      }

      // Create canvas element
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      this.holeElement.appendChild(canvas);
      this.canvasElement = canvas;

      // Render HTML on canvas
      this.renderHTMLOnCanvas();

      // Setup resize observer
      this.setupResizeObserver();
    } catch (error) {
      console.warn('Failed to create canvas:', error);
    }
  }

  /**
   * Checks if light theme is active
   * @returns {boolean} True if light theme is active
   */
  isLightTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  /**
   * Updates the logo clip-path position
   * The clip-path uses the SVG logo shape, covering the whole viewport
   * In light mode, the mask is inverted (shows everything except logo shape)
   */
  updateClipPath() {
    if (!this.holeElement) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isLightMode = this.isLightTheme();

    // Scale logo to cover the entire viewport
    // Logo viewBox is 194x146
    const logoAspectRatio = this.logoViewBox.width / this.logoViewBox.height;
    const viewportAspectRatio = viewportWidth / viewportHeight;

    let clipWidth, clipHeight, clipX, clipY;

    if (viewportAspectRatio > logoAspectRatio) {
      // Viewport is wider than logo - fit to width
      clipWidth = viewportWidth;
      clipHeight = viewportWidth / logoAspectRatio;
      clipX = 0;
      clipY = (viewportHeight - clipHeight) / 2; // Center vertically
    } else {
      // Viewport is taller than logo - fit to height
      clipHeight = viewportHeight;
      clipWidth = viewportHeight * logoAspectRatio;
      clipX = (viewportWidth - clipWidth) / 2; // Center horizontally
      clipY = 0;
    }

    // Calculate scale factors
    const scaleX = clipWidth / this.logoViewBox.width;
    const scaleY = clipHeight / this.logoViewBox.height;

    // Generate transformed path
    const pathData = this.generateTransformedPath(clipX, clipY, scaleX, scaleY);
    
    // In light mode, invert the mask (show everything except logo shape)
    // In dark mode, show only the logo shape
    let holeClipPath;
    if (isLightMode) {
      // Inverted: rectangle with logo cut out
      holeClipPath = `M0,0 L${viewportWidth},0 L${viewportWidth},${viewportHeight} L0,${viewportHeight} Z ${pathData}`;
      this.holeElement.style.clipPath = `path(evenodd, '${holeClipPath}')`;
      this.holeElement.style.webkitClipPath = `path(evenodd, '${holeClipPath}')`;
    } else {
      // Normal: just the logo shape
      holeClipPath = pathData;
      this.holeElement.style.clipPath = `path('${holeClipPath}')`;
      this.holeElement.style.webkitClipPath = `path('${holeClipPath}')`;
    }

    // Update inner shadow SVG (creates depth effect from mask edges onto canvas)
    if (this.shadowElement) {
      // Apply the same clip-path to shadow so it's contained within the mask
      if (isLightMode) {
        this.shadowElement.style.clipPath = `path(evenodd, '${holeClipPath}')`;
        this.shadowElement.style.webkitClipPath = `path(evenodd, '${holeClipPath}')`;
      } else {
        this.shadowElement.style.clipPath = `path('${pathData}')`;
        this.shadowElement.style.webkitClipPath = `path('${pathData}')`;
      }
      
      // Create shadow mask - always inverted relative to the hole clip-path
      const shadowScaleX = scaleX * this.shadowScale;
      const shadowScaleY = scaleY * this.shadowScale;
      // Adjust position to account for scale and add offset
      const shadowClipX = clipX - (clipWidth * (this.shadowScale - 1) / 2) + this.shadowOffsetX;
      const shadowClipY = clipY - (clipHeight * (this.shadowScale - 1) / 2) + this.shadowOffsetY;
      const logoPathData = this.generateTransformedPath(shadowClipX, shadowClipY, shadowScaleX, shadowScaleY);
      
      let shadowSvgPath;
      if (isLightMode) {
        // In light mode, shadow follows the logo shape (filled)
        shadowSvgPath = logoPathData;
        this.shadowElement.innerHTML = `
          <svg width="100%" height="100%" style="position:absolute;top:0;left:0;">
            <path d="${shadowSvgPath}" fill="currentColor"/>
          </svg>
        `;
      } else {
        // In dark mode, shadow is inverted (rectangle minus logo)
        shadowSvgPath = `M0,0 L${viewportWidth},0 L${viewportWidth},${viewportHeight} L0,${viewportHeight} Z ${logoPathData}`;
        this.shadowElement.innerHTML = `
          <svg width="100%" height="100%" style="position:absolute;top:0;left:0;">
            <path d="${shadowSvgPath}" fill="currentColor" fill-rule="evenodd"/>
          </svg>
        `;
      }
    }
  }

  /**
   * Handles scroll event to apply parallax effect to canvas content
   */
  handleScroll() {
    if (!this.canvasElement) return;

    try {
      // Re-render canvas with scroll offset applied to content position
      // This keeps canvas in place but scrolls content within it
      this.renderHTMLOnCanvas();
    } catch (error) {
      console.warn('Failed to handle scroll:', error);
    }
  }

  /**
   * Sets up scroll listener for parallax effect
   */
  setupScrollListener() {
    try {
      window.addEventListener('scroll', this.handleScroll, { passive: true });
      window.addEventListener('resize', this.handleWindowResize, { passive: true });
    } catch (error) {
      console.warn('Failed to setup scroll listener:', error);
    }
  }

  /**
   * Sets up observer for theme changes to update clip-path inversion
   */
  setupThemeObserver() {
    try {
      // Watch for changes to the data-theme attribute on <html>
      this.themeObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            this.updateClipPath();
          }
        }
      });

      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    } catch (error) {
      console.warn('Failed to setup theme observer:', error);
    }
  }

  /**
   * Appends the shadow element to the document body
   * The shadow sits behind the hole and uses the same clip-path shape
   */
  appendShadow() {
    // Check if the shadow element already exists
    if (document.getElementById('hole-shadow')) {
      this.shadowElement = document.getElementById('hole-shadow');
      return;
    }

    try {
      // Create and append the shadow element
      const shadow = document.createElement('div');
      shadow.id = 'hole-shadow';
      document.body.appendChild(shadow);
      this.shadowElement = shadow;
    } catch (error) {
      console.warn('Failed to append shadow element:', error);
    }
  }

  /**
   * Appends a div with id="hole" to the document body
   * If the element already exists, it will not create a duplicate
   */
  appendHole() {
    // Check if the hole element already exists
    if (document.getElementById('hole')) {
      this.holeElement = document.getElementById('hole');
      // Check if canvas exists
      const existingCanvas = this.holeElement.querySelector('canvas');
      if (existingCanvas) {
        this.canvasElement = existingCanvas;
      }
      return;
    }

    try {
      // Create and append the div element
      const hole = document.createElement('div');
      hole.id = 'hole';
      document.body.appendChild(hole);
      this.holeElement = hole;
    } catch (error) {
      console.warn('Failed to append hole element:', error);
    }
  }

  /**
   * Initialize the hole module
   * Should be called after DOM is ready
   */
  init() {
    if (this.isInitialized) return;

    try {
      // Cache initial viewport dimensions for resize comparison
      this.lastViewportWidth = window.innerWidth;
      this.lastViewportHeight = window.innerHeight;

      this.appendShadow(); // Create shadow first (sits behind hole)
      this.appendHole();
      this.createCanvas();
      this.updateClipPath(); // Set initial clip-path for both hole and shadow
      this.handleScroll(); // Set initial parallax position
      this.setupScrollListener(); // Setup scroll and resize listeners
      this.setupThemeObserver(); // Watch for theme changes to update mask inversion
      this.isInitialized = true;
    } catch (error) {
      console.warn('Hole initialization failed:', error);
      this.isInitialized = true;
    }
  }

  /**
   * Get the hole element
   * @returns {HTMLElement|null} The hole element or null if not initialized
   */
  getElement() {
    return this.holeElement;
  }

  /**
   * Get the canvas element
   * @returns {HTMLCanvasElement|null} The canvas element or null if not initialized
   */
  getCanvas() {
    return this.canvasElement;
  }

  /**
   * Clean up the hole module
   */
  destroy() {
    // Clean up resize observer
    if (this.resizeObserver) {
      try {
        this.resizeObserver.disconnect();
      } catch (error) {
        console.warn('Failed to disconnect resize observer:', error);
      }
      this.resizeObserver = null;
    }

    // Clean up theme observer
    if (this.themeObserver) {
      try {
        this.themeObserver.disconnect();
      } catch (error) {
        console.warn('Failed to disconnect theme observer:', error);
      }
      this.themeObserver = null;
    }

    // Clear resize timeouts
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
    if (this.windowResizeTimeout) {
      clearTimeout(this.windowResizeTimeout);
      this.windowResizeTimeout = null;
    }

    // Remove event listeners
    try {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleWindowResize);
    } catch (error) {
      console.warn('Failed to remove event listeners:', error);
    }

    // Remove shadow element
    if (this.shadowElement && this.shadowElement.parentNode) {
      try {
        this.shadowElement.parentNode.removeChild(this.shadowElement);
      } catch (error) {
        console.warn('Failed to remove shadow element:', error);
      }
    }

    // Remove hole element
    if (this.holeElement && this.holeElement.parentNode) {
      try {
        this.holeElement.parentNode.removeChild(this.holeElement);
      } catch (error) {
        console.warn('Failed to remove hole element:', error);
      }
    }
    this.shadowElement = null;
    this.holeElement = null;
    this.canvasElement = null;
    this.isInitialized = false;
  }
}

// Create and export a singleton instance
const hole = new Hole();

export default hole;
export { Hole };

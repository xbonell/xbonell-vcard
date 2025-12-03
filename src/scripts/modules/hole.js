// Hole Module
// Appends a div with id="hole" to the document with logo-shaped mask

class Hole {
  constructor() {
    this.holeElement = null;
    this.canvasElement = null;
    this.svgElement = null;
    this.resizeObserver = null;
    this.resizeTimeout = null;
    this.isInitialized = false;

    // Logo mask size (fixed at bottom right corner)
    this.maskSize = 40; // Size in vmin units

    // Logo path data (X mark from logo.svg)
    // Original viewBox: -385 -72.5 1040 195, but we only use the X mark portion
    // X mark bounding box: x=-385 to -191.326, y=-72.5 to 121.174 (roughly 194x194)
    this.logoPath1 = 'M-191.326,-10.523 L-191.326,-72.5 L-385,-72.5 L-385,-26.019 L-356.549,-26.019 L-243.444,86.312 L-296.878,86.312 L-333.839,49.363 L-385,100.158 L-385,121.174 L-191.326,121.174 L-191.326,86.312 L-234.093,86.312 L-271.797,47.578 L-191.326,47.578 L-191.326,28.211 L-290.65,28.211 L-328.351,-8.588 L-290.699,-45.386 L-237.312,-45.386 L-275.017,-10.523 Z';
    this.logoPath2 = 'M-385,-1.688 L-385,47.256 L-360.307,22.762 Z';
    // Bounding box of the logo mark
    this.logoViewBox = { x: -385, y: -72.5, width: 193.674, height: 193.674 };

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
   * Creates the SVG element with clipPath for the logo mask
   */
  createClipPathSVG() {
    // Check if SVG already exists
    if (document.getElementById('hole-clip-svg')) {
      this.svgElement = document.getElementById('hole-clip-svg');
      return;
    }

    try {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('id', 'hole-clip-svg');
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');
      svg.style.position = 'absolute';
      svg.style.pointerEvents = 'none';

      // Create the clipPath element
      const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clipPath.setAttribute('id', 'logo-clip');
      clipPath.setAttribute('clipPathUnits', 'objectBoundingBox');

      // Create the path group with transform to normalize to 0-1 coordinates
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Transform to normalize the logo coordinates to 0-1 range
      // Original: x from -385 to -191.326, y from -72.5 to 121.174
      // Scale: 1/193.674 for both x and y
      // Translate: +385 for x, +72.5 for y (to move origin to 0,0)
      const scale = 1 / this.logoViewBox.width;
      const translateX = -this.logoViewBox.x;
      const translateY = -this.logoViewBox.y;
      group.setAttribute('transform', `scale(${scale}) translate(${translateX}, ${translateY})`);

      // Create first path (main X shape)
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute('d', this.logoPath1);
      group.appendChild(path1);

      // Create second path (small triangle)
      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path2.setAttribute('d', this.logoPath2);
      group.appendChild(path2);

      clipPath.appendChild(group);
      svg.appendChild(clipPath);
      document.body.appendChild(svg);
      this.svgElement = svg;
    } catch (error) {
      console.warn('Failed to create clip path SVG:', error);
    }
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
   */
  handleWindowResize() {
    this.updateClipPath();
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
   * Renders HTML text on the canvas
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
      const fontSize = Math.min(18, Math.max(14, 2 * vmin));

      // Set text rendering properties
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = 'top';

      // Calculate line height as 150% of font size
      const lineHeight = fontSize * 1.25;

      // Tokenize HTML for syntax highlighting
      const tokens = this.tokenizeHTML(htmlText);

      // Render text with word wrapping and syntax highlighting - fill full canvas width
      const maxWidth = canvas.width;
      let x = 0;
      let y = 0;
      let currentLineTokens = [];
      let currentLineWidth = 0;

      tokens.forEach((token) => {
        // Stop rendering if we've reached the bottom of the canvas
        if (y + lineHeight > canvas.height) {
          return; // Stop processing remaining tokens
        }

        // Set color based on token type
        ctx.fillStyle = this.colors[token.type] || this.colors.text;

        // Measure token width
        const tokenWidth = ctx.measureText(token.text).width;
        const testWidth = currentLineWidth + tokenWidth;

        if (testWidth > maxWidth && currentLineTokens.length > 0) {
          // Check if we have space for this line before rendering
          if (y + lineHeight <= canvas.height) {
            // Render current line
            let lineX = 0;
            currentLineTokens.forEach((lineToken) => {
              ctx.fillStyle = this.colors[lineToken.type] || this.colors.text;
              ctx.fillText(lineToken.text, lineX, y);
              lineX += ctx.measureText(lineToken.text).width;
            });

            // Move to next line
            y += lineHeight;
          } else {
            // No space for this line, stop rendering
            return;
          }

          // Start new line with current token
          currentLineTokens = [token];
          currentLineWidth = tokenWidth;
        } else {
          // Add token to current line
          currentLineTokens.push(token);
          currentLineWidth = testWidth;
        }
      });

      // Draw remaining line only if there's space
      if (currentLineTokens.length > 0 && y + lineHeight <= canvas.height) {
        let lineX = 0;
        currentLineTokens.forEach((lineToken) => {
          ctx.fillStyle = this.colors[lineToken.type] || this.colors.text;
          ctx.fillText(lineToken.text, lineX, y);
          lineX += ctx.measureText(lineToken.text).width;
        });
      }
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
   * Updates the logo clip-path position
   * The clip-path uses the SVG logo shape, fixed at bottom right corner
   */
  updateClipPath() {
    if (!this.holeElement) return;

    // Use the SVG clipPath reference
    this.holeElement.style.clipPath = 'url(#logo-clip)';
    this.holeElement.style.webkitClipPath = 'url(#logo-clip)';

    // Calculate the actual size in pixels
    const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
    const sizeInPx = this.maskSize * vmin;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // The logo should be maskSize vmin in both width and height
    // Scale factor to make the clipped area the right size
    const scaleX = sizeInPx / viewportWidth;
    const scaleY = sizeInPx / viewportHeight;
    
    // Position at bottom right corner (logo center at 100%, 100%)
    // After scaling, translate so the logo's center aligns with the corner
    const translateX = viewportWidth - sizeInPx / 2;
    const translateY = viewportHeight - sizeInPx / 2;

    // Apply transform to position the clipped area at bottom right
    this.holeElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
    this.holeElement.style.transformOrigin = 'top left';

    // Set CSS variable for the mask size (for shadow styling if needed)
    this.holeElement.style.setProperty('--mask-size', `${this.maskSize}vmin`);
  }

  /**
   * Handles scroll event to apply parallax effect to canvas content
   */
  handleScroll() {
    if (!this.canvasElement) return;

    try {
      // Get scroll position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Apply subtle parallax effect (0.3x scroll speed for subtle effect)
      const parallaxOffset = scrollTop * 0.3;
      
      // Apply transform to canvas for parallax effect
      this.canvasElement.style.transform = `translateY(${parallaxOffset}px)`;
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
      this.createClipPathSVG(); // Create the SVG clipPath first
      this.appendHole();
      this.createCanvas();
      this.updateClipPath(); // Set initial clip-path
      this.handleScroll(); // Set initial parallax position
      this.setupScrollListener(); // Setup scroll and resize listeners
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

    // Clear resize timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }

    // Remove event listeners
    try {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleWindowResize);
    } catch (error) {
      console.warn('Failed to remove event listeners:', error);
    }

    // Remove SVG element
    if (this.svgElement && this.svgElement.parentNode) {
      try {
        this.svgElement.parentNode.removeChild(this.svgElement);
      } catch (error) {
        console.warn('Failed to remove SVG element:', error);
      }
    }

    if (this.holeElement && this.holeElement.parentNode) {
      try {
        this.holeElement.parentNode.removeChild(this.holeElement);
      } catch (error) {
        console.warn('Failed to remove hole element:', error);
      }
    }
    this.holeElement = null;
    this.canvasElement = null;
    this.svgElement = null;
    this.isInitialized = false;
  }
}

// Create and export a singleton instance
const hole = new Hole();

export default hole;
export { Hole };

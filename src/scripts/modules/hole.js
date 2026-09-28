// Hole Module
// Logo-masked hole with WebGL-baked HTML texture and UV parallax scroll

import { bakeHoleHtml } from './holeHtmlBaker.js';
import { createHoleWebglDisplay } from './holeWebglDisplay.js';

/** Extra texture height multiplier so parallax still has content while scrolling */
const BAKE_HEIGHT_MULTIPLIER = 3;
/** Parallax factor matching the previous Canvas 2D behavior */
const PARALLAX_FACTOR = 0.3;

class Hole {
  constructor() {
    this.holeElement = null;
    this.shadowElement = null;
    this.display = null;
    this.resizeObserver = null;
    this.themeObserver = null;
    this.resizeTimeout = null;
    this.windowResizeTimeout = null;
    this.scrollRaf = null;
    this.isInitialized = false;

    this.lastViewportWidth = 0;
    this.lastViewportHeight = 0;

    this.shadowOffsetX = 50;
    this.shadowOffsetY = 50;
    this.shadowScale = 1.08;

    this.logoPath1 =
      'M0,46.57L28.537,46.578L140.98,158.791L88.682,158.791L51.162,121.752L0,172.306L0,119.756L24.693,95.284L0,70.812L0,46.57Z';
    this.logoPath2 =
      'M94.472,27.077L147.281,27.077L109.996,61.802L193.674,62.15L193.674,100.624L94.348,100.404L56.858,63.919L94.472,27.077Z';
    this.logoPath3 =
      'M193.674,119.756L113.295,119.756L151.179,158.791L193.674,158.755L193.674,119.756Z';
    this.logoViewBox = { x: 0, y: 0, width: 194, height: 146 };
    this.logoGroupTransformY = -27.0766;

    this.handleScroll = this.handleScroll.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  /**
   * Generates the combined SVG path for the logo, applying transforms
   * @param {number} translateX
   * @param {number} translateY
   * @param {number} scaleX
   * @param {number} scaleY
   * @returns {string}
   */
  generateTransformedPath(translateX, translateY, scaleX, scaleY) {
    const paths = [this.logoPath1, this.logoPath2, this.logoPath3];
    const transformedPaths = [];
    const groupOffsetY = this.logoGroupTransformY;

    for (const pathData of paths) {
      const transformed = pathData.replace(/([MLZ])([^MLZ]*)/g, (match, cmd, coords) => {
        if (cmd === 'Z') return cmd;

        const parts = coords.split(/[,\s]+/).filter((p) => p !== '');
        const transformedParts = [];

        for (let i = 0; i < parts.length; i += 2) {
          const x = parseFloat(parts[i]);
          const y = parseFloat(parts[i + 1]);
          const newX = x * scaleX + translateX;
          const newY = (y + groupOffsetY) * scaleY + translateY;
          transformedParts.push(`${newX.toFixed(2)},${newY.toFixed(2)}`);
        }

        return cmd + transformedParts.join(' ');
      });
      transformedPaths.push(transformed);
    }

    return transformedPaths.join(' ');
  }

  /**
   * Bake HTML texture and upload to WebGL (init / resize only)
   */
  rebakeAndDraw() {
    if (!this.display || !this.holeElement) return;

    try {
      const canvas = this.display.getCanvas();
      if (!canvas) return;

      const displayWidth = canvas.offsetWidth || this.holeElement.offsetWidth || window.innerWidth;
      const displayHeight =
        canvas.offsetHeight || this.holeElement.offsetHeight || window.innerHeight;

      this.display.resize(displayWidth, displayHeight);

      const maxTex = this.display.getMaxTextureSize();
      const bakeWidth = Math.min(displayWidth, maxTex);
      const bakeHeight = Math.min(
        Math.max(displayHeight, Math.floor(displayHeight * BAKE_HEIGHT_MULTIPLIER)),
        maxTex
      );
      const baked = bakeHoleHtml({ width: bakeWidth, height: bakeHeight });
      if (!baked) {
        console.warn('Hole HTML bake failed; leaving solid backstage');
        return;
      }

      this.display.uploadTexture(baked);
      this.applyScrollUniform();
      this.display.draw();
    } catch (error) {
      console.warn('Failed to rebake hole texture:', error);
    }
  }

  applyScrollUniform() {
    if (!this.display) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.display.setScroll(scrollTop * PARALLAX_FACTOR);
  }

  handleResize = () => {
    if (!this.display) return;

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.rebakeAndDraw();
    }, 100);
  };

  handleWindowResize() {
    if (this.windowResizeTimeout) {
      clearTimeout(this.windowResizeTimeout);
    }

    this.windowResizeTimeout = setTimeout(() => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      const widthChanged = Math.abs(currentWidth - this.lastViewportWidth) > 1;
      const heightChangedSignificantly = Math.abs(currentHeight - this.lastViewportHeight) > 100;

      if (widthChanged || heightChangedSignificantly) {
        this.lastViewportWidth = currentWidth;
        this.lastViewportHeight = currentHeight;
        this.updateClipPath();
        this.rebakeAndDraw();
      }
    }, 150);
  }

  setupResizeObserver() {
    const canvas = this.display && this.display.getCanvas();
    if (!canvas || !window.ResizeObserver) return;

    try {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }

      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === canvas) {
            this.handleResize();
          }
        }
      });

      this.resizeObserver.observe(canvas);
    } catch (error) {
      console.warn('Failed to setup resize observer:', error);
    }
  }

  /**
   * Creates WebGL display canvas inside the hole, or leaves solid backstage
   */
  createDisplay() {
    if (!this.holeElement) return;

    try {
      this.display = createHoleWebglDisplay(this.holeElement);
      if (!this.display) {
        return;
      }

      this.rebakeAndDraw();
      this.setupResizeObserver();
    } catch (error) {
      console.warn('Failed to create hole WebGL display:', error);
      if (this.display) {
        this.display.destroy();
        this.display = null;
      }
    }
  }

  isLightTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  updateClipPath() {
    if (!this.holeElement) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isLightMode = this.isLightTheme();

    const logoAspectRatio = this.logoViewBox.width / this.logoViewBox.height;
    const viewportAspectRatio = viewportWidth / viewportHeight;

    let clipWidth;
    let clipHeight;
    let clipX;
    let clipY;

    if (viewportAspectRatio > logoAspectRatio) {
      clipWidth = viewportWidth;
      clipHeight = viewportWidth / logoAspectRatio;
      clipX = 0;
      clipY = (viewportHeight - clipHeight) / 2;
    } else {
      clipHeight = viewportHeight;
      clipWidth = viewportHeight * logoAspectRatio;
      clipX = (viewportWidth - clipWidth) / 2;
      clipY = 0;
    }

    const scaleX = clipWidth / this.logoViewBox.width;
    const scaleY = clipHeight / this.logoViewBox.height;
    const pathData = this.generateTransformedPath(clipX, clipY, scaleX, scaleY);

    let holeClipPath;
    if (isLightMode) {
      holeClipPath = `M0,0 L${viewportWidth},0 L${viewportWidth},${viewportHeight} L0,${viewportHeight} Z ${pathData}`;
      this.holeElement.style.clipPath = `path(evenodd, '${holeClipPath}')`;
      this.holeElement.style.webkitClipPath = `path(evenodd, '${holeClipPath}')`;
    } else {
      holeClipPath = pathData;
      this.holeElement.style.clipPath = `path('${holeClipPath}')`;
      this.holeElement.style.webkitClipPath = `path('${holeClipPath}')`;
    }

    if (this.shadowElement) {
      if (isLightMode) {
        this.shadowElement.style.clipPath = `path(evenodd, '${holeClipPath}')`;
        this.shadowElement.style.webkitClipPath = `path(evenodd, '${holeClipPath}')`;
      } else {
        this.shadowElement.style.clipPath = `path('${pathData}')`;
        this.shadowElement.style.webkitClipPath = `path('${pathData}')`;
      }

      const shadowScaleX = scaleX * this.shadowScale;
      const shadowScaleY = scaleY * this.shadowScale;
      const shadowClipX = clipX - (clipWidth * (this.shadowScale - 1)) / 2 + this.shadowOffsetX;
      const shadowClipY = clipY - (clipHeight * (this.shadowScale - 1)) / 2 + this.shadowOffsetY;
      const logoPathData = this.generateTransformedPath(
        shadowClipX,
        shadowClipY,
        shadowScaleX,
        shadowScaleY
      );

      if (isLightMode) {
        this.shadowElement.innerHTML = `
          <svg width="100%" height="100%" style="position:absolute;top:0;left:0;">
            <path d="${logoPathData}" fill="currentColor"/>
          </svg>
        `;
      } else {
        const shadowSvgPath = `M0,0 L${viewportWidth},0 L${viewportWidth},${viewportHeight} L0,${viewportHeight} Z ${logoPathData}`;
        this.shadowElement.innerHTML = `
          <svg width="100%" height="100%" style="position:absolute;top:0;left:0;">
            <path d="${shadowSvgPath}" fill="currentColor" fill-rule="evenodd"/>
          </svg>
        `;
      }
    }
  }

  handleScroll() {
    if (!this.display) return;

    if (this.scrollRaf) {
      return;
    }

    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = null;
      try {
        this.applyScrollUniform();
        this.display.draw();
      } catch (error) {
        console.warn('Failed to handle hole scroll:', error);
      }
    });
  }

  setupScrollListener() {
    try {
      window.addEventListener('scroll', this.handleScroll, { passive: true });
      window.addEventListener('resize', this.handleWindowResize, { passive: true });
    } catch (error) {
      console.warn('Failed to setup scroll listener:', error);
    }
  }

  setupThemeObserver() {
    try {
      this.themeObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            this.updateClipPath();
          }
        }
      });

      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    } catch (error) {
      console.warn('Failed to setup theme observer:', error);
    }
  }

  appendShadow() {
    if (document.getElementById('hole-shadow')) {
      this.shadowElement = document.getElementById('hole-shadow');
      return;
    }

    try {
      const shadow = document.createElement('div');
      shadow.id = 'hole-shadow';
      document.body.appendChild(shadow);
      this.shadowElement = shadow;
    } catch (error) {
      console.warn('Failed to append shadow element:', error);
    }
  }

  appendHole() {
    if (document.getElementById('hole')) {
      this.holeElement = document.getElementById('hole');
      return;
    }

    try {
      const hole = document.createElement('div');
      hole.id = 'hole';
      document.body.appendChild(hole);
      this.holeElement = hole;
    } catch (error) {
      console.warn('Failed to append hole element:', error);
    }
  }

  init() {
    if (this.isInitialized) return;

    try {
      this.lastViewportWidth = window.innerWidth;
      this.lastViewportHeight = window.innerHeight;

      this.appendShadow();
      this.appendHole();
      this.createDisplay();
      this.updateClipPath();
      this.handleScroll();
      this.setupScrollListener();
      this.setupThemeObserver();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Hole initialization failed:', error);
      this.isInitialized = true;
    }
  }

  getElement() {
    return this.holeElement;
  }

  getCanvas() {
    return this.display ? this.display.getCanvas() : null;
  }

  destroy() {
    if (this.scrollRaf) {
      cancelAnimationFrame(this.scrollRaf);
      this.scrollRaf = null;
    }

    if (this.resizeObserver) {
      try {
        this.resizeObserver.disconnect();
      } catch (error) {
        console.warn('Failed to disconnect resize observer:', error);
      }
      this.resizeObserver = null;
    }

    if (this.themeObserver) {
      try {
        this.themeObserver.disconnect();
      } catch (error) {
        console.warn('Failed to disconnect theme observer:', error);
      }
      this.themeObserver = null;
    }

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
    if (this.windowResizeTimeout) {
      clearTimeout(this.windowResizeTimeout);
      this.windowResizeTimeout = null;
    }

    try {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleWindowResize);
    } catch (error) {
      console.warn('Failed to remove event listeners:', error);
    }

    if (this.display) {
      this.display.destroy();
      this.display = null;
    }

    if (this.shadowElement && this.shadowElement.parentNode) {
      try {
        this.shadowElement.parentNode.removeChild(this.shadowElement);
      } catch (error) {
        console.warn('Failed to remove shadow element:', error);
      }
    }

    if (this.holeElement && this.holeElement.parentNode) {
      try {
        this.holeElement.parentNode.removeChild(this.holeElement);
      } catch (error) {
        console.warn('Failed to remove hole element:', error);
      }
    }

    this.shadowElement = null;
    this.holeElement = null;
    this.isInitialized = false;
  }
}

const hole = new Hole();

export default hole;
export { Hole };

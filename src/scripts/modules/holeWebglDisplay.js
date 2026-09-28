// Hole WebGL Display
// Fullscreen quad that samples a baked HTML texture with UV parallax scroll

const VERT_SRC = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision mediump float;

uniform sampler2D uTexture;
uniform float uScroll;
uniform float uTextureHeight;
uniform float uViewportHeight;
varying vec2 vUv;

void main() {
  if (uTextureHeight <= 0.0 || uViewportHeight <= 0.0) {
    discard;
  }

  // With UNPACK_FLIP_Y, upright sampling uses v=1 at canvas top, v=0 at bottom.
  // Scroll shifts the visible window down the baked texture (content moves up).
  float scrollN = uScroll / uTextureHeight;
  float screenFrac = uViewportHeight / uTextureHeight;
  float canvasY = scrollN + (1.0 - vUv.y) * screenFrac;
  float sampleY = 1.0 - canvasY;

  if (sampleY < 0.0 || sampleY > 1.0) {
    discard;
  }

  gl_FragColor = texture2D(uTexture, vec2(vUv.x, sampleY));
}
`;

/**
 * Compiles a WebGL shader
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 * @returns {WebGLShader|null}
 */
function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Hole WebGL shader compile failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Links a WebGL program
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vert
 * @param {WebGLShader} frag
 * @returns {WebGLProgram|null}
 */
function linkProgram(gl, vert, frag) {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Hole WebGL program link failed:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

class HoleWebglDisplay {
  constructor() {
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.buffer = null;
    this.texture = null;
    this.attribs = {};
    this.uniforms = {};
    this.scrollPx = 0;
    this.textureHeight = 0;
    this.viewportHeight = 0;
    this.lost = false;
    this.onContextLost = this.onContextLost.bind(this);
    this.onContextRestored = this.onContextRestored.bind(this);
  }

  /**
   * Creates a WebGL canvas and attaches it to the hole element
   * @param {HTMLElement} parent
   * @returns {boolean}
   */
  init(parent) {
    if (!parent) return false;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;

      const gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
      });

      if (!gl) {
        console.warn('Hole WebGL unavailable; using solid backstage fallback');
        return false;
      }

      const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
      const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
      if (!vert || !frag) {
        return false;
      }

      const program = linkProgram(gl, vert, frag);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      if (!program) {
        return false;
      }

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 0])
      );

      this.canvas = canvas;
      this.gl = gl;
      this.program = program;
      this.buffer = buffer;
      this.texture = texture;
      this.attribs = {
        aPosition: gl.getAttribLocation(program, 'aPosition'),
      };
      this.uniforms = {
        uTexture: gl.getUniformLocation(program, 'uTexture'),
        uScroll: gl.getUniformLocation(program, 'uScroll'),
        uTextureHeight: gl.getUniformLocation(program, 'uTextureHeight'),
        uViewportHeight: gl.getUniformLocation(program, 'uViewportHeight'),
      };

      canvas.addEventListener('webglcontextlost', this.onContextLost, false);
      canvas.addEventListener('webglcontextrestored', this.onContextRestored, false);

      parent.appendChild(canvas);
      return true;
    } catch (error) {
      console.warn('Hole WebGL init failed:', error);
      this.destroy();
      return false;
    }
  }

  onContextLost(event) {
    event.preventDefault();
    this.lost = true;
    console.warn('Hole WebGL context lost; falling back to solid backstage');
    if (this.canvas && this.canvas.parentNode) {
      try {
        this.canvas.parentNode.removeChild(this.canvas);
      } catch (error) {
        console.warn('Failed to remove hole canvas after context loss:', error);
      }
    }
  }

  onContextRestored() {
    this.lost = true;
  }

  /**
   * @param {HTMLCanvasElement} sourceCanvas
   */
  uploadTexture(sourceCanvas) {
    if (!this.gl || !this.texture || this.lost || !sourceCanvas) return;

    try {
      const gl = this.gl;
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
      this.textureHeight = sourceCanvas.height;
    } catch (error) {
      console.warn('Failed to upload hole texture:', error);
    }
  }

  /**
   * @param {number} scrollPx - Parallax offset in texture pixels
   */
  setScroll(scrollPx) {
    this.scrollPx = Math.max(0, scrollPx || 0);
  }

  /**
   * Resize the drawing buffer to match CSS size
   * @param {number} cssWidth
   * @param {number} cssHeight
   */
  resize(cssWidth, cssHeight) {
    if (!this.canvas || !this.gl || this.lost) return;

    const width = Math.max(1, Math.floor(cssWidth));
    const height = Math.max(1, Math.floor(cssHeight));

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }

    this.viewportHeight = height;
    this.gl.viewport(0, 0, width, height);
  }

  draw() {
    if (!this.gl || !this.program || this.lost || !this.canvas) return;

    try {
      const gl = this.gl;
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.enableVertexAttribArray(this.attribs.aPosition);
      gl.vertexAttribPointer(this.attribs.aPosition, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.uniform1i(this.uniforms.uTexture, 0);
      gl.uniform1f(this.uniforms.uScroll, this.scrollPx);
      gl.uniform1f(this.uniforms.uTextureHeight, this.textureHeight);
      gl.uniform1f(this.uniforms.uViewportHeight, this.viewportHeight || this.canvas.height);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } catch (error) {
      console.warn('Failed to draw hole WebGL frame:', error);
    }
  }

  getCanvas() {
    return this.canvas;
  }

  /**
   * @returns {number} Max 2D texture dimension supported by this context
   */
  getMaxTextureSize() {
    if (!this.gl) return 4096;
    try {
      return this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE) || 4096;
    } catch (error) {
      return 4096;
    }
  }

  destroy() {
    try {
      if (this.canvas) {
        this.canvas.removeEventListener('webglcontextlost', this.onContextLost, false);
        this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored, false);
      }

      const gl = this.gl;
      if (gl) {
        if (this.texture) gl.deleteTexture(this.texture);
        if (this.buffer) gl.deleteBuffer(this.buffer);
        if (this.program) gl.deleteProgram(this.program);
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      }

      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    } catch (error) {
      console.warn('Failed to destroy hole WebGL display:', error);
    }

    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.buffer = null;
    this.texture = null;
    this.attribs = {};
    this.uniforms = {};
    this.scrollPx = 0;
    this.textureHeight = 0;
    this.viewportHeight = 0;
    this.lost = false;
  }
}

/**
 * Tries to create a WebGL display attached to parent.
 * @param {HTMLElement} parent
 * @returns {HoleWebglDisplay|null}
 */
export function createHoleWebglDisplay(parent) {
  const display = new HoleWebglDisplay();
  if (!display.init(parent)) {
    display.destroy();
    return null;
  }
  return display;
}

export { HoleWebglDisplay };

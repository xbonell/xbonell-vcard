// Hole HTML Baker
// Tokenizes page HTML and paints syntax-highlighted monospace text onto an offscreen canvas

const COLORS = {
  tag: '#9c637a',
  attribute: '#994500',
  value: '#22a2c9',
  text: '#666666',
  punctuation: '#666666',
};

/**
 * Gets the page's HTML as text (minified)
 * @returns {string}
 */
export function getPageHTML() {
  try {
    let html = document.documentElement.outerHTML;

    html = html.replace(/\r?\n|\r/g, ' ');
    html = html.replace(/>\s+</g, '><');
    html = html.replace(/[ \t]{2,}/g, ' ');
    html = html.trim();

    return html;
  } catch (error) {
    console.warn('Failed to get page HTML:', error);
    return '';
  }
}

/**
 * Tokenizes HTML text for syntax highlighting
 * @param {string} html
 * @returns {Array<{ type: string, text: string }>}
 */
export function tokenizeHTML(html) {
  const tokens = [];
  let i = 0;
  let inTag = false;
  let inAttributeValue = false;
  let quoteChar = '';
  let currentToken = { type: 'text', text: '' };

  while (i < html.length) {
    const char = html[i];

    if (char === '<' && !inTag) {
      if (currentToken.text.trim()) {
        tokens.push(currentToken);
      }
      inTag = true;
      tokens.push({ type: 'punctuation', text: '<' });
      currentToken = { type: 'tag', text: '' };
    } else if (char === '>' && inTag) {
      if (currentToken.text) {
        tokens.push(currentToken);
      }
      tokens.push({ type: 'punctuation', text: '>' });
      inTag = false;
      inAttributeValue = false;
      currentToken = { type: 'text', text: '' };
    } else if (char === '/' && inTag && !inAttributeValue) {
      if (currentToken.text) {
        tokens.push(currentToken);
      }
      tokens.push({ type: 'punctuation', text: '/' });
      if (currentToken.type === 'tag') {
        currentToken = { type: 'tag', text: '' };
      }
    } else if (inTag && char === '=' && !inAttributeValue) {
      if (currentToken.text) {
        tokens.push(currentToken);
      }
      tokens.push({ type: 'punctuation', text: '=' });
      currentToken = { type: 'value', text: '' };
    } else if (inTag && (char === '"' || char === "'")) {
      if (!inAttributeValue && currentToken.type === 'value') {
        inAttributeValue = true;
        quoteChar = char;
        tokens.push({ type: 'punctuation', text: char });
      } else if (inAttributeValue && char === quoteChar) {
        if (currentToken.text) {
          tokens.push(currentToken);
        }
        tokens.push({ type: 'punctuation', text: char });
        inAttributeValue = false;
        currentToken = { type: 'attribute', text: '' };
      } else {
        currentToken.text += char;
      }
    } else if (inTag && char === ' ' && !inAttributeValue) {
      if (currentToken.text) {
        tokens.push(currentToken);
      }
      tokens.push({ type: 'punctuation', text: ' ' });
      if (currentToken.type === 'tag' || currentToken.type === 'attribute') {
        currentToken = { type: 'attribute', text: '' };
      }
    } else if (inTag) {
      if (inAttributeValue) {
        currentToken.text += char;
      } else if (currentToken.type === 'text') {
        currentToken = { type: 'tag', text: char };
      } else {
        currentToken.text += char;
      }
    } else {
      currentToken.text += char;
    }

    i++;
  }

  if (currentToken.text) {
    tokens.push(currentToken);
  }

  return tokens;
}

/**
 * Bakes syntax-highlighted page HTML onto an offscreen canvas.
 * @param {{ width: number, height: number }} options - Target texture size in CSS pixels
 * @returns {HTMLCanvasElement|null}
 */
export function bakeHoleHtml({ width, height }) {
  try {
    const bakeWidth = Math.max(1, Math.floor(width));
    const bakeHeight = Math.max(1, Math.floor(height));

    const canvas = document.createElement('canvas');
    canvas.width = bakeWidth;
    canvas.height = bakeHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Failed to get 2D context for hole HTML bake');
      return null;
    }

    const htmlText = getPageHTML();
    if (!htmlText) {
      return canvas;
    }

    const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
    const fontSize = Math.min(30, Math.max(14, 2 * vmin));
    const lineHeight = fontSize * 1.25;

    ctx.clearRect(0, 0, bakeWidth, bakeHeight);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    const tokens = tokenizeHTML(htmlText);
    const lines = [];
    let currentLineTokens = [];
    let currentLineWidth = 0;

    tokens.forEach((token) => {
      const tokenWidth = ctx.measureText(token.text).width;
      const testWidth = currentLineWidth + tokenWidth;

      if (testWidth > bakeWidth && currentLineTokens.length > 0) {
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

    let y = 0;
    for (const lineTokens of lines) {
      if (y >= bakeHeight) {
        break;
      }
      if (y + lineHeight > 0) {
        let lineX = 0;
        for (const lineToken of lineTokens) {
          ctx.fillStyle = COLORS[lineToken.type] || COLORS.text;
          ctx.fillText(lineToken.text, lineX, y);
          lineX += ctx.measureText(lineToken.text).width;
        }
      }
      y += lineHeight;
    }

    return canvas;
  } catch (error) {
    console.warn('Failed to bake hole HTML:', error);
    return null;
  }
}

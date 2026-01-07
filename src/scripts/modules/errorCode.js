// errorCode.js
// Detects HTTP error code from URL or page context and updates the error page title

/**
 * Extracts error code from various sources:
 * 1. URL path (e.g., /404.html, /error/404)
 * 2. Filename (e.g., 404.html)
 * 3. Query parameter (e.g., ?code=404)
 * 4. Common error page patterns
 */
const detectErrorCode = () => {
  const path = window.location.pathname;
  const search = window.location.search;
  const url = window.location.href;

  // Try to extract from query parameter first (e.g., ?code=404)
  const codeMatch = search.match(/[?&]code=(\d{3})/);
  if (codeMatch) {
    return codeMatch[1];
  }

  // Try to extract from URL path (e.g., /404.html, /error/404, /404/)
  const pathMatch = path.match(/\/(\d{3})(?:\.html|\/|$)/);
  if (pathMatch) {
    return pathMatch[1];
  }

  // Try to extract from filename in full URL
  const filenameMatch = url.match(/(\d{3})\.html/);
  if (filenameMatch) {
    return filenameMatch[1];
  }

  // Check for common error page patterns
  // Many hosting platforms serve error pages with specific names
  if (path.includes('404') || url.includes('404')) {
    return '404';
  }
  if (path.includes('500') || url.includes('500')) {
    return '500';
  }
  if (path.includes('403') || url.includes('403')) {
    return '403';
  }

  // If we're on an error page but can't detect the code, return null
  return null;
};

/**
 * Updates the error page H1 title with the detected error code
 */
const updateErrorTitle = () => {
  try {
    const errorCode = detectErrorCode();
    const titleElement = document.querySelector('.e__title');

    if (titleElement) {
      if (errorCode) {
        titleElement.textContent = errorCode;
      }
      // Trigger fade-in animation after updating (or if no code detected, show "Error")
      // Use requestAnimationFrame to ensure DOM update happens before animation
      requestAnimationFrame(() => {
        titleElement.classList.add('is-visible');
      });
    }
  } catch (error) {
    console.warn('Failed to update error title:', error);
  }
};

/**
 * Initialize error code detection and title update
 */
const init = () => {
  // Only run on error pages (pages with .e class or error layout)
  const errorPage = document.querySelector('.e');
  if (!errorPage) {
    return;
  }

  // Update immediately
  updateErrorTitle();

  // Also try to detect from response if available (for some hosting platforms)
  // This is a fallback for cases where the URL doesn't contain the code
  if (window.performance && window.performance.getEntriesByType) {
    const navigationEntries = window.performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0];
      // Some browsers expose response status in performance API
      if (navEntry.responseStatus && navEntry.responseStatus >= 400) {
        const titleElement = document.querySelector('.e__title');
        if (titleElement) {
          titleElement.textContent = String(navEntry.responseStatus);
          // Trigger fade-in animation
          requestAnimationFrame(() => {
            titleElement.classList.add('is-visible');
          });
        }
      }
    }
  }
};

export default { init };

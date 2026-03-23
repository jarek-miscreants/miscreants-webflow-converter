export const WEBFLOW_BREAKPOINTS = {
  xxl: { id: 'xxl', label: '1920', minWidth: 1920 },
  xl: { id: 'xl', label: '1440', minWidth: 1440 },
  main: { id: 'main', label: '992', minWidth: 992 },
  medium: { id: 'medium', label: 'medium', maxWidth: 991 },
  small: { id: 'small', label: 'small', maxWidth: 767 },
  tiny: { id: 'tiny', label: 'tiny', maxWidth: 478 },
};

export function mapMediaQuery(mediaQueryString) {
  if (!mediaQueryString) return null;

  const mq = mediaQueryString.trim().toLowerCase();

  const maxMatch = mq.match(/max-width\s*:\s*(\d+)/);
  const minMatch = mq.match(/min-width\s*:\s*(\d+)/);

  // Snap max-width to nearest Webflow breakpoint using midpoint ranges
  // Webflow: tiny ≤478, small ≤767, medium ≤991, desktop >991
  if (maxMatch) {
    const maxWidth = parseInt(maxMatch[1], 10);
    if (maxWidth <= 622) return 'tiny';     // midpoint between 478 and 767
    if (maxWidth <= 879) return 'small';    // midpoint between 767 and 991
    return 'medium';                        // anything above snaps to tablet
  }

  // min-width queries: anything >991 is desktop (base styles) — never create
  // additional breakpoints above desktop. Ignore all min-width queries.
  if (minMatch) {
    return null;
  }

  return null;
}

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

  if (maxMatch) {
    const maxWidth = parseInt(maxMatch[1], 10);
    if (maxWidth <= 480) return 'tiny';
    if (maxWidth <= 768) return 'small';
    if (maxWidth <= 991) return 'medium';
    return null;
  }

  if (minMatch) {
    const minWidth = parseInt(minMatch[1], 10);
    if (minWidth >= 1920) return 'xxl';
    if (minWidth >= 1440) return 'xl';
    return null;
  }

  return null;
}

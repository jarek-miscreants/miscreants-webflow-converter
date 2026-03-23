// Map Tailwind utility classes to Miscreants Starter classes and CSS properties

import { TW_SPACING_TO_VAR, TW_COLOR_TO_VAR, TW_COLOR_TO_HEX, themeText, themeBorder, themeBackground } from './tw-variables.js';
import { composeFlex } from './tw-parser.js';

// Direct Tailwind → Starter class mappings
const CLASS_MAP = {
  // Display
  'block': 'display-block', 'inline-block': 'display-inline-block',
  'inline': 'display-inline', 'inline-flex': 'display-inline-flex',
  'inline-grid': 'display-inline-grid', 'hidden': 'display-none', 'contents': 'display-contents',

  // Grid
  'grid': 'grid', 'grid-cols-1': 'grid', 'grid-cols-2': 'grid-column-2',
  'grid-cols-3': 'grid-column-3', 'grid-cols-4': 'grid-column-4',

  // Position
  'relative': 'position-relative', 'absolute': 'position-absolute',
  'fixed': 'position-fixed', 'sticky': 'position-sticky', 'static': 'position-static',

  // Z-index
  'z-0': 'zindex-0', 'z-10': 'zindex-1', 'z-20': 'zindex-2', 'z-30': 'zindex-3', 'z-auto': 'zindex-unset',

  // Width/Height
  'w-full': 'width-full', 'h-full': 'height-full', 'min-h-screen': 'min-height-screen',

  // Overflow
  'overflow-hidden': 'overflow-hidden', 'overflow-auto': 'overflow-auto',
  'overflow-scroll': 'overflow-scroll', 'overflow-visible': 'overflow-visible',
  'overflow-x-auto': 'overflow-x-auto', 'overflow-y-auto': 'overflow-y-auto',
  'overflow-clip': 'overflow-clip',

  // Border radius
  'rounded-none': 'radius-none', 'rounded-sm': 'radius-xsmall', 'rounded': 'radius-small',
  'rounded-md': 'radius-small', 'rounded-lg': 'radius-main', 'rounded-xl': 'radius-large',
  'rounded-2xl': 'radius-large', 'rounded-3xl': 'radius-large', 'rounded-full': 'radius-round',

  // Typography alignment
  'text-left': 'text-align-left', 'text-center': 'text-align-center', 'text-right': 'text-align-right',
  'uppercase': 'text-transform-uppercase', 'lowercase': 'text-transform-lowercase',
  'capitalize': 'text-transform-capitalize', 'normal-case': 'text-transform-none',

  // Text size → Starter typography classes
  'text-xs': 'text-size-tiny', 'text-sm': 'text-size-small', 'text-base': 'text-size-regular',
  'text-lg': 'text-size-large', 'text-xl': 'text-size-large',
  'text-2xl': 'heading-style-h5', 'text-3xl': 'heading-style-h4',
  'text-4xl': 'heading-style-h3', 'text-5xl': 'heading-style-h2',
  'text-6xl': 'heading-style-h1', 'text-7xl': 'heading-style-display',
  'text-8xl': 'heading-style-display', 'text-9xl': 'heading-style-display',

  // Font weight
  'font-thin': 'text-weight-light', 'font-extralight': 'text-weight-light',
  'font-light': 'text-weight-light', 'font-normal': 'text-weight-normal',
  'font-medium': 'text-weight-medium', 'font-semibold': 'text-weight-bold',
  'font-bold': 'text-weight-bold', 'font-extrabold': 'text-weight-bold', 'font-black': 'text-weight-bold',

  // Line clamp
  'line-clamp-1': 'line-clamp-1', 'line-clamp-2': 'line-clamp-2',
  'line-clamp-3': 'line-clamp-3', 'line-clamp-4': 'line-clamp-4',

  // Flex utilities
  'flex-grow': 'flex-grow', 'flex-shrink': 'flex-shrink',
  'flex-shrink-0': 'flex-noshrink', 'shrink-0': 'flex-noshrink', 'grow': 'flex-grow',

  // Aspect ratio
  'aspect-square': 'ratio-1-1', 'aspect-video': 'ratio-16-9',

  // Pointer
  'pointer-events-none': 'pointer-off', 'pointer-events-auto': 'pointer-on',

  // SR only
  'sr-only': 'sr-only',

  // Align self
  'self-auto': 'align-self-auto', 'self-start': 'align-self-start',
  'self-center': 'align-self-center', 'self-end': 'align-self-end', 'self-stretch': 'align-self-stretch',

  // Order
  'order-first': 'order-first', 'order-last': 'order-last',

  // Cover
  'inset-0': 'cover-absolute', 'object-cover': 'cover',

  // Max width
  'max-w-none': 'max-width-none', 'max-w-xs': 'max-width-small',
  'max-w-sm': 'max-width-small', 'max-w-md': 'max-width-medium',
  'max-w-lg': 'max-width-large', 'max-w-xl': 'max-width-xlarge',
  'max-w-2xl': 'max-width-xxlarge', 'max-w-3xl': 'max-width-xxlarge',
  'max-w-4xl': 'max-width-xxlarge', 'max-w-5xl': 'max-width-xxlarge',
  'max-w-6xl': 'max-width-xxlarge', 'max-w-7xl': 'max-width-xxlarge',

  // Container
  'container': 'container-large',

  // Border
  'border': 'border', 'border-0': null, 'border-2': null,
};

// Tailwind classes → CSS properties (not Starter classes)
const CSS_MAP = {
  // Text wrapping
  'text-pretty': { 'text-wrap': 'pretty' },
  'text-balance': { 'text-wrap': 'balance' },
  'text-wrap': { 'text-wrap': 'wrap' },
  'text-nowrap': { 'text-wrap': 'nowrap' },
  'truncate': { overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' },
  'whitespace-nowrap': { 'white-space': 'nowrap' },
  'whitespace-normal': { 'white-space': 'normal' },
  'whitespace-pre': { 'white-space': 'pre' },

  // Tracking (letter-spacing)
  'tracking-tighter': { 'letter-spacing': '-0.05em' },
  'tracking-tight': { 'letter-spacing': '-0.025em' },
  'tracking-normal': { 'letter-spacing': '0em' },
  'tracking-wide': { 'letter-spacing': '0.025em' },
  'tracking-wider': { 'letter-spacing': '0.05em' },
  'tracking-widest': { 'letter-spacing': '0.1em' },

  // Leading (line-height)
  'leading-none': { 'line-height': '1' },
  'leading-tight': { 'line-height': '1.25' },
  'leading-snug': { 'line-height': '1.375' },
  'leading-normal': { 'line-height': '1.5' },
  'leading-relaxed': { 'line-height': '1.625' },
  'leading-loose': { 'line-height': '2' },

  // Misc
  'antialiased': { '-webkit-font-smoothing': 'antialiased' },
  'subpixel-antialiased': { '-webkit-font-smoothing': 'auto' },
  'cursor-pointer': { cursor: 'pointer' },
  'cursor-default': { cursor: 'default' },
  'cursor-not-allowed': { cursor: 'not-allowed' },
  'select-none': { 'user-select': 'none' },
  'select-all': { 'user-select': 'all' },
  'select-text': { 'user-select': 'text' },

  // Position values
  'top-0': { top: '0' }, 'right-0': { right: '0' },
  'bottom-0': { bottom: '0' }, 'left-0': { left: '0' },
  'inset-x-0': { left: '0', right: '0' },
  'inset-y-0': { top: '0', bottom: '0' },

  // Border style
  'border-solid': { 'border-style': 'solid' },
  'border-dashed': { 'border-style': 'dashed' },
  'border-dotted': { 'border-style': 'dotted' },
  'border-none': { 'border-style': 'none' },

  // Object fit
  'object-contain': { 'object-fit': 'contain' },
  'object-cover': { 'object-fit': 'cover' },
  'object-fill': { 'object-fit': 'fill' },
  'object-none': { 'object-fit': 'none' },
};

// Tailwind spacing scale → rem values
const TW_SPACING_REM = {
  '0': '0', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem',
  '2': '0.5rem', '2.5': '0.625rem', '3': '0.75rem', '3.5': '0.875rem',
  '4': '1rem', '5': '1.25rem', '6': '1.5rem', '7': '1.75rem',
  '8': '2rem', '9': '2.25rem', '10': '2.5rem', '11': '2.75rem',
  '12': '3rem', '14': '3.5rem', '16': '4rem', '20': '5rem',
  '24': '6rem', '28': '7rem', '32': '8rem', '36': '9rem',
  '40': '10rem', '44': '11rem', '48': '12rem', '52': '13rem',
  '56': '14rem', '60': '15rem', '64': '16rem', '72': '18rem',
  '80': '20rem', '96': '24rem', 'px': '1px',
};

// Map spacing value to Starter level (0-8)
function toStarterLevel(val) {
  if (val === 'auto' || val === 'px') return null;
  const num = parseFloat(val);
  if (isNaN(num)) return null;
  if (num === 0) return '0';
  if (num <= 2) return '1';
  if (num <= 3) return '2';
  if (num <= 4) return '3';
  if (num <= 6) return '4';
  if (num <= 8) return '5';
  if (num <= 10) return '6';
  if (num <= 12) return '7';
  return '8';
}

// Resolve a Tailwind color to a variable or hex
function resolveColor(colorName) {
  if (TW_COLOR_TO_VAR[colorName]) return TW_COLOR_TO_VAR[colorName];
  if (TW_COLOR_TO_HEX[colorName]) return TW_COLOR_TO_HEX[colorName];
  if (colorName.startsWith('[') && colorName.endsWith(']')) return colorName.slice(1, -1);
  return null;
}

// Convert a single Tailwind class to Starter classes + CSS
function mapSingleClass(cls) {
  // Strip Tailwind's line-height modifier: text-base/7 → text-base
  const slashIdx = cls.indexOf('/');
  const cleanCls = slashIdx > 0 && !cls.startsWith('grid-cols') ? cls.slice(0, slashIdx) : cls;

  // Direct class mapping
  if (CLASS_MAP[cleanCls] !== undefined) {
    if (CLASS_MAP[cleanCls] === null) return { classes: [], css: {} }; // mapped to nothing
    return { classes: [CLASS_MAP[cleanCls]], css: {} };
  }

  // CSS property mapping
  if (CSS_MAP[cleanCls]) {
    return { classes: [], css: { ...CSS_MAP[cleanCls] } };
  }

  // Gap: gap-4, gap-x-8, gap-y-10
  const gapMatch = cls.match(/^gap(-x|-y)?-(\d+\.?\d*)$/);
  if (gapMatch) {
    const [, axis, val] = gapMatch;
    const level = toStarterLevel(val);
    if (level !== null) {
      if (!axis) return { classes: [`gap-${level}`], css: {} };
      // gap-x/gap-y → CSS properties
      const rem = TW_SPACING_REM[val] || `${val * 0.25}rem`;
      if (axis === '-x') return { classes: [], css: { 'grid-column-gap': rem } };
      if (axis === '-y') return { classes: [], css: { 'grid-row-gap': rem } };
    }
  }

  // Spacing: p-4, pt-8, mx-auto, etc.
  const spacingPrefixes = [
    { re: /^p-(\d+\.?\d*)$/, classes: (l) => [`p-block-${l}`, `p-inline-${l}`] },
    { re: /^px-(\d+\.?\d*)$/, classes: (l) => [`p-inline-${l}`] },
    { re: /^py-(\d+\.?\d*)$/, classes: (l) => [`p-block-${l}`] },
    { re: /^pt-(\d+\.?\d*)$/, classes: (l) => [`pt-${l}`] },
    { re: /^pb-(\d+\.?\d*)$/, classes: (l) => [`pb-${l}`] },
    { re: /^pl-(\d+\.?\d*)$/, classes: (l) => [`pl-${l}`] },
    { re: /^pr-(\d+\.?\d*)$/, classes: (l) => [`pr-${l}`] },
    { re: /^m-(\d+\.?\d*)$/, classes: (l) => [`mt-${l}`, `mb-${l}`, `ml-${l}`, `mr-${l}`] },
    { re: /^mx-(\d+\.?\d*)$/, classes: (l) => [`mx-${l}`] },
    { re: /^my-(\d+\.?\d*)$/, classes: (l) => [`my-${l}`] },
    { re: /^mt-(\d+\.?\d*)$/, classes: (l) => [`mt-${l}`] },
    { re: /^mb-(\d+\.?\d*)$/, classes: (l) => [`mb-${l}`] },
    { re: /^ml-(\d+\.?\d*)$/, classes: (l) => [`ml-${l}`] },
    { re: /^mr-(\d+\.?\d*)$/, classes: (l) => [`mr-${l}`] },
  ];
  for (const { re, classes } of spacingPrefixes) {
    const m = cls.match(re);
    if (m) {
      const level = toStarterLevel(m[1]);
      if (level !== null) return { classes: classes(level), css: {} };
    }
  }

  // mx-auto
  if (cls === 'mx-auto') return { classes: [], css: { 'margin-left': 'auto', 'margin-right': 'auto' } };
  if (cls === 'ml-auto') return { classes: [], css: { 'margin-left': 'auto' } };
  if (cls === 'mr-auto') return { classes: [], css: { 'margin-right': 'auto' } };

  // Size: size-10, w-12, h-12
  const sizeMatch = cls.match(/^(size|w|h)-(\d+\.?\d*)$/);
  if (sizeMatch) {
    const [, prop, val] = sizeMatch;
    const rem = TW_SPACING_REM[val] || `${parseFloat(val) * 0.25}rem`;
    if (prop === 'size') return { classes: [], css: { width: rem, height: rem } };
    if (prop === 'w') return { classes: [], css: { width: rem } };
    if (prop === 'h') return { classes: [], css: { height: rem } };
  }

  // Position values: top-4, left-1/2, etc.
  const posMatch = cls.match(/^(top|right|bottom|left)-(\d+\.?\d*)$/);
  if (posMatch) {
    const [, prop, val] = posMatch;
    const rem = TW_SPACING_REM[val] || `${parseFloat(val) * 0.25}rem`;
    return { classes: [], css: { [prop]: rem } };
  }

  // Text color: text-gray-900, text-white, text-indigo-400
  const textColor = cls.match(/^text-((?:[a-z]+-\d+|white|black|\[.*?\]))$/);
  if (textColor) {
    const color = resolveColor(textColor[1]);
    if (color) return { classes: [], css: { color } };
  }

  // Background color
  const bgColor = cls.match(/^bg-((?:[a-z]+-\d+|white|black|transparent|\[.*?\]))$/);
  if (bgColor) {
    const color = resolveColor(bgColor[1]);
    if (color) return { classes: [], css: { 'background-color': color } };
  }

  // Border color
  const borderColor = cls.match(/^border-((?:[a-z]+-\d+|white|black|transparent|\[.*?\]))$/);
  if (borderColor && !['solid', 'dashed', 'dotted', 'none', '0', '2', '4', '8'].includes(borderColor[1])) {
    const color = resolveColor(borderColor[1]);
    if (color) return { classes: [], css: { 'border-color': color } };
  }

  // Border width
  if (cls === 'border-0') return { classes: [], css: { 'border-width': '0px' } };
  if (cls === 'border-2') return { classes: [], css: { 'border-width': '2px' } };
  if (cls === 'border-4') return { classes: [], css: { 'border-width': '4px' } };

  // Opacity
  const opacityMatch = cls.match(/^opacity-(\d+)$/);
  if (opacityMatch) return { classes: [], css: { opacity: String(parseInt(opacityMatch[1]) / 100) } };

  // Arbitrary values: w-[200px], bg-[#ff0000], etc.
  const arbitrary = cls.match(/^([\w-]+)-\[(.+)\]$/);
  if (arbitrary) {
    const [, prop, value] = arbitrary;
    const cssProp = ARBITRARY_PROP_MAP[prop];
    if (cssProp) return { classes: [], css: { [cssProp]: value } };
  }

  // Unrecognized → convert to CSS inline, NOT a class name
  // This prevents invalid characters (like /) from entering Webflow class names
  return { classes: [], css: {} };
}

const ARBITRARY_PROP_MAP = {
  'w': 'width', 'h': 'height', 'min-w': 'min-width', 'min-h': 'min-height',
  'max-w': 'max-width', 'max-h': 'max-height', 'top': 'top', 'right': 'right',
  'bottom': 'bottom', 'left': 'left', 'p': 'padding', 'px': 'padding-inline',
  'py': 'padding-block', 'pt': 'padding-top', 'pb': 'padding-bottom',
  'pl': 'padding-left', 'pr': 'padding-right', 'm': 'margin', 'mt': 'margin-top',
  'mb': 'margin-bottom', 'ml': 'margin-left', 'mr': 'margin-right',
  'gap': 'gap', 'text': 'font-size', 'tracking': 'letter-spacing',
  'leading': 'line-height', 'bg': 'background-color', 'border': 'border-width',
  'rounded': 'border-radius', 'size': 'width',
};

// Sanitize class name for Webflow (no /, no [, no special chars)
function sanitizeClassName(name) {
  return name.replace(/[^a-zA-Z0-9_-]/g, '-');
}

// Main export
export function mapTailwindToStarter(twClasses) {
  const { flexClass, remaining } = composeFlex(twClasses);

  const starterClasses = [];
  const cssProperties = {};

  if (flexClass) starterClasses.push(flexClass);

  for (const cls of remaining) {
    if (['flex', 'flex-col', 'flex-row', 'flex-col-reverse', 'flex-row-reverse',
         'items-start', 'items-center', 'items-end', 'items-stretch', 'items-baseline',
         'justify-start', 'justify-center', 'justify-end', 'justify-between',
         'justify-around', 'justify-evenly', 'inline-flex'].includes(cls)) {
      continue;
    }

    const mapped = mapSingleClass(cls);
    if (mapped) {
      // Sanitize all class names before adding
      starterClasses.push(...mapped.classes.map(sanitizeClassName));
      Object.assign(cssProperties, mapped.css);
    }
  }

  return { starterClasses, cssProperties };
}

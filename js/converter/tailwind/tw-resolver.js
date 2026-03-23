// Tailwind class resolver — converts class arrays to CSS properties
import { TW, SPACING, COLORS, RADIUS } from './tw-classes.js';

// Resolve a color reference like "neutral-500" or "white" to hex
function resolveColor(colorRef) {
  if (COLORS[colorRef] && typeof COLORS[colorRef] === 'string') return COLORS[colorRef];
  const match = colorRef.match(/^([a-z]+)-(\d+)$/);
  if (match && COLORS[match[1]] && COLORS[match[1]][match[2]]) {
    return COLORS[match[1]][match[2]];
  }
  return null;
}

// Resolve custom theme color tokens to CSS variables
// bg-background → var(--background), text-muted-foreground → var(--muted-foreground)
function resolveThemeColor(name) {
  // Known custom theme token patterns (shadcn/ui, etc.)
  const themeTokens = /^(background|foreground|border|input|ring|primary|secondary|accent|destructive|muted|card|popover|muted-foreground|primary-foreground|secondary-foreground|accent-foreground|destructive-foreground|card-foreground|popover-foreground)$/;
  if (themeTokens.test(name)) return `var(--${name})`;
  // Any single-word name that looks like a token (no numbers, no hyphened-shade)
  if (/^[a-z]+(-[a-z]+)*$/.test(name) && !COLORS[name] && !name.match(/^\d/)) {
    return `var(--${name})`;
  }
  return null;
}

// Resolve a spacing value: number → rem, "px" → 1px, "[13px]" → 13px
function resolveSpacing(val) {
  if (SPACING[val]) return SPACING[val];
  if (val.startsWith('[') && val.endsWith(']')) return val.slice(1, -1);
  const num = parseFloat(val);
  if (!isNaN(num)) return `${num * 0.25}rem`;
  return null;
}

// Check if a class looks like a Tailwind utility
const TW_PREFIXES = /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|w|h|min-w|min-h|max-w|max-h|size|top|right|bottom|left|inset|text|bg|border|rounded|z|opacity|order|basis|space-x|space-y|tracking|leading|font|ring|shadow|duration|delay|ease|scale|rotate|translate-x|translate-y|skew-x|skew-y|origin|columns|col-span|row-span|grid-cols|grid-rows)-/;

export function isTailwindClass(cls) {
  if (TW[cls]) return true;
  if (TW_PREFIXES.test(cls)) return true;
  if (cls.startsWith('-')) return true; // negative values
  if (cls.includes(':')) return true; // responsive/state prefix
  // Common Tailwind keywords
  if (['flex', 'grid', 'block', 'hidden', 'inline', 'relative', 'absolute', 'fixed', 'sticky',
       'static', 'visible', 'invisible', 'collapse', 'grow', 'shrink', 'truncate',
       'uppercase', 'lowercase', 'capitalize', 'italic', 'underline', 'overline',
       'line-through', 'antialiased', 'sr-only', 'not-sr-only', 'contents',
       'overflow-auto', 'overflow-hidden', 'overflow-visible', 'overflow-scroll'].includes(cls)) return true;
  return false;
}

// Resolve a single Tailwind class to CSS properties
function resolveClass(cls) {
  // Static lookup
  if (TW[cls]) return { ...TW[cls] };

  // Negative prefix
  const isNeg = cls.startsWith('-');
  const posCls = isNeg ? cls.slice(1) : cls;

  // Arbitrary values: property-[value]
  const arbMatch = cls.match(/^([a-z-]+)-\[(.+)\]$/);
  if (arbMatch) {
    return resolveArbitrary(arbMatch[1], arbMatch[2], isNeg);
  }

  // ── Spacing: p-4, px-2, mt-8, gap-6, etc. ──
  const spacingPatterns = [
    { re: /^p-(.+)$/, props: (v) => ({ 'padding-top': v, 'padding-right': v, 'padding-bottom': v, 'padding-left': v }) },
    { re: /^px-(.+)$/, props: (v) => ({ 'padding-left': v, 'padding-right': v }) },
    { re: /^py-(.+)$/, props: (v) => ({ 'padding-top': v, 'padding-bottom': v }) },
    { re: /^pt-(.+)$/, props: (v) => ({ 'padding-top': v }) },
    { re: /^pr-(.+)$/, props: (v) => ({ 'padding-right': v }) },
    { re: /^pb-(.+)$/, props: (v) => ({ 'padding-bottom': v }) },
    { re: /^pl-(.+)$/, props: (v) => ({ 'padding-left': v }) },
    { re: /^m-(.+)$/, props: (v) => ({ 'margin-top': v, 'margin-right': v, 'margin-bottom': v, 'margin-left': v }) },
    { re: /^mx-(.+)$/, props: (v) => ({ 'margin-left': v, 'margin-right': v }) },
    { re: /^my-(.+)$/, props: (v) => ({ 'margin-top': v, 'margin-bottom': v }) },
    { re: /^mt-(.+)$/, props: (v) => ({ 'margin-top': v }) },
    { re: /^mr-(.+)$/, props: (v) => ({ 'margin-right': v }) },
    { re: /^mb-(.+)$/, props: (v) => ({ 'margin-bottom': v }) },
    { re: /^ml-(.+)$/, props: (v) => ({ 'margin-left': v }) },
    { re: /^gap-(.+)$/, props: (v) => ({ 'grid-column-gap': v, 'grid-row-gap': v }) },
    { re: /^gap-x-(.+)$/, props: (v) => ({ 'grid-column-gap': v }) },
    { re: /^gap-y-(.+)$/, props: (v) => ({ 'grid-row-gap': v }) },
    { re: /^space-x-(.+)$/, props: (v) => ({ 'column-gap': v }) },
    { re: /^space-y-(.+)$/, props: (v) => ({ 'row-gap': v }) },
  ];

  for (const { re, props } of spacingPatterns) {
    const m = posCls.match(re);
    if (m) {
      if (m[1] === 'auto') return props('auto');
      const val = resolveSpacing(m[1]);
      if (val) return props(isNeg ? `-${val}` : val);
    }
  }

  // ── Sizing: w-12, h-8, size-6 ──
  const sizePatterns = [
    { re: /^w-(.+)$/, prop: 'width' },
    { re: /^h-(.+)$/, prop: 'height' },
    { re: /^size-(.+)$/, prop: null }, // both
    { re: /^min-w-(.+)$/, prop: 'min-width' },
    { re: /^min-h-(.+)$/, prop: 'min-height' },
    { re: /^max-w-(.+)$/, prop: 'max-width' },
    { re: /^max-h-(.+)$/, prop: 'max-height' },
    { re: /^basis-(.+)$/, prop: 'flex-basis' },
  ];

  for (const { re, prop } of sizePatterns) {
    const m = posCls.match(re);
    if (m) {
      // Check static lookup first (w-full, h-screen, etc.)
      if (TW[posCls]) return { ...TW[posCls] };
      // Fraction
      const fracMatch = m[1].match(/^(\d+)\/(\d+)$/);
      if (fracMatch) {
        const pct = `${(parseInt(fracMatch[1]) / parseInt(fracMatch[2]) * 100).toFixed(6).replace(/\.?0+$/, '')}%`;
        if (prop === null) return { width: pct, height: pct };
        return { [prop]: pct };
      }
      const val = resolveSpacing(m[1]);
      if (val) {
        if (prop === null) return { width: val, height: val };
        return { [prop]: val };
      }
    }
  }

  // ── Position values: top-4, left-1/2, inset-x-4 ──
  const posPatterns = [
    { re: /^top-(.+)$/, props: (v) => ({ top: v }) },
    { re: /^right-(.+)$/, props: (v) => ({ right: v }) },
    { re: /^bottom-(.+)$/, props: (v) => ({ bottom: v }) },
    { re: /^left-(.+)$/, props: (v) => ({ left: v }) },
    { re: /^inset-(.+)$/, props: (v) => ({ top: v, right: v, bottom: v, left: v }) },
    { re: /^inset-x-(.+)$/, props: (v) => ({ left: v, right: v }) },
    { re: /^inset-y-(.+)$/, props: (v) => ({ top: v, bottom: v }) },
  ];

  for (const { re, props } of posPatterns) {
    const m = posCls.match(re);
    if (m) {
      if (TW[posCls]) return { ...TW[posCls] };
      if (m[1] === 'auto') return props('auto');
      const fracMatch = m[1].match(/^(\d+)\/(\d+)$/);
      if (fracMatch) {
        return props(`${(parseInt(fracMatch[1]) / parseInt(fracMatch[2]) * 100).toFixed(6).replace(/\.?0+$/, '')}%`);
      }
      const val = resolveSpacing(m[1]);
      if (val) return props(isNeg ? `-${val}` : val);
    }
  }

  // ── Colors: text-red-500, bg-neutral-100, border-gray-300 ──
  // Also handles custom theme tokens: bg-background, text-foreground, border-border
  // These map to CSS variables: var(--background), var(--foreground), var(--border)
  const colorPatterns = [
    { re: /^text-(.+)$/, prop: 'color' },
    { re: /^bg-(.+)$/, prop: 'background-color' },
    { re: /^fill-(.+)$/, prop: 'fill' },
    { re: /^stroke-(.+)$/, prop: 'stroke' },
  ];

  for (const { re, prop } of colorPatterns) {
    const m = cls.match(re);
    if (m && prop) {
      // Skip if it's a text-size, text-align, or other non-color text utility
      if (re.source === '^text-(.+)$' && (TW[cls] || /^(xs|sm|base|lg|xl|\d+xl|left|center|right|justify|wrap|nowrap|ellipsis|clip|pretty|balance)$/.test(m[1]))) continue;
      const color = resolveColor(m[1]);
      if (color) return { [prop]: color };
      // Handle opacity modifier: bg-foreground/40 → var(--foreground) with opacity
      const opacityMatch = m[1].match(/^(.+?)\/(\[?.+?\]?)$/);
      if (opacityMatch) {
        const baseColor = resolveColor(opacityMatch[1]) || resolveThemeColor(opacityMatch[1]);
        if (baseColor) {
          const opVal = opacityMatch[2].replace(/[\[\]]/g, '');
          const opacity = opVal.includes('.') || parseFloat(opVal) <= 1 ? opVal : String(parseFloat(opVal) / 100);
          return { [prop]: baseColor, opacity };
        }
      }
      // Fallback: custom theme token → var(--name)
      const themeColor = resolveThemeColor(m[1]);
      if (themeColor) return { [prop]: themeColor };
    }
  }

  // Border color: border-border, border-red-500, border-foreground
  const borderColorMatch = cls.match(/^border-(.+)$/);
  if (borderColorMatch && !/^\d+$/.test(borderColorMatch[1]) && !['solid','dashed','dotted','none','collapse'].includes(borderColorMatch[1]) && !borderColorMatch[1].match(/^[trbl]$/)) {
    const colorVal = borderColorMatch[1];
    // Check for opacity modifier
    const opMod = colorVal.match(/^(.+?)\/(.+)$/);
    const baseRef = opMod ? opMod[1] : colorVal;
    const color = resolveColor(baseRef) || resolveThemeColor(baseRef);
    if (color) return { 'border-top-color': color, 'border-right-color': color, 'border-bottom-color': color, 'border-left-color': color };
  }

  // ── Border width: border, border-2, border-t, border-b, border-t-2 ──
  if (cls === 'border') return { 'border-top-width': '1px', 'border-right-width': '1px', 'border-bottom-width': '1px', 'border-left-width': '1px' };
  // Single-side border shorthand: border-t, border-b, border-l, border-r (= 1px)
  const borderSideOnly = cls.match(/^border-([trbl])$/);
  if (borderSideOnly) {
    const sideMap = { t: 'top', r: 'right', b: 'bottom', l: 'left' };
    return { [`border-${sideMap[borderSideOnly[1]]}-width`]: '1px' };
  }
  const borderWidthMatch = cls.match(/^border(-[trbl])?-(\d+)$/);
  if (borderWidthMatch) {
    const val = `${borderWidthMatch[2]}px`;
    const side = borderWidthMatch[1];
    if (!side) return { 'border-top-width': val, 'border-right-width': val, 'border-bottom-width': val, 'border-left-width': val };
    const sideMap = { '-t': 'top', '-r': 'right', '-b': 'bottom', '-l': 'left' };
    return { [`border-${sideMap[side]}-width`]: val };
  }

  // ── Border radius: rounded, rounded-lg, rounded-t-lg ──
  const roundedMatch = cls.match(/^rounded(?:-([trbl]{1,2}|tl|tr|bl|br))?(?:-(.+))?$/);
  if (roundedMatch) {
    const side = roundedMatch[1];
    const size = roundedMatch[2] || 'DEFAULT';
    const val = RADIUS[size] || resolveSpacing(size) || size;
    if (!side) return { 'border-top-left-radius': val, 'border-top-right-radius': val, 'border-bottom-right-radius': val, 'border-bottom-left-radius': val };
    const cornerMap = {
      't': ['border-top-left-radius', 'border-top-right-radius'],
      'r': ['border-top-right-radius', 'border-bottom-right-radius'],
      'b': ['border-bottom-left-radius', 'border-bottom-right-radius'],
      'l': ['border-top-left-radius', 'border-bottom-left-radius'],
      'tl': ['border-top-left-radius'],
      'tr': ['border-top-right-radius'],
      'bl': ['border-bottom-left-radius'],
      'br': ['border-bottom-right-radius'],
    };
    const corners = cornerMap[side];
    if (corners) {
      const result = {};
      corners.forEach(c => result[c] = val);
      return result;
    }
  }

  // ── Font family: font-mono, font-sans, font-serif ──
  if (cls === 'font-mono') return { 'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' };
  if (cls === 'font-sans') return { 'font-family': 'ui-sans-serif, system-ui, sans-serif' };
  if (cls === 'font-serif') return { 'font-family': 'ui-serif, Georgia, Cambria, serif' };

  // ── Z-index dynamic: z-[50] ──
  const zMatch = cls.match(/^z-(\d+)$/);
  if (zMatch) return { 'z-index': zMatch[1] };

  // ── Opacity dynamic ──
  const opMatch = cls.match(/^opacity-(\d+)$/);
  if (opMatch) return { opacity: String(parseInt(opMatch[1]) / 100) };

  // ── Order dynamic ──
  const orderMatch = cls.match(/^order-(\d+)$/);
  if (orderMatch) return { order: orderMatch[1] };

  // ── Duration ──
  const durMatch = cls.match(/^duration-(\d+)$/);
  if (durMatch) return { 'transition-duration': `${durMatch[1]}ms` };

  // ── Delay ──
  const delayMatch = cls.match(/^delay-(\d+)$/);
  if (delayMatch) return { 'transition-delay': `${delayMatch[1]}ms` };

  // ── Tracking (letter-spacing) with arbitrary ──
  const trackMatch = cls.match(/^tracking-\[(.+)\]$/);
  if (trackMatch) return { 'letter-spacing': trackMatch[1] };

  // ── Leading (line-height) with arbitrary ──
  const leadMatch = cls.match(/^leading-\[(.+)\]$/);
  if (leadMatch) return { 'line-height': leadMatch[1] };

  // ── Text size with arbitrary ──
  const textSizeMatch = cls.match(/^text-\[(.+)\]$/);
  if (textSizeMatch) return { 'font-size': textSizeMatch[1] };

  // ── Font weight dynamic ──
  const fwMatch = cls.match(/^font-\[(\d+)\]$/);
  if (fwMatch) return { 'font-weight': fwMatch[1] };

  // ── Grid columns dynamic ──
  const gridColMatch = cls.match(/^grid-cols-(\d+)$/);
  if (gridColMatch) return { 'grid-template-columns': `repeat(${gridColMatch[1]}, minmax(0, 1fr))` };

  // ── Col/Row span dynamic ──
  const colSpanMatch = cls.match(/^col-span-(\d+)$/);
  if (colSpanMatch) return { 'grid-column': `span ${colSpanMatch[1]} / span ${colSpanMatch[1]}` };
  const rowSpanMatch = cls.match(/^row-span-(\d+)$/);
  if (rowSpanMatch) return { 'grid-row': `span ${rowSpanMatch[1]} / span ${rowSpanMatch[1]}` };

  // Not recognized
  return null;
}

// Resolve arbitrary value patterns: p-[13px], bg-[#ff0], rounded-[3px]
function resolveArbitrary(prefix, value, isNeg) {
  const v = isNeg ? `-${value}` : value;
  const propMap = {
    'w': { width: v }, 'h': { height: v }, 'size': { width: v, height: v },
    'min-w': { 'min-width': v }, 'min-h': { 'min-height': v },
    'max-w': { 'max-width': v }, 'max-h': { 'max-height': v },
    'p': { 'padding-top': v, 'padding-right': v, 'padding-bottom': v, 'padding-left': v },
    'px': { 'padding-left': v, 'padding-right': v },
    'py': { 'padding-top': v, 'padding-bottom': v },
    'pt': { 'padding-top': v }, 'pr': { 'padding-right': v },
    'pb': { 'padding-bottom': v }, 'pl': { 'padding-left': v },
    'm': { 'margin-top': v, 'margin-right': v, 'margin-bottom': v, 'margin-left': v },
    'mx': { 'margin-left': v, 'margin-right': v },
    'my': { 'margin-top': v, 'margin-bottom': v },
    'mt': { 'margin-top': v }, 'mr': { 'margin-right': v },
    'mb': { 'margin-bottom': v }, 'ml': { 'margin-left': v },
    'gap': { 'grid-column-gap': v, 'grid-row-gap': v },
    'gap-x': { 'grid-column-gap': v }, 'gap-y': { 'grid-row-gap': v },
    'top': { top: v }, 'right': { right: v },
    'bottom': { bottom: v }, 'left': { left: v },
    'inset': { top: v, right: v, bottom: v, left: v },
    'inset-x': { left: v, right: v }, 'inset-y': { top: v, bottom: v },
    'text': { 'font-size': v },
    'leading': { 'line-height': v },
    'tracking': { 'letter-spacing': v },
    'rounded': { 'border-top-left-radius': v, 'border-top-right-radius': v, 'border-bottom-right-radius': v, 'border-bottom-left-radius': v },
    'border': { 'border-top-width': v, 'border-right-width': v, 'border-bottom-width': v, 'border-left-width': v },
    'basis': { 'flex-basis': v },
    'z': { 'z-index': v },
    'opacity': { opacity: v },
    'bg': { 'background-color': v },
    'columns': { columns: v },
    'duration': { 'transition-duration': v },
    'delay': { 'transition-delay': v },
  };
  return propMap[prefix] || null;
}

// Tailwind responsive prefixes → handling
const RESPONSIVE_PREFIXES = {
  'sm': true, 'md': true, 'lg': true, 'xl': true, '2xl': true,
};

const STATE_PREFIXES = new Set([
  'hover', 'focus', 'active', 'visited', 'focus-within', 'focus-visible',
  'disabled', 'first', 'last', 'odd', 'even', 'group-hover', 'peer',
  'dark', 'motion-safe', 'motion-reduce', 'print',
]);

// Main resolver: takes class array, returns { base: {}, responsive: {}, warnings: [] }
export function resolveTailwindClasses(classArray) {
  const base = {};
  const warnings = [];
  const nonTailwind = [];

  for (const cls of classArray) {
    // Handle prefixed classes (responsive, state)
    if (cls.includes(':')) {
      const parts = cls.split(':');
      const prefix = parts[0];
      const baseClass = parts.slice(1).join(':');

      if (STATE_PREFIXES.has(prefix)) {
        warnings.push(`State variant skipped: ${cls} (hover/focus not supported in Webflow styleLess)`);
        continue;
      }

      if (RESPONSIVE_PREFIXES[prefix]) {
        // For v1: apply responsive classes to desktop base too
        // Tailwind is mobile-first, so prefixed classes are desktop overrides
        const resolved = resolveClass(baseClass);
        if (resolved) {
          Object.assign(base, resolved);
        } else {
          warnings.push(`Unknown Tailwind class: ${baseClass}`);
        }
        continue;
      }
    }

    // Check if it's a Tailwind class
    if (!isTailwindClass(cls)) {
      nonTailwind.push(cls);
      continue;
    }

    const resolved = resolveClass(cls);
    if (resolved) {
      Object.assign(base, resolved);
    } else {
      warnings.push(`Unknown Tailwind class: ${cls}`);
    }
  }

  return { base, nonTailwind, warnings };
}

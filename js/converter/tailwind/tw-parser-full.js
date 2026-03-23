/**
 * Tailwind Parser
 * Extracts and parses Tailwind classes from HTML
 */

/**
 * Extract all class attributes from HTML string
 */
export function extractClassesFromHTML(html) {
  const classRegex = /class\s*=\s*["']([^"']+)["']/gi;
  const matches = [];
  let match;
  
  while ((match = classRegex.exec(html)) !== null) {
    matches.push({
      fullMatch: match[0],
      classes: match[1],
      index: match.index
    });
  }
  
  return matches;
}

/**
 * Parse a class string into individual classes
 */
export function parseClassString(classString) {
  return classString
    .split(/\s+/)
    .filter(c => c.length > 0)
    .map(c => c.trim());
}

/**
 * Detect if a class is a Tailwind utility class
 */
export function isTailwindClass(className) {
  // Common Tailwind patterns
  const tailwindPatterns = [
    // Layout
    /^(flex|grid|block|inline|hidden|contents)$/,
    /^(flex|grid)-(row|col|wrap|nowrap)/,
    /^(justify|items|content|self|place)-(start|end|center|between|around|evenly|stretch|baseline)/,
    /^(order|col|row)-(span-)?(\d+|auto|first|last|full)/,
    
    // Spacing
    /^[mp][xytblr]?-(\d+|auto|px)$/,
    /^(gap|space)-[xy]?-?\d+$/,
    
    // Sizing
    /^[wh]-(full|screen|auto|min|max|fit|\d+|px|\[.+\])$/,
    /^(min|max)-[wh]-/,
    
    // Typography
    /^(text|font|leading|tracking|align)-/,
    /^(uppercase|lowercase|capitalize|normal-case)$/,
    /^(truncate|line-clamp-\d+)$/,
    
    // Backgrounds & Borders
    /^bg-/,
    /^(border|rounded|ring|outline)(-|$)/,
    /^(shadow)(-|$)/,
    
    // Effects
    /^(opacity|blur|brightness|contrast|grayscale|invert|saturate|sepia)-/,
    /^(transition|duration|ease|delay)-/,
    /^(animate)-/,
    
    // Layout positioning
    /^(relative|absolute|fixed|sticky|static)$/,
    /^(top|right|bottom|left|inset)-/,
    /^z-/,
    
    // Overflow
    /^overflow(-[xy])?-(auto|hidden|visible|scroll|clip)$/,
    
    // Flexbox & Grid specific
    /^(grow|shrink|basis)-/,
    /^(grow|shrink)$/,
    /^(aspect)-/,
    
    // Interactivity
    /^(cursor|pointer-events|select|resize)-/,
    /^(scroll)-/,
    
    // SVG
    /^(fill|stroke)-/,
    
    // Responsive prefixes
    /^(sm|md|lg|xl|2xl):/,
    
    // State prefixes
    /^(hover|focus|active|disabled|visited|first|last|odd|even|group-hover|focus-within|focus-visible):/,
    
    // Dark mode
    /^dark:/,
    
    // Container
    /^container$/,
    /^(max-w|min-w)-/,
    
    // Visibility
    /^(visible|invisible)$/,
    /^(sr-only|not-sr-only)$/,
    
    // Tables
    /^(table|border-collapse|border-separate)$/,
  ];
  
  return tailwindPatterns.some(pattern => pattern.test(className));
}

/**
 * Parse responsive prefix from class
 * Returns { prefix: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | null, baseClass: string }
 */
export function parseResponsivePrefix(className) {
  const responsivePrefixes = ['sm', 'md', 'lg', 'xl', '2xl'];
  
  for (const prefix of responsivePrefixes) {
    if (className.startsWith(`${prefix}:`)) {
      return {
        prefix,
        baseClass: className.slice(prefix.length + 1)
      };
    }
  }
  
  return { prefix: null, baseClass: className };
}

/**
 * Parse state prefix from class
 * Returns { states: string[], baseClass: string }
 */
export function parseStatePrefix(className) {
  const statePrefixes = [
    'hover', 'focus', 'active', 'disabled', 'visited',
    'first', 'last', 'odd', 'even', 'group-hover',
    'focus-within', 'focus-visible', 'dark'
  ];
  
  const states = [];
  let remaining = className;
  
  // Handle chained prefixes like "hover:focus:bg-blue-500"
  let foundPrefix = true;
  while (foundPrefix) {
    foundPrefix = false;
    for (const prefix of statePrefixes) {
      if (remaining.startsWith(`${prefix}:`)) {
        states.push(prefix);
        remaining = remaining.slice(prefix.length + 1);
        foundPrefix = true;
        break;
      }
    }
  }
  
  return { states, baseClass: remaining };
}

/**
 * Parse arbitrary value from class
 * E.g., w-[200px] → { property: 'w', value: '200px' }
 */
export function parseArbitraryValue(className) {
  const arbitraryRegex = /^([a-z-]+)-\[(.+)\]$/;
  const match = className.match(arbitraryRegex);
  
  if (match) {
    return {
      property: match[1],
      value: match[2],
      isArbitrary: true
    };
  }
  
  return { isArbitrary: false };
}

/**
 * Fully parse a Tailwind class
 */
export function parseClass(className) {
  // First check for responsive prefix
  const { prefix: responsivePrefix, baseClass: afterResponsive } = parseResponsivePrefix(className);
  
  // Then check for state prefixes
  const { states, baseClass: afterStates } = parseStatePrefix(afterResponsive);
  
  // Check for arbitrary values
  const arbitrary = parseArbitraryValue(afterStates);
  
  return {
    original: className,
    responsive: responsivePrefix,
    states,
    baseClass: afterStates,
    isArbitrary: arbitrary.isArbitrary,
    arbitraryProperty: arbitrary.property,
    arbitraryValue: arbitrary.value,
    isTailwind: isTailwindClass(afterStates) || arbitrary.isArbitrary
  };
}

/**
 * Group classes by their type for processing
 */
export function groupClasses(classes) {
  const parsed = classes.map(parseClass);
  
  return {
    base: parsed.filter(c => !c.responsive && c.states.length === 0),
    responsive: parsed.filter(c => c.responsive && c.states.length === 0),
    stateful: parsed.filter(c => c.states.length > 0 && !c.responsive),
    complex: parsed.filter(c => c.responsive && c.states.length > 0),
    arbitrary: parsed.filter(c => c.isArbitrary),
    nonTailwind: parsed.filter(c => !c.isTailwind)
  };
}

export default {
  extractClassesFromHTML,
  parseClassString,
  isTailwindClass,
  parseResponsivePrefix,
  parseStatePrefix,
  parseArbitraryValue,
  parseClass,
  groupClasses
};

// Parse Tailwind classes from an element and categorize them

const RESPONSIVE_PREFIXES = ['sm', 'md', 'lg', 'xl', '2xl'];
const STATE_PREFIXES = ['hover', 'focus', 'active', 'disabled', 'group-hover'];

export function parseTailwindClasses(classString) {
  if (!classString) return { base: [], responsive: {}, states: {} };

  const classes = classString.trim().split(/\s+/).filter(Boolean);
  const base = [];
  const responsive = {}; // { 'md': ['flex', 'gap-4'], ... }
  const states = {};     // { 'hover': ['bg-gray-100'], ... }

  for (const cls of classes) {
    // Check for responsive prefix: md:flex, lg:grid-cols-3
    const responsiveMatch = cls.match(/^(sm|md|lg|xl|2xl):(.*)/);
    if (responsiveMatch) {
      const [, bp, utility] = responsiveMatch;
      if (!responsive[bp]) responsive[bp] = [];
      responsive[bp].push(utility);
      continue;
    }

    // Check for state prefix: hover:bg-gray-100
    const stateMatch = cls.match(/^(hover|focus|active|disabled|group-hover):(.*)/);
    if (stateMatch) {
      const [, state, utility] = stateMatch;
      if (!states[state]) states[state] = [];
      states[state].push(utility);
      continue;
    }

    base.push(cls);
  }

  return { base, responsive, states };
}

// Analyze flex-related classes and compose a Starter flex class
export function composeFlex(classes) {
  let direction = 'h'; // h = horizontal (row), v = vertical (col)
  let justify = 'left';
  let align = 'top';
  let hasFlex = false;
  const remaining = [];

  for (const cls of classes) {
    switch (cls) {
      case 'flex': hasFlex = true; break;
      case 'inline-flex': hasFlex = true; break;
      case 'flex-col': direction = 'v'; break;
      case 'flex-col-reverse': direction = 'v'; break;
      case 'flex-row': direction = 'h'; break;
      case 'flex-row-reverse': direction = 'h'; break;
      case 'items-start': align = direction === 'h' ? 'top' : 'left'; break;
      case 'items-center': align = 'center'; break;
      case 'items-end': align = direction === 'h' ? 'bottom' : 'right'; break;
      case 'items-stretch': align = 'stretch'; break;
      case 'items-baseline': align = direction === 'h' ? 'top' : 'left'; break;
      case 'justify-start': justify = direction === 'h' ? 'left' : 'top'; break;
      case 'justify-center': justify = 'center'; break;
      case 'justify-end': justify = direction === 'h' ? 'right' : 'bottom'; break;
      case 'justify-between': justify = 'between'; break;
      case 'justify-around': justify = 'between'; break; // approximate
      case 'justify-evenly': justify = 'between'; break; // approximate
      default: remaining.push(cls);
    }
  }

  if (!hasFlex) return { flexClass: null, remaining: classes };

  // Compose: hflex-{justify}-{align} or vflex-{justify}-{align}
  const flexClass = `${direction}flex-${justify}-${align}`;
  return { flexClass, remaining };
}

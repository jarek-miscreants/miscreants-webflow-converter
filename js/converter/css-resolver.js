import { mapMediaQuery } from './breakpoints.js';

function parseInlineStyle(styleAttr) {
  const properties = {};
  if (!styleAttr) return properties;
  const declarations = styleAttr.split(';');
  for (const decl of declarations) {
    const colonIndex = decl.indexOf(':');
    if (colonIndex === -1) continue;
    const prop = decl.slice(0, colonIndex).trim().toLowerCase();
    const value = decl.slice(colonIndex + 1).trim();
    if (prop && value) properties[prop] = value;
  }
  return properties;
}

export function resolveStyles(element, cssRules) {
  const matchingRules = [];

  for (const rule of cssRules) {
    try {
      if (element.matches(rule.selector)) {
        matchingRules.push(rule);
      }
    } catch {
      // Invalid selector, skip
    }
  }

  // Sort by specificity (ascending), later rules override earlier at same specificity
  matchingRules.sort((a, b) => a.specificity - b.specificity);

  const baseProperties = {};
  const mediaOverrides = {};

  for (const rule of matchingRules) {
    rule.matched = true;
    if (!rule.mediaQuery) {
      // Base (desktop) styles
      Object.assign(baseProperties, rule.properties);
    } else {
      const breakpointId = mapMediaQuery(rule.mediaQuery);
      if (breakpointId) {
        if (!mediaOverrides[breakpointId]) mediaOverrides[breakpointId] = {};
        Object.assign(mediaOverrides[breakpointId], rule.properties);
      }
    }
  }

  // Inline styles override everything
  const inlineStyles = parseInlineStyle(element.getAttribute('style'));
  Object.assign(baseProperties, inlineStyles);

  // Determine class name
  const existingClasses = element.className && typeof element.className === 'string'
    ? element.className.trim().split(/\s+/).filter(Boolean)
    : [];
  const className = existingClasses[0] || element.tagName.toLowerCase();

  return {
    className,
    properties: baseProperties,
    mediaOverrides: Object.keys(mediaOverrides).length > 0 ? mediaOverrides : null,
  };
}

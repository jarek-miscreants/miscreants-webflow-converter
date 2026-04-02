function calculateSpecificity(selector) {
  let ids = 0, classes = 0, tags = 0;
  const cleaned = selector
    .replace(/:not\(([^)]*)\)/g, '$1')
    .replace(/::?[\w-]+/g, (m) => {
      if (m.startsWith('::')) { tags++; return ''; }
      classes++;
      return '';
    });

  ids += (cleaned.match(/#[\w-]+/g) || []).length;
  classes += (cleaned.match(/\.[\w-]+/g) || []).length;
  classes += (cleaned.match(/\[[\w-]+/g) || []).length;
  tags += (cleaned.match(/(^|[\s+>~])[\w]+/g) || []).length;

  return ids * 100 + classes * 10 + tags;
}

function parseDeclarations(block) {
  const properties = {};
  const declarations = block.split(';');
  for (const decl of declarations) {
    const colonIndex = decl.indexOf(':');
    if (colonIndex === -1) continue;
    const prop = decl.slice(0, colonIndex).trim().toLowerCase();
    const value = decl.slice(colonIndex + 1).trim();
    if (prop && value) {
      properties[prop] = value;
    }
  }
  return properties;
}

function extractRules(cssText, mediaQuery = null) {
  const rules = [];
  let i = 0;

  while (i < cssText.length) {
    // Skip whitespace and comments
    while (i < cssText.length && /\s/.test(cssText[i])) i++;
    if (i >= cssText.length) break;

    if (cssText[i] === '/' && cssText[i + 1] === '*') {
      const end = cssText.indexOf('*/', i + 2);
      i = end === -1 ? cssText.length : end + 2;
      continue;
    }

    // Check for @media
    if (cssText[i] === '@') {
      const atRuleMatch = cssText.slice(i).match(/^@media\s*([^{]+)\{/);
      if (atRuleMatch) {
        const mq = atRuleMatch[1].trim();
        const start = i + atRuleMatch[0].length;
        let depth = 1;
        let j = start;
        while (j < cssText.length && depth > 0) {
          if (cssText[j] === '{') depth++;
          else if (cssText[j] === '}') depth--;
          j++;
        }
        const innerCSS = cssText.slice(start, j - 1);
        rules.push(...extractRules(innerCSS, mq));
        i = j;
        continue;
      }

      // Skip other at-rules (@keyframes, @font-face, etc.)
      const otherAt = cssText.slice(i).match(/^@[\w-]+\s*[^{]*\{/);
      if (otherAt) {
        const start = i + otherAt[0].length;
        let depth = 1;
        let j = start;
        while (j < cssText.length && depth > 0) {
          if (cssText[j] === '{') depth++;
          else if (cssText[j] === '}') depth--;
          j++;
        }
        i = j;
        continue;
      }

      // Skip simple at-rules (no block)
      const simpleAt = cssText.indexOf(';', i);
      i = simpleAt === -1 ? cssText.length : simpleAt + 1;
      continue;
    }

    // Regular rule: selector { declarations }
    const braceIndex = cssText.indexOf('{', i);
    if (braceIndex === -1) break;

    const selectorText = cssText.slice(i, braceIndex).trim();
    let depth = 1;
    let j = braceIndex + 1;
    while (j < cssText.length && depth > 0) {
      if (cssText[j] === '{') depth++;
      else if (cssText[j] === '}') depth--;
      j++;
    }

    const declarationBlock = cssText.slice(braceIndex + 1, j - 1).trim();
    if (selectorText && declarationBlock) {
      const properties = parseDeclarations(declarationBlock);
      // Split grouped selectors
      const selectors = selectorText.split(',').map(s => s.trim()).filter(Boolean);
      for (const selector of selectors) {
        rules.push({
          selector,
          properties,
          mediaQuery,
          specificity: calculateSpecificity(selector),
        });
      }
    }

    i = j;
  }

  return rules;
}

export function parseCSS(cssText) {
  if (!cssText || !cssText.trim()) return [];
  return extractRules(cssText);
}

// Rebuild CSS string from rules that were NOT matched (i.e. not resolved into styleLess).
// Also preserves @rules that the parser skips (like @keyframes, @font-face).
export function rebuildUnmatchedCSS(cssText, rules) {
  const unmatched = rules.filter(r => !r.matched);
  if (unmatched.length === 0 && !/@(keyframes|font-face|property|layer|supports|import)\b/.test(cssText)) {
    return '';
  }

  // Extract passthrough @rules (not @media — those are handled via parsed rules)
  const passthroughBlocks = [];
  let i = 0;
  while (i < cssText.length) {
    while (i < cssText.length && /\s/.test(cssText[i])) i++;
    if (i >= cssText.length) break;

    if (cssText[i] === '/' && cssText[i + 1] === '*') {
      const end = cssText.indexOf('*/', i + 2);
      i = end === -1 ? cssText.length : end + 2;
      continue;
    }

    if (cssText[i] === '@') {
      const mediaMatch = cssText.slice(i).match(/^@media\s/);
      if (mediaMatch) {
        // Skip @media — its inner rules are in the parsed rules array
        const braceStart = cssText.indexOf('{', i);
        if (braceStart === -1) break;
        let depth = 1, j = braceStart + 1;
        while (j < cssText.length && depth > 0) {
          if (cssText[j] === '{') depth++;
          else if (cssText[j] === '}') depth--;
          j++;
        }
        i = j;
        continue;
      }

      // Other @rule — preserve it
      const otherAt = cssText.slice(i).match(/^@[\w-]+\s*[^{]*\{/);
      if (otherAt) {
        const braceStart = i + otherAt[0].length;
        let depth = 1, j = braceStart;
        while (j < cssText.length && depth > 0) {
          if (cssText[j] === '{') depth++;
          else if (cssText[j] === '}') depth--;
          j++;
        }
        passthroughBlocks.push(cssText.slice(i, j));
        i = j;
        continue;
      }

      // Simple @rule (no block, e.g. @import)
      const semi = cssText.indexOf(';', i);
      if (semi !== -1) {
        passthroughBlocks.push(cssText.slice(i, semi + 1));
        i = semi + 1;
      } else {
        i = cssText.length;
      }
      continue;
    }

    // Regular rule — skip (handled by parsed rules)
    const braceIndex = cssText.indexOf('{', i);
    if (braceIndex === -1) break;
    let depth = 1, j = braceIndex + 1;
    while (j < cssText.length && depth > 0) {
      if (cssText[j] === '{') depth++;
      else if (cssText[j] === '}') depth--;
      j++;
    }
    i = j;
  }

  // Rebuild from unmatched rules
  const parts = [];
  const mediaGroups = {};

  for (const rule of unmatched) {
    const declStr = Object.entries(rule.properties)
      .map(([p, v]) => `  ${p}: ${v};`)
      .join('\n');
    const ruleStr = `${rule.selector} {\n${declStr}\n}`;

    if (rule.mediaQuery) {
      if (!mediaGroups[rule.mediaQuery]) mediaGroups[rule.mediaQuery] = [];
      mediaGroups[rule.mediaQuery].push(ruleStr);
    } else {
      parts.push(ruleStr);
    }
  }

  for (const [mq, ruleStrs] of Object.entries(mediaGroups)) {
    parts.push(`@media ${mq} {\n${ruleStrs.map(r => '  ' + r.replace(/\n/g, '\n  ')).join('\n')}\n}`);
  }

  // Add passthrough @rules
  parts.push(...passthroughBlocks);

  return parts.join('\n\n');
}

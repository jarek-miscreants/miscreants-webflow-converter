import { parseHTML } from './html-parser.js';
import { parseCSS, rebuildUnmatchedCSS } from './css-parser.js';
import { walkDOM } from './tree-walker.js';
import { createScriptEmbeds, createStyleEmbed } from './js-handler.js';

// Extract :root and variable declarations from CSS into a <style> embed
function extractVariableEmbed(css) {
  if (!css || !css.trim()) return null;

  const varBlocks = [];
  const regex = /(:root\s*\{[^}]*\})/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    varBlocks.push(match[1]);
  }

  if (varBlocks.length === 0) return null;
  const varCSS = varBlocks.join('\n');
  return createStyleEmbed(varCSS);
}

export function convert(htmlString, cssString, jsString) {
  const warnings = [];

  // Step 1: Parse HTML, extract embedded <style> and <script> tags
  const { body, extractedCSS, extractedScripts } = parseHTML(htmlString || '');

  // Step 2: Parse CSS for style resolution (used by walkDOM for styleLess)
  // Parse CSS tab rules separately so we can track which ones get resolved
  const cssTabRules = parseCSS(cssString || '');
  const extractedRules = parseCSS(extractedCSS);
  const cssRules = [...cssTabRules, ...extractedRules];

  // Step 3: Walk DOM tree → Webflow nodes + styles with unique class suffixes
  // After this, matched rules will have rule.matched = true
  const { nodes, styles, rootIds, classMap } = walkDOM(body, cssRules);

  // Step 4: Create CSS/JS embeds — only include CSS rules that weren't resolved into styleLess
  const remainingCSS = cssString?.trim() ? rebuildUnmatchedCSS(cssString, cssTabRules) : '';
  const cssEmbed = remainingCSS ? createStyleEmbed(remainingCSS) : null;
  const scriptEmbeds = createScriptEmbeds(extractedScripts, jsString);

  // Step 4b: Extract :root / variable declarations from extracted CSS into a separate embed
  // so var() references in styleLess can resolve in Webflow Designer
  const varEmbed = extractVariableEmbed(extractedCSS);

  // Step 5: Attach embeds as children of root node
  const rootNode = rootIds.length > 0
    ? nodes.find(n => n._id === rootIds[0])
    : null;

  if (rootNode) {
    if (varEmbed) {
      varEmbed.data.displayName = 'CSS';
      nodes.push(varEmbed);
      rootNode.children.unshift(varEmbed._id);
    }
    if (cssEmbed) {
      cssEmbed.data.displayName = 'CSS';
      nodes.push(cssEmbed);
      rootNode.children.unshift(cssEmbed._id);
    }
    for (const embed of scriptEmbeds) {
      embed.data.displayName = 'JS';
      nodes.push(embed);
      rootNode.children.push(embed._id);
    }
  }

  // Step 6: Assemble Webflow clipboard JSON
  const result = {
    type: '@webflow/XscpData',
    payload: {
      nodes,
      styles,
      assets: [],
      ix1: [],
      ix2: {
        interactions: [],
        events: [],
        actionLists: [],
      },
    },
    meta: {
      droppedLinks: 0,
      dynBindRemovedCount: 0,
      dynListBindRemovedCount: 0,
      paginationRemovedCount: 0,
      universalBindingsRemovedCount: 0,
      unlinkedSymbolCount: 0,
      codeComponentsRemovedCount: 0,
    },
  };

  return { result, warnings };
}

import { parseHTML } from './html-parser.js';
import { parseCSS } from './css-parser.js';
import { walkDOM } from './tree-walker.js';
import { createScriptEmbeds, createStyleEmbed } from './js-handler.js';

export function convert(htmlString, cssString, jsString) {
  const warnings = [];

  // Step 1: Parse HTML, extract embedded <style> and <script> tags
  const { body, extractedCSS, extractedScripts } = parseHTML(htmlString || '');

  // Step 2: Parse CSS for style resolution (used by walkDOM for styleLess on transitions etc.)
  const allCSS = [cssString || '', extractedCSS].filter(Boolean).join('\n');
  const cssRules = parseCSS(allCSS);

  // Step 3: Walk DOM tree → Webflow nodes + styles with unique class suffixes
  const { nodes, styles, rootIds, classMap } = walkDOM(body, cssRules);

  // Step 4: Create CSS/JS embeds with class selectors intact
  // Class names in the JSON have unique suffixes so they won't conflict on paste
  const cssEmbed = cssString?.trim() ? createStyleEmbed(cssString) : null;
  const scriptEmbeds = createScriptEmbeds(extractedScripts, jsString);

  // Step 5: Attach embeds as children of root node
  if (scriptEmbeds.length > 0 || cssEmbed) {
    const rootNode = rootIds.length > 0
      ? nodes.find(n => n._id === rootIds[0])
      : null;

    if (rootNode) {
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

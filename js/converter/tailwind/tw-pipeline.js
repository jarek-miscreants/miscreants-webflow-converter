// Tailwind → Webflow (Miscreants Starter) conversion pipeline

import { parseHTML } from '../html-parser.js';
import { generateId, generateClassSuffix } from '../id-generator.js';
import { mapElement, isEmbedFallback } from '../node-mapper.js';
import { createHtmlEmbedNode, createScriptEmbeds, createStyleEmbed } from '../js-handler.js';
import { parseTailwindClasses } from './tw-parser.js';
import { mapTailwindToStarter } from './tw-to-starter.js';

export function convertTailwind(htmlString, cssString, jsString) {
  const warnings = [];
  const { body, extractedCSS, extractedScripts } = parseHTML(htmlString || '');

  const nodes = [];
  const styles = [];
  const classMap = new Map(); // starter class name → style ID (deduplicated)

  function getOrCreateStyle(className, styleLess = '') {
    if (classMap.has(className)) return classMap.get(className);
    const suffix = generateClassSuffix();
    const styleId = `${className}-${suffix}`;
    styles.push({
      _id: styleId,
      fake: false,
      type: 'class',
      name: className,
      namespace: '',
      comb: '&',
      styleLess,
      variants: {},
      children: [],
      createdBy: 'converter',
      origin: null,
      selector: null,
    });
    classMap.set(className, styleId);
    return styleId;
  }

  function getClasses(element) {
    return element.className && typeof element.className === 'string'
      ? element.className.trim().split(/\s+/).filter(Boolean)
      : [];
  }

  function isTextOnly(element) {
    const inlineTags = new Set(['strong', 'b', 'em', 'i', 'u', 'br']);
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) continue;
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        if (!inlineTags.has(tag)) return false;
        if (child.hasAttribute('class') || child.hasAttribute('style')) return false;
      } else return false;
    }
    return true;
  }

  function processElement(element) {
    if (element.nodeType !== Node.ELEMENT_NODE) return null;
    const tag = element.tagName.toLowerCase();

    if (isEmbedFallback(element)) {
      const embed = createHtmlEmbedNode(element.outerHTML);
      nodes.push(embed);
      return embed._id;
    }

    const mapped = mapElement(element);
    if (mapped.useOuterHTML) {
      const embed = createHtmlEmbedNode(element.outerHTML);
      nodes.push(embed);
      return embed._id;
    }

    const nodeId = generateId();

    // Parse Tailwind classes
    const twClasses = getClasses(element);
    const { base, responsive, states } = parseTailwindClasses(twClasses.join(' '));

    // Map base classes to Starter
    const { starterClasses, cssProperties } = mapTailwindToStarter(base);

    // Create style entries for each Starter class
    const classIds = starterClasses.map(cls => getOrCreateStyle(cls));

    // Collect non-class, non-style attributes
    const attributes = [];
    for (const attr of element.attributes) {
      if (attr.name === 'class') continue;
      if (attr.name === 'style') continue; // we handle style separately
      attributes.push({ name: attr.name, value: attr.value });
    }

    // Build inline style from: original inline style + Tailwind-resolved CSS properties
    const existingStyle = element.getAttribute('style') || '';
    const twCSS = Object.entries(cssProperties)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
    const combinedStyle = [existingStyle, twCSS].filter(Boolean).join('; ');
    if (combinedStyle) {
      attributes.push({ name: 'style', value: combinedStyle });
    }

    // Build node
    let node;
    if (mapped.isDOMType || mapped.type === 'DOM') {
      node = {
        _id: nodeId,
        type: 'DOM',
        tag: 'div',
        classes: classIds,
        children: [],
        data: { tag, attributes, slot: '', text: false, visibility: { conditions: [] } },
      };
    } else {
      const data = {
        devlink: { runtimeProps: {}, slot: '' },
        displayName: '',
        attr: { id: element.id || '' },
        xattr: [],
        search: { exclude: false },
        visibility: { conditions: [] },
      };
      for (const attr of element.attributes) {
        if (attr.name.startsWith('data-')) {
          data.xattr.push({ name: attr.name, value: attr.value });
        }
      }
      if (tag === 'a') {
        data.attr.href = element.getAttribute('href') || '#';
        data.attr.target = element.getAttribute('target') || '';
      }
      if (tag === 'img') {
        data.attr.src = element.getAttribute('src') || '';
        data.attr.alt = element.getAttribute('alt') || '';
        data.attr.loading = element.getAttribute('loading') || 'lazy';
      }

      node = {
        _id: nodeId,
        type: mapped.type,
        tag,
        classes: classIds,
        children: [],
        data,
      };
    }

    nodes.push(node);

    // Process children
    if (isTextOnly(element)) {
      node.children = processTextChildren(element);
    } else {
      const childIds = [];
      for (const child of element.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const cid = processElement(child);
          if (cid) childIds.push(cid);
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
          const tn = { _id: generateId(), text: true, v: child.textContent };
          nodes.push(tn);
          childIds.push(tn._id);
        }
      }
      node.children = childIds;
    }

    return nodeId;
  }

  function processTextChildren(element) {
    const ids = [];
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        const tn = { _id: generateId(), text: true, v: child.textContent };
        nodes.push(tn);
        ids.push(tn._id);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        if (tag === 'br') {
          const br = { _id: generateId(), type: 'LineBreak', tag: 'br', classes: [], children: [], data: { tag: 'br' } };
          nodes.push(br);
          ids.push(br._id);
        } else {
          const realTag = tag === 'b' ? 'strong' : tag === 'i' ? 'em' : tag;
          const inl = { _id: generateId(), type: 'DOM', tag: 'div', classes: [], children: [],
            data: { tag: realTag, attributes: [], slot: '', text: false, visibility: { conditions: [] } } };
          nodes.push(inl);
          inl.children = processTextChildren(child);
          ids.push(inl._id);
        }
      }
    }
    return ids;
  }

  // Process root
  const topChildIds = [];
  for (const child of body.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const cid = processElement(child);
      if (cid) topChildIds.push(cid);
    }
  }

  // Wrap multiple top-level
  let rootIds = topChildIds;
  if (topChildIds.length > 1) {
    const wid = generateId();
    nodes.push({
      _id: wid, type: 'Block', tag: 'div', classes: [], children: topChildIds,
      data: { text: false, tag: 'div', devlink: { runtimeProps: {}, slot: '' },
        displayName: '', attr: { id: '' }, xattr: [],
        search: { exclude: false }, visibility: { conditions: [] } },
    });
    rootIds = [wid];
  }

  // Update styles children (combo class hierarchy)
  updateStylesChildren(nodes, styles);

  // Attach CSS/JS embeds
  const cssEmbed = cssString?.trim() ? createStyleEmbed(cssString) : null;
  const scriptEmbeds = createScriptEmbeds(extractedScripts, jsString);
  const rootNode = rootIds.length > 0 ? nodes.find(n => n._id === rootIds[0]) : null;
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

  return {
    result: {
      type: '@webflow/XscpData',
      payload: { nodes, styles, assets: [], ix1: [],
        ix2: { interactions: [], events: [], actionLists: [] } },
      meta: { droppedLinks: 0, dynBindRemovedCount: 0, dynListBindRemovedCount: 0,
        paginationRemovedCount: 0, universalBindingsRemovedCount: 0,
        unlinkedSymbolCount: 0, codeComponentsRemovedCount: 0 },
    },
    warnings,
  };
}

// Build combo class children relationships (same as Relume converter)
function updateStylesChildren(nodes, styles) {
  const childrenMap = {};
  nodes.forEach(node => {
    if (Array.isArray(node.classes) && node.classes.length > 1) {
      for (let i = 0; i < node.classes.length - 1; i++) {
        const parent = node.classes[i];
        const child = node.classes[i + 1];
        if (!childrenMap[parent]) childrenMap[parent] = new Set();
        childrenMap[parent].add(child);
      }
    }
  });
  styles.forEach(style => {
    if (childrenMap[style._id]) {
      const existing = new Set(style.children || []);
      childrenMap[style._id].forEach(c => existing.add(c));
      style.children = Array.from(existing);
    }
  });
}

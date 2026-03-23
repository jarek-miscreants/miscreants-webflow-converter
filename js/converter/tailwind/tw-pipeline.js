// Tailwind → Webflow (Miscreants Starter) conversion pipeline
// Uses the proper mapping tables from the Tailwind Converter project

import { parseHTML } from '../html-parser.js';
import { generateId, generateClassSuffix } from '../id-generator.js';
import { mapElement, isEmbedFallback } from '../node-mapper.js';
import { createHtmlEmbedNode, createScriptEmbeds, createStyleEmbed } from '../js-handler.js';
import allMappings, { paddingMappings } from './tw-mappings.js';
import { resolveCompoundClasses } from './tw-compound.js';
import { parseClass, parseClassString, isTailwindClass } from './tw-parser-full.js';
import { generateFallbackCSS, combineFallbackCSS } from './tw-fallback.js';

export function convertTailwind(htmlString, cssString, jsString) {
  const warnings = [];
  const { body, extractedCSS, extractedScripts } = parseHTML(htmlString || '');

  const nodes = [];
  const styles = [];
  const classMap = new Map(); // class name → style ID

  // Use unique suffix IDs for internal consistency (combo class children references)
  // but plain `name` so Webflow matches to existing project classes
  function getOrCreateStyle(className, styleLess = '') {
    if (classMap.has(className)) return classMap.get(className);
    const suffix = generateClassSuffix();
    const styleId = `${className}-${suffix}`;
    styles.push({
      _id: styleId, fake: false, type: 'class', name: className,
      namespace: '', comb: '&', styleLess, variants: {},
      children: [], createdBy: 'converter', origin: null, selector: null,
    });
    classMap.set(className, styleId);
    return styleId;
  }

  // Convert Tailwind classes to Miscreants Starter classes
  function convertTailwindClasses(twClassString) {
    const classes = parseClassString(twClassString);
    const starterClasses = [];
    const fallbackClasses = [];

    // Step 1: Resolve compound classes (flex + items-center → hflex-left-center)
    const { resolvedClasses, remainingClasses, consumedClasses } = resolveCompoundClasses(classes);
    starterClasses.push(...resolvedClasses);

    // Step 2: Map remaining classes
    for (const cls of remainingClasses) {
      const parsed = parseClass(cls);

      // Skip responsive/state prefixes (handle as fallback CSS)
      if (parsed.responsive || parsed.states.length > 0) {
        fallbackClasses.push(cls);
        continue;
      }

      // Skip non-Tailwind classes — keep as custom classes
      if (!parsed.isTailwind) {
        starterClasses.push(cls);
        continue;
      }

      const baseClass = parsed.baseClass;

      // Strip line-height modifier: text-base/7 → text-base
      const cleanClass = baseClass.includes('/') ? baseClass.split('/')[0] : baseClass;

      // Check direct mappings
      if (allMappings[cleanClass] !== undefined) {
        if (allMappings[cleanClass] !== null) {
          starterClasses.push(allMappings[cleanClass]);
        }
        continue;
      }

      // Check padding mappings (can return array)
      if (paddingMappings[cleanClass] !== undefined) {
        const result = paddingMappings[cleanClass];
        if (Array.isArray(result)) {
          starterClasses.push(...result);
        } else if (result) {
          starterClasses.push(result);
        }
        continue;
      }

      // Unmapped Tailwind class → fallback CSS
      fallbackClasses.push(cls);
    }

    return { starterClasses, fallbackClasses };
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

    // Convert Tailwind classes to Starter
    const twClassStr = element.className && typeof element.className === 'string'
      ? element.className.trim() : '';
    const { starterClasses, fallbackClasses } = twClassStr
      ? convertTailwindClasses(twClassStr)
      : { starterClasses: [], fallbackClasses: [] };

    // Generate fallback CSS for unmapped classes
    if (fallbackClasses.length > 0) {
      const fallbacks = generateFallbackCSS(fallbackClasses);
      // Add fallback CSS as inline style attributes
      for (const fb of fallbacks) {
        if (fb.css) {
          const propMatch = fb.css.match(/\{([^}]+)\}/);
          if (propMatch) {
            // Extract CSS properties and add to element style
            // (handled below via style attribute)
          }
        }
      }
      // Track as warnings
      fallbackClasses.forEach(cls => {
        warnings.push(`Unmapped: ${cls} (converted to inline CSS)`);
      });
    }

    // Create style entries for Starter classes
    const classIds = starterClasses.map(cls => getOrCreateStyle(cls));

    // Build attributes
    const attributes = [];
    for (const attr of element.attributes) {
      if (attr.name === 'class') continue;
      attributes.push({ name: attr.name, value: attr.value });
    }

    // Generate fallback inline styles for unmapped Tailwind classes
    const fallbackStyles = [];
    for (const cls of fallbackClasses) {
      const fallbacks = generateFallbackCSS([cls]);
      for (const fb of fallbacks) {
        if (fb.css && fb.type !== 'unknown') {
          const propMatch = fb.css.match(/\{([^}]+)\}/);
          if (propMatch) {
            fallbackStyles.push(propMatch[1].trim().replace(/\/\*.*?\*\//g, '').trim());
          }
        }
      }
    }

    // Combine existing style + fallback styles
    const existingStyle = element.getAttribute('style') || '';
    const combinedStyle = [existingStyle, ...fallbackStyles].filter(Boolean).join(' ');
    // Remove existing style attr (we'll add combined one)
    const attrIdx = attributes.findIndex(a => a.name === 'style');
    if (attrIdx >= 0) attributes.splice(attrIdx, 1);
    if (combinedStyle) {
      attributes.push({ name: 'style', value: combinedStyle });
    }

    // Build node
    let node;
    if (mapped.isDOMType || mapped.type === 'DOM') {
      node = {
        _id: nodeId, type: 'DOM', tag: 'div', classes: classIds, children: [],
        data: { tag, attributes, slot: '', text: false, visibility: { conditions: [] } },
      };
    } else {
      const data = {
        devlink: { runtimeProps: {}, slot: '' }, displayName: '',
        attr: { id: element.id || '' }, xattr: [],
        search: { exclude: false }, visibility: { conditions: [] },
      };
      for (const attr of element.attributes) {
        if (attr.name.startsWith('data-')) data.xattr.push({ name: attr.name, value: attr.value });
      }
      if (tag === 'a') { data.attr.href = element.getAttribute('href') || '#'; data.attr.target = element.getAttribute('target') || ''; }
      if (tag === 'img') { data.attr.src = element.getAttribute('src') || ''; data.attr.alt = element.getAttribute('alt') || ''; data.attr.loading = element.getAttribute('loading') || 'lazy'; }
      node = { _id: nodeId, type: mapped.type, tag, classes: classIds, children: [], data };
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

  // Update combo class children hierarchy
  updateStylesChildren(nodes, styles);

  // Attach CSS/JS embeds
  const cssEmbed = cssString?.trim() ? createStyleEmbed(cssString) : null;
  const scriptEmbeds = createScriptEmbeds(extractedScripts, jsString);
  const rootNode = rootIds.length > 0 ? nodes.find(n => n._id === rootIds[0]) : null;
  if (rootNode) {
    if (cssEmbed) { cssEmbed.data.displayName = 'CSS'; nodes.push(cssEmbed); rootNode.children.unshift(cssEmbed._id); }
    for (const embed of scriptEmbeds) { embed.data.displayName = 'JS'; nodes.push(embed); rootNode.children.push(embed._id); }
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

function updateStylesChildren(nodes, styles) {
  const childrenMap = {};
  nodes.forEach(node => {
    if (Array.isArray(node.classes) && node.classes.length > 1) {
      for (let i = 0; i < node.classes.length - 1; i++) {
        if (!childrenMap[node.classes[i]]) childrenMap[node.classes[i]] = new Set();
        childrenMap[node.classes[i]].add(node.classes[i + 1]);
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

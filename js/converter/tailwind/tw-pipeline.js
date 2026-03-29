// Tailwind → Webflow conversion pipeline
// Resolves Tailwind utility classes to native Webflow styleLess properties

import { parseHTML } from '../html-parser.js';
import { generateId, generateClassSuffix } from '../id-generator.js';
import { mapElement, isEmbedFallback } from '../node-mapper.js';
import { createHtmlEmbedNode, createScriptEmbeds, createStyleEmbed } from '../js-handler.js';
import { resolveTailwindClasses, isTailwindClass } from './tw-resolver.js';

// Reuse toStyleLess from tree-walker for @raw wrapping
function toStyleLess(properties) {
  if (!properties || Object.keys(properties).length === 0) return '';
  const parts = [];
  for (const [prop, value] of Object.entries(properties)) {
    const wfValue = value.includes('var(') ? `@raw<|${value}|>` : value;
    parts.push(`${prop}: ${wfValue};`);
  }
  return parts.join(' ');
}

export function convertTailwind(htmlString, cssString, jsString) {
  const warnings = [];
  const { body, extractedCSS, extractedScripts } = parseHTML(htmlString || '');

  const nodes = [];
  const styles = [];
  const classMap = new Map();

  function getOrCreateStyle(className, styleLess = '', variants = {}) {
    if (classMap.has(className)) {
      // Merge styleLess if new properties
      if (styleLess) {
        const existing = styles.find(s => s._id === classMap.get(className));
        if (existing && !existing.styleLess) existing.styleLess = styleLess;
      }
      return classMap.get(className);
    }

    const suffix = generateClassSuffix();
    const styleId = `${className}-${suffix}`;
    styles.push({
      _id: styleId, fake: false, type: 'class', name: className,
      namespace: '', comb: '', styleLess, variants,
      children: [], createdBy: 'converter', origin: null, selector: null,
    });
    classMap.set(className, styleId);
    return styleId;
  }

  // Sanitize class name for Webflow (no /, no [, no special chars)
  function sanitizeName(name) {
    return name.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  // Generate a BEM-style class name for an element
  function generateClassName(element, parentName) {
    const tag = element.tagName.toLowerCase();

    // Use data-wf-class if present (explicit user-defined name)
    const wfClass = element.getAttribute('data-wf-class');
    if (wfClass) return sanitizeName(wfClass);

    // Use id if present
    if (element.id) return sanitizeName(element.id);

    // Use first non-Tailwind class if present
    const classes = element.className && typeof element.className === 'string'
      ? element.className.trim().split(/\s+/).filter(Boolean) : [];
    const customClass = classes.find(c => !isTailwindClass(c));
    if (customClass) return sanitizeName(customClass);

    // Generate from tag + parent context
    if (parentName) return `${sanitizeName(parentName)}_${tag}`;
    return tag;
  }

  // Deduplicate class names by appending a counter
  const usedNames = new Map();
  function uniqueName(name) {
    if (!usedNames.has(name)) {
      usedNames.set(name, 1);
      return name;
    }
    const count = usedNames.get(name) + 1;
    usedNames.set(name, count);
    return `${name}-${count}`;
  }

  function collectDOMAttributes(element) {
    const attributes = [];
    for (const attr of element.attributes) {
      if (attr.name === 'class' || attr.name === 'data-wf-class') continue;
      attributes.push({ name: attr.name, value: attr.value });
    }
    return attributes;
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

  function processElement(element, parentName) {
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

    // Get all classes from the element
    const allClasses = element.className && typeof element.className === 'string'
      ? element.className.trim().split(/\s+/).filter(Boolean) : [];

    // Resolve Tailwind classes to CSS properties
    const { base: cssProps, nonTailwind, warnings: twWarnings } = resolveTailwindClasses(allClasses);
    warnings.push(...twWarnings);

    // Generate a BEM-style class name
    const className = uniqueName(generateClassName(element, parentName));

    // Build styleLess from resolved Tailwind properties
    const styleLess = toStyleLess(cssProps);

    // Create style entries
    const classIds = [];

    // Main class with all resolved Tailwind styles
    if (styleLess || nonTailwind.length === 0) {
      classIds.push(getOrCreateStyle(className, styleLess));
    }

    // Pass through non-Tailwind classes as separate Webflow classes
    for (const cls of nonTailwind) {
      const safeName = sanitizeName(cls);
      if (safeName) classIds.push(getOrCreateStyle(safeName));
    }

    // Deduplicate class IDs
    const uniqueClassIds = [...new Set(classIds)];

    // Build node
    let node;
    if (mapped.isDOMType) {
      const attributes = collectDOMAttributes(element);
      node = {
        _id: nodeId, type: 'DOM', tag: 'div', classes: uniqueClassIds, children: [],
        data: { tag, attributes, slot: '', text: false, visibility: { conditions: [] } },
      };
    } else if (mapped.isNative) {
      const data = {
        devlink: { runtimeProps: {}, slot: '' }, displayName: '',
        attr: { id: element.id || '' }, xattr: [],
        search: { exclude: false }, visibility: { conditions: [] },
      };
      for (const attr of element.attributes) {
        if (attr.name === 'data-wf-class') continue;
        if (attr.name.startsWith('data-')) data.xattr.push({ name: attr.name, value: attr.value });
      }
      if (tag === 'a') { data.attr.href = element.getAttribute('href') || '#'; data.attr.target = element.getAttribute('target') || ''; }
      if (tag === 'img') { data.attr.src = element.getAttribute('src') || ''; data.attr.alt = element.getAttribute('alt') || ''; data.attr.loading = element.getAttribute('loading') || 'lazy'; }
      if (tag === 'ol') { data.list = { type: 'ordered' }; }
      const inlineStyle = element.getAttribute('style');
      if (inlineStyle) data.xattr.push({ name: 'style', value: inlineStyle });
      node = { _id: nodeId, type: mapped.type, tag, classes: uniqueClassIds, children: [], data };
    }

    nodes.push(node);

    // Process children
    if (isTextOnly(element)) {
      node.children = processTextChildren(element);
    } else {
      const childIds = [];
      for (const child of element.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const cid = processElement(child, className);
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
          const inl = {
            _id: generateId(), type: 'DOM', tag: 'div', classes: [], children: [],
            data: { tag: realTag, attributes: [], slot: '', text: false, visibility: { conditions: [] } },
          };
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
      const cid = processElement(child, null);
      if (cid) topChildIds.push(cid);
    }
  }

  // Update combo class children hierarchy
  updateStylesChildren(nodes, styles);

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
  const comboIds = new Set();
  nodes.forEach(node => {
    if (Array.isArray(node.classes) && node.classes.length > 1) {
      for (let i = 0; i < node.classes.length - 1; i++) {
        // Prevent self-referencing
        if (node.classes[i] !== node.classes[i + 1]) {
          if (!childrenMap[node.classes[i]]) childrenMap[node.classes[i]] = new Set();
          childrenMap[node.classes[i]].add(node.classes[i + 1]);
        }
      }
      for (let i = 1; i < node.classes.length; i++) {
        if (node.classes[i] !== node.classes[0]) {
          comboIds.add(node.classes[i]);
        }
      }
    }
  });
  styles.forEach(style => {
    if (childrenMap[style._id]) {
      const existing = new Set(style.children || []);
      childrenMap[style._id].forEach(c => {
        // Never add self as child
        if (c !== style._id) existing.add(c);
      });
      style.children = Array.from(existing);
    }
    if (comboIds.has(style._id)) {
      style.comb = '&';
    }
  });
}

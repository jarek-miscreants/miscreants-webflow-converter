import { generateId, generateClassSuffix } from './id-generator.js';
import { mapElement, isEmbedFallback } from './node-mapper.js';
import { createHtmlEmbedNode } from './js-handler.js';

export function walkDOM(rootElement, cssRules) {
  const nodes = [];
  const styles = [];
  const classMap = new Map(); // original class name → uniquified style ID

  // Build a style entry for a class name (with unique suffix)
  function getOrCreateStyle(className) {
    if (classMap.has(className)) return classMap.get(className);

    const suffix = generateClassSuffix();
    const styleId = `${className}-${suffix}`;
    const styleObj = {
      _id: styleId,
      fake: false,
      type: 'class',
      name: className,
      namespace: '',
      comb: '',
      styleLess: '',
      variants: {},
      children: [],
      createdBy: 'converter',
      origin: null,
      selector: null,
    };
    styles.push(styleObj);
    classMap.set(className, styleId);
    return styleId;
  }

  // Collect all HTML attributes for a DOM node
  function collectDOMAttributes(element) {
    const attributes = [];
    for (const attr of element.attributes) {
      if (attr.name === 'class') continue; // classes handled separately
      attributes.push({ name: attr.name, value: attr.value });
    }
    return attributes;
  }

  // Get class list from element
  function getClasses(element) {
    return element.className && typeof element.className === 'string'
      ? element.className.trim().split(/\s+/).filter(Boolean)
      : [];
  }

  // Check if element contains only text and basic inline formatting
  function isTextOnly(element) {
    const inlineTags = new Set(['strong', 'b', 'em', 'i', 'u', 'br']);
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) continue;
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        if (!inlineTags.has(tag)) return false;
        if (child.hasAttribute('class') || child.hasAttribute('style')) return false;
      } else {
        return false;
      }
    }
    return true;
  }

  function processElement(element) {
    if (element.nodeType !== Node.ELEMENT_NODE) return null;
    const tag = element.tagName.toLowerCase();

    // HtmlEmbed fallback
    if (isEmbedFallback(element)) {
      const embedNode = createHtmlEmbedNode(element.outerHTML);
      nodes.push(embedNode);
      return embedNode._id;
    }

    const mapped = mapElement(element);
    if (mapped.useOuterHTML) {
      const embedNode = createHtmlEmbedNode(element.outerHTML);
      nodes.push(embedNode);
      return embedNode._id;
    }

    const nodeId = generateId();
    const classes = getClasses(element);
    const classIds = classes.map(cls => getOrCreateStyle(cls));

    // Build the node
    let node;

    if (mapped.isDOMType) {
      // DOM type: most elements (div, h1-h6, button, span, svg, etc.)
      const attributes = collectDOMAttributes(element);

      node = {
        _id: nodeId,
        type: 'DOM',
        tag: 'div',
        classes: classIds,
        children: [],
        data: {
          tag,
          attributes,
          slot: '',
          text: false,
          visibility: { conditions: [] },
        },
      };
    } else if (mapped.isNative) {
      // Native Webflow types: Paragraph, Link, Image, List, etc.
      const data = {
        devlink: { runtimeProps: {}, slot: '' },
        displayName: '',
        attr: { id: element.id || '' },
        xattr: [],
        search: { exclude: false },
        visibility: { conditions: [] },
      };

      // Collect data-* attributes
      for (const attr of element.attributes) {
        if (attr.name.startsWith('data-')) {
          data.xattr.push({ name: attr.name, value: attr.value });
        }
      }

      // Type-specific data
      if (tag === 'a') {
        data.attr.href = element.getAttribute('href') || '#';
        data.attr.target = element.getAttribute('target') || '';
      }
      if (tag === 'img') {
        data.attr.src = element.getAttribute('src') || '';
        data.attr.alt = element.getAttribute('alt') || '';
        data.attr.loading = element.getAttribute('loading') || 'lazy';
      }
      if (tag === 'ol') {
        data.list = { type: 'ordered' };
      }

      // Add inline style as a style attribute if present
      const inlineStyle = element.getAttribute('style');
      if (inlineStyle) {
        data.xattr.push({ name: 'style', value: inlineStyle });
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

    // Push parent FIRST (pre-order)
    nodes.push(node);

    // Process children
    if (isTextOnly(element)) {
      const childIds = processTextChildren(element);
      node.children = childIds;
    } else {
      const childIds = [];
      for (const child of element.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const childId = processElement(child);
          if (childId) childIds.push(childId);
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
          const textNode = { _id: generateId(), text: true, v: child.textContent };
          nodes.push(textNode);
          childIds.push(textNode._id);
        }
      }
      node.children = childIds;
    }

    return nodeId;
  }

  // Process text-only children (inline formatting: strong, em, br)
  function processTextChildren(element) {
    const childIds = [];
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.textContent.trim() === '') continue;
        const textNode = { _id: generateId(), text: true, v: child.textContent };
        nodes.push(textNode);
        childIds.push(textNode._id);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName.toLowerCase();
        if (tag === 'br') {
          const brNode = {
            _id: generateId(), type: 'LineBreak', tag: 'br',
            classes: [], children: [], data: { tag: 'br' },
          };
          nodes.push(brNode);
          childIds.push(brNode._id);
        } else {
          const realTag = tag === 'b' ? 'strong' : tag === 'i' ? 'em' : tag;
          const inlineNode = {
            _id: generateId(), type: 'DOM', tag: 'div',
            classes: [], children: [],
            data: { tag: realTag, attributes: [], slot: '', text: false, visibility: { conditions: [] } },
          };
          nodes.push(inlineNode);
          const innerIds = processTextChildren(child);
          inlineNode.children = innerIds;
          childIds.push(inlineNode._id);
        }
      }
    }
    return childIds;
  }

  // Process root children
  const topChildIds = [];
  for (const child of rootElement.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const childId = processElement(child);
      if (childId) topChildIds.push(childId);
    }
  }

  // Build combo class children hierarchy:
  // When a node has classes [A, B], style A needs B in its children array
  // so Webflow displays the combo correctly in the designer
  updateStylesChildren(nodes, styles);

  // Wrap multiple top-level elements
  if (topChildIds.length > 1) {
    const wrapperId = generateId();
    nodes.push({
      _id: wrapperId, type: 'Block', tag: 'div', classes: [], children: topChildIds,
      data: {
        text: false, tag: 'div', devlink: { runtimeProps: {}, slot: '' },
        displayName: '', attr: { id: '' }, xattr: [],
        search: { exclude: false }, visibility: { conditions: [] },
      },
    });
    return { nodes, styles, rootIds: [wrapperId], classMap };
  }

  return { nodes, styles, rootIds: topChildIds, classMap };
}

function updateStylesChildren(nodes, styles) {
  const childrenMap = {};
  const comboIds = new Set(); // style IDs that appear as combo (non-first) classes

  nodes.forEach(node => {
    if (Array.isArray(node.classes) && node.classes.length > 1) {
      for (let i = 0; i < node.classes.length - 1; i++) {
        if (!childrenMap[node.classes[i]]) childrenMap[node.classes[i]] = new Set();
        childrenMap[node.classes[i]].add(node.classes[i + 1]);
      }
      // Every class after the first is a combo class
      for (let i = 1; i < node.classes.length; i++) {
        comboIds.add(node.classes[i]);
      }
    }
  });

  styles.forEach(style => {
    // Set children array on parent styles
    if (childrenMap[style._id]) {
      const existing = new Set(style.children || []);
      childrenMap[style._id].forEach(c => existing.add(c));
      style.children = Array.from(existing);
    }
    // Mark combo classes with comb: "&"
    if (comboIds.has(style._id)) {
      style.comb = '&';
    }
  });
}

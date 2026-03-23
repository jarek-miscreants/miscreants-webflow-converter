import { generateId, generateClassSuffix } from './id-generator.js';
import { mapElement, isEmbedFallback } from './node-mapper.js';
import { createHtmlEmbedNode } from './js-handler.js';
import { resolveStyles } from './css-resolver.js';

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

  // Apply resolved CSS properties to a style object
  function applyStylesToClass(styleId, properties, mediaOverrides) {
    const styleObj = styles.find(s => s._id === styleId);
    if (!styleObj) return;

    const baseStyleLess = toStyleLess(properties);
    if (baseStyleLess) {
      // Merge with existing styleLess (don't overwrite)
      styleObj.styleLess = styleObj.styleLess
        ? styleObj.styleLess + ' ' + baseStyleLess
        : baseStyleLess;
    }

    if (mediaOverrides) {
      for (const [breakpointId, props] of Object.entries(mediaOverrides)) {
        const variantStyleLess = toStyleLess(props);
        if (variantStyleLess) {
          if (!styleObj.variants[breakpointId]) {
            styleObj.variants[breakpointId] = { styleLess: '' };
          }
          styleObj.variants[breakpointId].styleLess = styleObj.variants[breakpointId].styleLess
            ? styleObj.variants[breakpointId].styleLess + ' ' + variantStyleLess
            : variantStyleLess;
        }
      }
    }
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

    // Resolve CSS styles and apply to the first class's style object
    if (cssRules.length > 0 && classIds.length > 0) {
      const resolved = resolveStyles(element, cssRules);
      if (resolved.properties && Object.keys(resolved.properties).length > 0) {
        applyStylesToClass(classIds[0], resolved.properties, resolved.mediaOverrides);
      } else if (resolved.mediaOverrides) {
        applyStylesToClass(classIds[0], {}, resolved.mediaOverrides);
      }
    }

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

// Parse a CSS shorthand value into 1-4 sides (top, right, bottom, left)
function expandSides(value) {
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
  if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
  if (parts.length === 3) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
  return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
}

// Convert CSS properties object to Webflow styleLess string (longhand only)
function toStyleLess(properties) {
  if (!properties || Object.keys(properties).length === 0) return '';

  const expanded = {};

  for (const [prop, value] of Object.entries(properties)) {
    switch (prop) {
      // Padding shorthand
      case 'padding': {
        const s = expandSides(value);
        expanded['padding-top'] = s.top;
        expanded['padding-right'] = s.right;
        expanded['padding-bottom'] = s.bottom;
        expanded['padding-left'] = s.left;
        break;
      }
      case 'padding-inline': {
        expanded['padding-left'] = value;
        expanded['padding-right'] = value;
        break;
      }
      case 'padding-block': {
        expanded['padding-top'] = value;
        expanded['padding-bottom'] = value;
        break;
      }

      // Margin shorthand
      case 'margin': {
        const s = expandSides(value);
        expanded['margin-top'] = s.top;
        expanded['margin-right'] = s.right;
        expanded['margin-bottom'] = s.bottom;
        expanded['margin-left'] = s.left;
        break;
      }
      case 'margin-inline': {
        expanded['margin-left'] = value;
        expanded['margin-right'] = value;
        break;
      }
      case 'margin-block': {
        expanded['margin-top'] = value;
        expanded['margin-bottom'] = value;
        break;
      }

      // Border-radius shorthand
      case 'border-radius': {
        const s = expandSides(value);
        expanded['border-top-left-radius'] = s.top;
        expanded['border-top-right-radius'] = s.right;
        expanded['border-bottom-right-radius'] = s.bottom;
        expanded['border-bottom-left-radius'] = s.left;
        break;
      }

      // Border shorthand: "1px solid #ccc"
      case 'border': {
        const parts = value.trim().split(/\s+/);
        if (parts.length >= 1) {
          expanded['border-top-width'] = parts[0];
          expanded['border-right-width'] = parts[0];
          expanded['border-bottom-width'] = parts[0];
          expanded['border-left-width'] = parts[0];
        }
        if (parts.length >= 2) {
          expanded['border-top-style'] = parts[1];
          expanded['border-right-style'] = parts[1];
          expanded['border-bottom-style'] = parts[1];
          expanded['border-left-style'] = parts[1];
        }
        if (parts.length >= 3) {
          expanded['border-top-color'] = parts[2];
          expanded['border-right-color'] = parts[2];
          expanded['border-bottom-color'] = parts[2];
          expanded['border-left-color'] = parts[2];
        }
        break;
      }

      // Background shorthand → background-color when it's just a color
      case 'background': {
        if (/^(#|rgb|hsl|transparent|inherit|currentColor|\w+$)/.test(value.trim())) {
          expanded['background-color'] = value;
        } else {
          expanded['background-color'] = value;
        }
        break;
      }

      // Gap → Webflow grid gap properties
      case 'gap': {
        const gapParts = value.trim().split(/\s+/);
        expanded['grid-column-gap'] = gapParts.length > 1 ? gapParts[1] : gapParts[0];
        expanded['grid-row-gap'] = gapParts[0];
        break;
      }
      case 'column-gap':
        expanded['grid-column-gap'] = value;
        break;
      case 'row-gap':
        expanded['grid-row-gap'] = value;
        break;

      // Inset shorthand
      case 'inset': {
        const s = expandSides(value);
        expanded['top'] = s.top;
        expanded['right'] = s.right;
        expanded['bottom'] = s.bottom;
        expanded['left'] = s.left;
        break;
      }

      // Overflow shorthand
      case 'overflow': {
        expanded['overflow-x'] = value;
        expanded['overflow-y'] = value;
        break;
      }

      // Everything else passes through as-is (already longhand)
      default:
        expanded[prop] = value;
    }
  }

  const parts = [];
  for (const [prop, value] of Object.entries(expanded)) {
    // Wrap var() references with @raw<|...|> for Webflow
    const wfValue = value.includes('var(') ? `@raw<|${value}|>` : value;
    parts.push(`${prop}: ${wfValue};`);
  }
  return parts.join(' ');
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

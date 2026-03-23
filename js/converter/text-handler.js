import { generateId } from './id-generator.js';

// Only pure formatting tags count as inline text — NOT span (span with classes
// is a structural element in Webflow, rendered as DOM type)
const INLINE_TEXT_TAGS = new Set(['strong', 'b', 'em', 'i', 'u', 'sub', 'sup', 'br']);

function isTextOnlyElement(element) {
  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) continue;
    if (child.nodeType === Node.ELEMENT_NODE) {
      const tag = child.tagName.toLowerCase();
      // Only bare formatting tags without classes/attributes count as inline text
      if (!INLINE_TEXT_TAGS.has(tag)) return false;
      if (child.hasAttribute('class') || child.hasAttribute('style') || child.hasAttribute('id')) return false;
    } else {
      return false;
    }
  }
  return true;
}

function buildTextChildren(element) {
  const children = [];

  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent;
      if (text.trim() === '') continue;
      children.push({
        _id: generateId(),
        text: true,
        v: text,
      });
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const tag = child.tagName.toLowerCase();
      if (tag === 'br') {
        children.push({
          _id: generateId(),
          type: 'LineBreak',
          tag: 'br',
          classes: [],
          children: [],
          data: { tag: 'br' },
        });
      } else if (INLINE_TEXT_TAGS.has(tag)) {
        // Bold, italic, underline — use DOM type (matches real Webflow format)
        const realTag = tag === 'b' ? 'strong' : tag === 'i' ? 'em' : tag;
        const inlineNode = {
          _id: generateId(),
          type: 'DOM',
          tag: 'div',
          classes: [],
          children: [],
          data: { tag: realTag, attributes: [] },
        };
        const innerChildren = buildTextChildren(child);
        inlineNode.children = innerChildren.map(c => c._id);
        children.push(inlineNode, ...innerChildren);
      }
    }
  }

  return children;
}

export function handleTextElement(element) {
  if (!isTextOnlyElement(element)) return null;

  const hasContent = Array.from(element.childNodes).some(child => {
    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) return true;
    if (child.nodeType === Node.ELEMENT_NODE) return true;
    return false;
  });

  if (!hasContent) return null;

  return buildTextChildren(element);
}

export { isTextOnlyElement };

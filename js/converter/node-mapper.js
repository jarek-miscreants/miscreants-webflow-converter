// Elements that stay as Webflow native types (Block, Paragraph, etc.)
// These get the full devlink/displayName/attr/xattr/search/visibility data structure
const NATIVE_TYPES = {
  'p': 'Paragraph',
  'ul': 'List',
  'ol': 'List',
  'li': 'ListItem',
  'img': 'Image',
  'a': 'Link',
  'video': 'Video',
  'blockquote': 'Blockquote',
};

// Elements that should be wrapped in HtmlEmbed (outerHTML)
const EMBED_FALLBACK_TAGS = new Set([
  'template',
  'svg',
]);

// Determine how an element should be mapped
export function mapElement(element) {
  const tag = element.tagName.toLowerCase();

  // Custom elements → HtmlEmbed
  if (tag.includes('-')) {
    return { type: 'HtmlEmbed', useOuterHTML: true };
  }

  // Unsupported → HtmlEmbed
  if (EMBED_FALLBACK_TAGS.has(tag)) {
    return { type: 'HtmlEmbed', useOuterHTML: true };
  }

  // Native Webflow types: Paragraph, Link, Image, List, etc.
  if (NATIVE_TYPES[tag]) {
    return { type: NATIVE_TYPES[tag], isNative: true, tag };
  }

  // Everything else → DOM type (custom element)
  // This includes: div, section, header, footer, nav, article, aside,
  // h1-h6, button, span, strong, em, svg, path, figure, etc.
  return { type: 'DOM', isDOMType: true, tag };
}

export function isEmbedFallback(element) {
  const tag = element.tagName.toLowerCase();
  return EMBED_FALLBACK_TAGS.has(tag) || tag.includes('-');
}

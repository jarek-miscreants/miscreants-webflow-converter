import { generateId } from './id-generator.js';

export function createScriptEmbeds(extractedScripts, jsTabContent) {
  const embeds = [];

  for (const script of extractedScripts) {
    let embedContent = '';
    if (script.src) {
      const typeAttr = script.type ? ` type="${script.type}"` : '';
      embedContent = `<script src="${script.src}"${typeAttr}><\/script>`;
    } else if (script.content.trim()) {
      const typeAttr = script.type ? ` type="${script.type}"` : '';
      embedContent = `<script${typeAttr}>${script.content}<\/script>`;
    }

    if (embedContent) {
      embeds.push(createHtmlEmbedNode(embedContent));
    }
  }

  // JS from the dedicated JS input tab
  if (jsTabContent && jsTabContent.trim()) {
    // Strip wrapping <script> tags if user included them
    const stripped = jsTabContent.trim().replace(/^<script[^>]*>([\s\S]*)<\/script>$/i, '$1');
    embeds.push(createHtmlEmbedNode(`<script>${stripped}<\/script>`));
  }

  return embeds;
}

export function createHtmlEmbedNode(htmlContent) {
  const hasScript = /<script[\s>]/i.test(htmlContent);
  const hasIframe = /<iframe[\s>]/i.test(htmlContent);
  const hasDiv = /<div[\s>]/i.test(htmlContent);

  return {
    _id: generateId(),
    type: 'HtmlEmbed',
    tag: 'div',
    classes: [],
    children: [],
    v: htmlContent,
    data: {
      search: { exclude: true },
      embed: {
        meta: {
          html: htmlContent,
          div: hasDiv,
          script: hasScript,
          compilable: false,
          iframe: hasIframe,
        },
        type: 'html',
      },
      insideRTE: false,
      devlink: { runtimeProps: {}, slot: '' },
      displayName: '',
      attr: { id: '' },
      xattr: [],
      visibility: { conditions: [] },
    },
  };
}

export function createStyleEmbed(cssContent) {
  if (!cssContent || !cssContent.trim()) return null;
  // Strip wrapping <style> tags if user included them
  const stripped = cssContent.trim().replace(/^<style[^>]*>([\s\S]*)<\/style>$/i, '$1');
  return createHtmlEmbedNode(`<style>${stripped}</style>`);
}

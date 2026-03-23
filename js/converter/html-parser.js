export function parseHTML(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Extract <style> tag contents
  const styleTags = doc.querySelectorAll('style');
  const cssTexts = [];
  for (const style of styleTags) {
    cssTexts.push(style.textContent);
    style.remove();
  }

  // Extract <script> tags
  const scriptTags = doc.querySelectorAll('script');
  const scripts = [];
  for (const script of scriptTags) {
    scripts.push({
      content: script.textContent || '',
      src: script.getAttribute('src') || '',
      type: script.getAttribute('type') || '',
    });
    script.remove();
  }

  // Get the body content (or the full document if no body)
  const body = doc.body;

  return {
    body,
    extractedCSS: cssTexts.join('\n'),
    extractedScripts: scripts,
  };
}

import { convert } from './converter/pipeline.js';

// ── DOM References ──
const htmlInput = document.getElementById('htmlInput');
const cssInput = document.getElementById('cssInput');
const jsInput = document.getElementById('jsInput');
const output = document.getElementById('output');
const convertBtn = document.getElementById('convertBtn');
const copyBtn = document.getElementById('copyBtn');
const copyClipboardBtn = document.getElementById('copyClipboardBtn');
const warningsEl = document.getElementById('warnings');
const statusNodes = document.getElementById('statusNodes');
const statusStyles = document.getElementById('statusStyles');
const statusMessage = document.getElementById('statusMessage');
const toast = document.getElementById('toast');
const divider = document.getElementById('divider');
const tabs = document.querySelectorAll('.tab');
const classPrefixInput = document.getElementById('classPrefixInput');
const inputs = { html: htmlInput, css: cssInput, js: jsInput };

let lastResult = null;
let detectedPrefix = null;

// ── Tab Switching ──
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    Object.values(inputs).forEach(input => input.classList.add('hidden'));
    inputs[target].classList.remove('hidden');
    inputs[target].focus();
  });
});

// Update content dots
function updateDots() {
  tabs.forEach(tab => {
    const target = tab.dataset.tab;
    const dot = tab.querySelector('.dot');
    if (inputs[target].value.trim()) {
      dot.classList.add('has-content');
    } else {
      dot.classList.remove('has-content');
    }
  });
}

Object.values(inputs).forEach(input => {
  input.addEventListener('input', updateDots);
});

// ── Convert ──
convertBtn.addEventListener('click', runConversion);

// Also convert on Ctrl+Enter
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    runConversion();
  }
});

function runConversion() {
  const html = htmlInput.value;
  const css = cssInput.value;
  const js = jsInput.value;

  if (!html.trim() && !css.trim() && !js.trim()) {
    showToast('Please enter some HTML to convert', 'warning');
    return;
  }

  try {
    statusMessage.textContent = 'Converting...';
    const { result, warnings } = convert(html, css, js);
    lastResult = result;

    // Auto-detect the class prefix from the first class in the HTML
    const firstClassMatch = html.match(/class="([^"]+)"/);
    if (firstClassMatch) {
      const firstName = firstClassMatch[1].split(/\s+/)[0];
      // Use everything before the last underscore as the prefix
      const underscoreIdx = firstName.indexOf('_');
      detectedPrefix = underscoreIdx > 0 ? firstName.substring(0, underscoreIdx) : firstName;
      classPrefixInput.placeholder = detectedPrefix;
    }

    output.value = JSON.stringify(result, null, 2);
    copyBtn.disabled = false;
    copyClipboardBtn.disabled = false;

    const nodeCount = result.payload.nodes.length;
    const styleCount = result.payload.styles.length;
    statusNodes.textContent = `Nodes: ${nodeCount}`;
    statusStyles.textContent = `Styles: ${styleCount}`;
    statusMessage.textContent = 'Conversion complete';

    // Show warnings
    if (warnings.length > 0) {
      warningsEl.classList.remove('hidden');
      warningsEl.innerHTML = warnings
        .map(w => `<div class="warning-item">${w}</div>`)
        .join('');
    } else {
      warningsEl.classList.add('hidden');
    }

    showToast('Conversion successful!');
  } catch (err) {
    statusMessage.textContent = 'Conversion failed';
    output.value = `Error: ${err.message}\n\n${err.stack}`;
    showToast('Conversion failed: ' + err.message, 'error');
    console.error('Conversion error:', err);
  }
}

// ── Copy Buttons ──
copyBtn.addEventListener('click', async () => {
  if (!lastResult) return;
  try {
    await navigator.clipboard.writeText(JSON.stringify(lastResult, null, 2));
    showToast('JSON copied to clipboard!');
  } catch {
    fallbackCopy(JSON.stringify(lastResult, null, 2));
  }
});

// "Copy for Webflow" uses the same mechanism as miscreants-starter-components:
// Sets both application/json and text/plain on clipboardData via execCommand('copy')
// This is how Webflow reads pasted component data in the Designer.
copyClipboardBtn.addEventListener('click', () => {
  if (!lastResult) return;
  let jsonString = JSON.stringify(lastResult);

  // Apply class prefix rename if user entered a custom prefix
  const newPrefix = classPrefixInput.value.trim();
  if (newPrefix && detectedPrefix && newPrefix !== detectedPrefix) {
    // Replace original prefix followed by underscore/dash + rest, or at word boundary
    const regex = new RegExp(detectedPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([_\\-][\\w\\-]*|\\b)', 'g');
    jsonString = jsonString.replace(regex, (match, suffix) => newPrefix + suffix);
  }

  const copyHandler = (event) => {
    event.preventDefault();
    event.clipboardData.setData('application/json', jsonString);
    event.clipboardData.setData('text/plain', jsonString);
  };

  document.addEventListener('copy', copyHandler);
  document.execCommand('copy');
  document.removeEventListener('copy', copyHandler);

  showToast('Copied for Webflow! Paste into the Designer.');
});

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showToast('Copied to clipboard!');
}

// ── Toast ──
let toastTimeout;
function showToast(message, type = 'success') {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.style.background = type === 'error' ? 'var(--error)'
    : type === 'warning' ? 'var(--warning)'
    : 'var(--success)';
  toast.classList.add('show');
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Resizable Divider ──
let isDragging = false;

divider.addEventListener('mousedown', (e) => {
  isDragging = true;
  divider.classList.add('active');
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const main = document.querySelector('.main');
  const rect = main.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const total = rect.width;
  const pct = Math.max(20, Math.min(80, (x / total) * 100));
  main.style.gridTemplateColumns = `${pct}% 6px 1fr`;
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  divider.classList.remove('active');
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
});

// ── Tab key support in textareas ──
Object.values(inputs).forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.value = input.value.substring(0, start) + '  ' + input.value.substring(end);
      input.selectionStart = input.selectionEnd = start + 2;
    }
  });
});

// ── Init ──
statusMessage.textContent = 'Ready — paste HTML and click Convert (Ctrl+Enter)';

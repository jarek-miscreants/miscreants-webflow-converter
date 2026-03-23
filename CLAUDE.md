# HTML to Webflow Converter

## Overview
Browser-based tool that converts HTML/CSS/JS into Webflow's clipboard JSON format (`@webflow/XscpData`). Users paste HTML, optionally add CSS/JS, click Convert, then "Copy for Webflow" to paste directly into Webflow Designer.

**Stack:** Vanilla HTML/CSS/JS with ES modules, no build step.
**Deployment:** Cloudflare Pages, auto-deploys on push to `main`.
**Repo:** https://github.com/jarek-miscreants/miscreants-webflow-converter.git

## Architecture

```
index.html          — Single-page UI (3-tab input: HTML/CSS/JS, JSON output, copy buttons)
css/styles.css      — App styling
js/app.js           — UI logic, event handlers, copy-to-clipboard mechanism
js/converter/
  pipeline.js       — Main entry: orchestrates parse → walk → embed → assemble
  html-parser.js    — DOMParser wrapper, extracts <style> and <script> from HTML
  css-parser.js     — Regex-based CSS parser, extracts rules with specificity + media queries
  css-resolver.js   — Matches CSS rules to elements by selector, merges with inline styles
  tree-walker.js    — Recursive DOM→Webflow node converter (core logic)
  node-mapper.js    — Decides element type: Native (Paragraph, Link, Image) vs DOM vs HtmlEmbed
  text-handler.js   — Handles inline text formatting (strong, em, br) inside text elements
  js-handler.js     — Creates HtmlEmbed nodes for scripts, styles, and raw HTML
  id-generator.js   — Generates Webflow-style node IDs and class suffixes
  style-mapper.js   — Builds style objects (currently minimal, used for styleLess)
  breakpoints.js    — Maps CSS media queries to Webflow breakpoint IDs
```

## Conversion Pipeline (pipeline.js)

1. **Parse HTML** → DOM tree + extracted `<style>` and `<script>` content
2. **Parse CSS** → array of `{selector, properties, mediaQuery, specificity}` rules
3. **Walk DOM** → Webflow nodes + styles arrays (tree-walker.js does the heavy lifting)
4. **Create embeds** → CSS tab → `<style>` HtmlEmbed, JS tab + extracted scripts → `<script>` HtmlEmbeds
5. **Attach embeds** as children of root node (CSS prepended, JS appended)
6. **Assemble** `@webflow/XscpData` JSON with payload, meta

## Webflow JSON Format Rules

### Node Types
- **`Block`** — div wrappers. Full data: text, tag, devlink, displayName, attr, xattr, search, visibility
- **`DOM`** — Custom Element for any HTML tag (h1-h6, button, span, svg, etc.). Always `tag: "div"` at node level, real tag in `data.tag`. Minimal data: `{tag, attributes: [{name, value}], slot, text, visibility}`
- **`Paragraph`**, **`Link`**, **`Image`**, **`List`**, **`ListItem`** — Native Webflow types with full devlink/attr/xattr data
- **`HtmlEmbed`** — Raw HTML/CSS/JS. Has both `v` (top-level) and `data.embed.meta.html` (same content). Flags: `div`, `script`, `iframe`, `compilable`. Always `data.search.exclude: true`
- **`TextNode`** — `{_id, text: true, v: "content"}` (no type field)
- **`LineBreak`** — `{type: "LineBreak", tag: "br", data: {tag: "br"}}`
- **NEVER use `Inline` type** — crashes Webflow Designer. Use `DOM` with `data.tag: "span"` instead.

### Critical Rules (learned from testing)
1. **No orphan nodes** — every node must be a child of another. Embeds must be children of root.
2. **Pre-order traversal** — parent nodes BEFORE children in the `nodes` array.
3. **Unique class suffixes** — style `_id` = `className-randomSuffix24chars`, `name` = clean class name. Prevents conflicts when pasting.
4. **CSS selectors in embeds use `data-el` attributes** — Webflow renames classes on paste but never touches `data-*` attributes. Rewrite `.className` → `[data-el="className"]` in embedded CSS/JS.
5. **`gap` → `grid-column-gap` + `grid-row-gap`** — Webflow uses older grid gap properties in styleLess.
6. **`styleLess` requires longhand properties only** — Webflow Designer does not understand CSS shorthands. All shorthands must be expanded: `padding` → `padding-top/right/bottom/left`, `margin` → individual sides, `border` → width/style/color per side, `border-radius` → four corners, `background` → `background-color`, `gap` → `grid-column-gap` + `grid-row-gap`, `inset` → `top/right/bottom/left`, `overflow` → `overflow-x` + `overflow-y`. The `toStyleLess()` function in `tree-walker.js` handles this expansion.

### Combo Classes
When a node has multiple classes (`classes: [baseId, comboId]`):
- **Base class style:** `comb: ""`, `children: [comboId]`
- **Combo class style:** `comb: "&"`, `children: []`
- The `updateStylesChildren()` function in tree-walker.js handles this automatically by scanning all nodes for multi-class usage.

### Style Object Shape
```json
{
  "_id": "className-24charSuffix",
  "fake": false,
  "type": "class",
  "name": "className",
  "namespace": "",
  "comb": "",
  "styleLess": "",
  "variants": {},
  "children": [],
  "createdBy": "converter",
  "origin": null,
  "selector": null
}
```

### HtmlEmbed Node Shape
```json
{
  "_id": "...",
  "type": "HtmlEmbed",
  "tag": "div",
  "classes": [],
  "children": [],
  "v": "<raw html>",
  "data": {
    "search": { "exclude": true },
    "embed": {
      "meta": { "html": "<same raw html>", "div": false, "script": false, "compilable": false, "iframe": false },
      "type": "html"
    },
    "insideRTE": false,
    "devlink": { "runtimeProps": {}, "slot": "" },
    "displayName": "",
    "attr": { "id": "" },
    "xattr": [],
    "visibility": { "conditions": [] }
  }
}
```

## Element Mapping (node-mapper.js)

| HTML Tag | Webflow Type | Notes |
|----------|-------------|-------|
| `p` | `Paragraph` | Native type |
| `a` | `Link` | Native, gets `href`/`target` in data.attr |
| `img` | `Image` | Native, gets `src`/`alt`/`loading` |
| `ul`, `ol` | `List` | Native, ol gets `data.list.type: "ordered"` |
| `li` | `ListItem` | Native |
| `form` | `FormWrapper` | Native |
| `input`, `textarea`, `select` | Form types | Native |
| `video` | `Video` | Native |
| `blockquote` | `Blockquote` | Native |
| `div`, `section`, `header`, `nav`, `h1-h6`, `button`, `span`, `svg`, `table`, `tr`, `td`, `th`, `thead`, `tbody`, `canvas`, `iframe`, `audio`, `details`, `summary`, `dialog`, etc. | `DOM` | Custom Element, real tag in `data.tag` |
| `template`, custom elements (`tag-name`) | `HtmlEmbed` | Wrapped as raw HTML via `outerHTML` |

## Copy Mechanism
The "Copy for Webflow" button uses `document.execCommand('copy')` with a `copy` event listener that sets both `application/json` and `text/plain` on `clipboardData`. This is how Webflow reads pasted component data in the Designer.

Optional class prefix renaming is available — replaces detected prefix in the JSON string before copying.

## CSS Handling
- **Inline styles** (`style="..."`) → parsed and available via css-resolver.js
- **`<style>` tags in HTML input** → extracted, parsed for selector matching, NOT put in embeds (already in the DOM)
- **CSS tab content** → goes into a `<style>` HtmlEmbed (raw, unmodified)
- **`@media` queries** → snapped to nearest Webflow breakpoint using midpoint ranges (see below). Matched styles populate `styleLess` on base styles and `variants` for breakpoint overrides.
- **CSS variables** → `var()` values wrapped with `@raw<|...|>` in `styleLess`. `:root` variable declarations extracted into a separate `<style>` HtmlEmbed so Webflow Designer can resolve them.
- **Other `@` rules** (`@property`, `@keyframes`, `@font-face`, `@layer`) → silently skipped by CSS parser. If in CSS tab, they pass through raw in the embed but Webflow Designer won't understand them (they work on published site only).

## Webflow Breakpoints (breakpoints.js)

Media queries are **snapped to the nearest Webflow breakpoint** using midpoint ranges, so non-standard values like `1000px` or `800px` map correctly.

| Breakpoint | ID | max-width range | Webflow threshold |
|-----------|-----|-----------------|-------------------|
| Desktop | `main` | Default (no media query) | >991px |
| Tablet | `medium` | ≥880px | ≤991px |
| Mobile landscape | `small` | 623–879px | ≤767px |
| Mobile portrait | `tiny` | ≤622px | ≤478px |

| Breakpoint | ID | min-width range | Webflow threshold |
|-----------|-----|-----------------|-------------------|
| Large | `xl` | 992–1679px | ≥1440px |
| Extra large | `xxl` | ≥1680px | ≥1920px |

## Known Limitations
- No Tailwind class conversion (removed — planned rebuild with CSS-in-embed approach)
- `@property`, `@keyframes` etc. in CSS tab pass through raw but aren't flagged as warnings
- `styleLess` generation is minimal — most styling relies on CSS embeds with `data-el` selectors
- No interaction/animation (ix2) generation
- No CMS binding support

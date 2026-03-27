// Tailwind class → CSS properties lookup table
// All values are longhand (Webflow requirement)

export const TW = {
  // ── Display ──
  'block': { display: 'block' },
  'inline-block': { display: 'inline-block' },
  'inline': { display: 'inline' },
  'flex': { display: 'flex' },
  'inline-flex': { display: 'inline-flex' },
  'grid': { display: 'grid' },
  'inline-grid': { display: 'inline-grid' },
  'contents': { display: 'contents' },
  'hidden': { display: 'none' },
  'table': { display: 'table' },
  'table-row': { display: 'table-row' },
  'table-cell': { display: 'table-cell' },

  // ── Flex ──
  'flex-row': { 'flex-direction': 'row' },
  'flex-row-reverse': { 'flex-direction': 'row-reverse' },
  'flex-col': { 'flex-direction': 'column' },
  'flex-col-reverse': { 'flex-direction': 'column-reverse' },
  'flex-wrap': { 'flex-wrap': 'wrap' },
  'flex-wrap-reverse': { 'flex-wrap': 'wrap-reverse' },
  'flex-nowrap': { 'flex-wrap': 'nowrap' },
  'flex-1': { flex: '1 1 0%' },
  'flex-auto': { flex: '1 1 auto' },
  'flex-initial': { flex: '0 1 auto' },
  'flex-none': { flex: 'none' },
  'grow': { 'flex-grow': '1' },
  'grow-0': { 'flex-grow': '0' },
  'shrink': { 'flex-shrink': '1' },
  'shrink-0': { 'flex-shrink': '0' },

  // ── Align ──
  'items-start': { 'align-items': 'flex-start' },
  'items-end': { 'align-items': 'flex-end' },
  'items-center': { 'align-items': 'center' },
  'items-baseline': { 'align-items': 'baseline' },
  'items-stretch': { 'align-items': 'stretch' },
  'self-auto': { 'align-self': 'auto' },
  'self-start': { 'align-self': 'flex-start' },
  'self-end': { 'align-self': 'flex-end' },
  'self-center': { 'align-self': 'center' },
  'self-stretch': { 'align-self': 'stretch' },
  'self-baseline': { 'align-self': 'baseline' },

  // ── Justify ──
  'justify-start': { 'justify-content': 'flex-start' },
  'justify-end': { 'justify-content': 'flex-end' },
  'justify-center': { 'justify-content': 'center' },
  'justify-between': { 'justify-content': 'space-between' },
  'justify-around': { 'justify-content': 'space-around' },
  'justify-evenly': { 'justify-content': 'space-evenly' },
  'justify-items-start': { 'justify-items': 'start' },
  'justify-items-end': { 'justify-items': 'end' },
  'justify-items-center': { 'justify-items': 'center' },
  'justify-items-stretch': { 'justify-items': 'stretch' },
  'justify-self-auto': { 'justify-self': 'auto' },
  'justify-self-start': { 'justify-self': 'start' },
  'justify-self-end': { 'justify-self': 'end' },
  'justify-self-center': { 'justify-self': 'center' },
  'justify-self-stretch': { 'justify-self': 'stretch' },

  // ── Position ──
  'static': { position: 'static' },
  'fixed': { position: 'fixed' },
  'absolute': { position: 'absolute' },
  'relative': { position: 'relative' },
  'sticky': { position: 'sticky' },
  'inset-0': { top: '0', right: '0', bottom: '0', left: '0' },
  'inset-auto': { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' },
  'inset-x-0': { left: '0', right: '0' },
  'inset-y-0': { top: '0', bottom: '0' },
  'top-0': { top: '0' },
  'right-0': { right: '0' },
  'bottom-0': { bottom: '0' },
  'left-0': { left: '0' },
  'top-auto': { top: 'auto' },
  'right-auto': { right: 'auto' },
  'bottom-auto': { bottom: 'auto' },
  'left-auto': { left: 'auto' },

  // ── Z-Index ──
  'z-0': { 'z-index': '0' },
  'z-10': { 'z-index': '10' },
  'z-20': { 'z-index': '20' },
  'z-30': { 'z-index': '30' },
  'z-40': { 'z-index': '40' },
  'z-50': { 'z-index': '50' },
  'z-auto': { 'z-index': 'auto' },

  // ── Width ──
  'w-full': { width: '100%' },
  'w-screen': { width: '100vw' },
  'w-auto': { width: 'auto' },
  'w-min': { width: 'min-content' },
  'w-max': { width: 'max-content' },
  'w-fit': { width: 'fit-content' },
  'w-1/2': { width: '50%' },
  'w-1/3': { width: '33.333333%' },
  'w-2/3': { width: '66.666667%' },
  'w-1/4': { width: '25%' },
  'w-3/4': { width: '75%' },
  'w-1/5': { width: '20%' },
  'w-2/5': { width: '40%' },
  'w-3/5': { width: '60%' },
  'w-4/5': { width: '80%' },

  // ── Height ──
  'h-full': { height: '100%' },
  'h-screen': { height: '100vh' },
  'h-auto': { height: 'auto' },
  'h-min': { height: 'min-content' },
  'h-max': { height: 'max-content' },
  'h-fit': { height: 'fit-content' },

  // ── Min/Max ──
  'min-w-0': { 'min-width': '0' },
  'min-w-full': { 'min-width': '100%' },
  'min-w-min': { 'min-width': 'min-content' },
  'min-w-max': { 'min-width': 'max-content' },
  'min-h-0': { 'min-height': '0' },
  'min-h-full': { 'min-height': '100%' },
  'min-h-screen': { 'min-height': '100vh' },
  'max-w-none': { 'max-width': 'none' },
  'max-w-full': { 'max-width': '100%' },
  'max-w-min': { 'max-width': 'min-content' },
  'max-w-max': { 'max-width': 'max-content' },
  'max-w-fit': { 'max-width': 'fit-content' },
  'max-w-xs': { 'max-width': '20rem' },
  'max-w-sm': { 'max-width': '24rem' },
  'max-w-md': { 'max-width': '28rem' },
  'max-w-lg': { 'max-width': '32rem' },
  'max-w-xl': { 'max-width': '36rem' },
  'max-w-2xl': { 'max-width': '42rem' },
  'max-w-3xl': { 'max-width': '48rem' },
  'max-w-4xl': { 'max-width': '56rem' },
  'max-w-5xl': { 'max-width': '64rem' },
  'max-w-6xl': { 'max-width': '72rem' },
  'max-w-7xl': { 'max-width': '80rem' },
  'max-h-full': { 'max-height': '100%' },
  'max-h-screen': { 'max-height': '100vh' },

  // ── Overflow ──
  'overflow-auto': { 'overflow-x': 'auto', 'overflow-y': 'auto' },
  'overflow-hidden': { 'overflow-x': 'hidden', 'overflow-y': 'hidden' },
  'overflow-visible': { 'overflow-x': 'visible', 'overflow-y': 'visible' },
  'overflow-scroll': { 'overflow-x': 'scroll', 'overflow-y': 'scroll' },
  'overflow-x-auto': { 'overflow-x': 'auto' },
  'overflow-y-auto': { 'overflow-y': 'auto' },
  'overflow-x-hidden': { 'overflow-x': 'hidden' },
  'overflow-y-hidden': { 'overflow-y': 'hidden' },

  // ── Typography ──
  'text-left': { 'text-align': 'left' },
  'text-center': { 'text-align': 'center' },
  'text-right': { 'text-align': 'right' },
  'text-justify': { 'text-align': 'justify' },
  'uppercase': { 'text-transform': 'uppercase' },
  'lowercase': { 'text-transform': 'lowercase' },
  'capitalize': { 'text-transform': 'capitalize' },
  'normal-case': { 'text-transform': 'none' },
  'italic': { 'font-style': 'italic' },
  'not-italic': { 'font-style': 'normal' },
  'underline': { 'text-decoration-line': 'underline' },
  'overline': { 'text-decoration-line': 'overline' },
  'line-through': { 'text-decoration-line': 'line-through' },
  'no-underline': { 'text-decoration-line': 'none' },
  'antialiased': { '-webkit-font-smoothing': 'antialiased' },
  'subpixel-antialiased': { '-webkit-font-smoothing': 'auto' },
  'truncate': { 'overflow-x': 'hidden', 'overflow-y': 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' },
  'text-ellipsis': { 'text-overflow': 'ellipsis' },
  'text-clip': { 'text-overflow': 'clip' },
  'whitespace-normal': { 'white-space': 'normal' },
  'whitespace-nowrap': { 'white-space': 'nowrap' },
  'whitespace-pre': { 'white-space': 'pre' },
  'whitespace-pre-line': { 'white-space': 'pre-line' },
  'whitespace-pre-wrap': { 'white-space': 'pre-wrap' },
  'break-normal': { 'word-break': 'normal', 'overflow-wrap': 'normal' },
  'break-words': { 'overflow-wrap': 'break-word' },
  'break-all': { 'word-break': 'break-all' },

  // ── Font Size ──
  'text-xs': { 'font-size': '0.75rem', 'line-height': '1rem' },
  'text-sm': { 'font-size': '0.875rem', 'line-height': '1.25rem' },
  'text-base': { 'font-size': '1rem', 'line-height': '1.5rem' },
  'text-lg': { 'font-size': '1.125rem', 'line-height': '1.75rem' },
  'text-xl': { 'font-size': '1.25rem', 'line-height': '1.75rem' },
  'text-2xl': { 'font-size': '1.5rem', 'line-height': '2rem' },
  'text-3xl': { 'font-size': '1.875rem', 'line-height': '2.25rem' },
  'text-4xl': { 'font-size': '2.25rem', 'line-height': '2.5rem' },
  'text-5xl': { 'font-size': '3rem', 'line-height': '1' },
  'text-6xl': { 'font-size': '3.75rem', 'line-height': '1' },
  'text-7xl': { 'font-size': '4.5rem', 'line-height': '1' },
  'text-8xl': { 'font-size': '6rem', 'line-height': '1' },
  'text-9xl': { 'font-size': '8rem', 'line-height': '1' },

  // ── Font Weight ──
  'font-thin': { 'font-weight': '100' },
  'font-extralight': { 'font-weight': '200' },
  'font-light': { 'font-weight': '300' },
  'font-normal': { 'font-weight': '400' },
  'font-medium': { 'font-weight': '500' },
  'font-semibold': { 'font-weight': '600' },
  'font-bold': { 'font-weight': '700' },
  'font-extrabold': { 'font-weight': '800' },
  'font-black': { 'font-weight': '900' },

  // ── Line Height ──
  'leading-none': { 'line-height': '1' },
  'leading-tight': { 'line-height': '1.25' },
  'leading-snug': { 'line-height': '1.375' },
  'leading-normal': { 'line-height': '1.5' },
  'leading-relaxed': { 'line-height': '1.625' },
  'leading-loose': { 'line-height': '2' },

  // ── Letter Spacing ──
  'tracking-tighter': { 'letter-spacing': '-0.05em' },
  'tracking-tight': { 'letter-spacing': '-0.025em' },
  'tracking-normal': { 'letter-spacing': '0em' },
  'tracking-wide': { 'letter-spacing': '0.025em' },
  'tracking-wider': { 'letter-spacing': '0.05em' },
  'tracking-widest': { 'letter-spacing': '0.1em' },

  // ── Border Style ──
  'border-solid': { 'border-top-style': 'solid', 'border-right-style': 'solid', 'border-bottom-style': 'solid', 'border-left-style': 'solid' },
  'border-dashed': { 'border-top-style': 'dashed', 'border-right-style': 'dashed', 'border-bottom-style': 'dashed', 'border-left-style': 'dashed' },
  'border-dotted': { 'border-top-style': 'dotted', 'border-right-style': 'dotted', 'border-bottom-style': 'dotted', 'border-left-style': 'dotted' },
  'border-none': { 'border-top-style': 'none', 'border-right-style': 'none', 'border-bottom-style': 'none', 'border-left-style': 'none' },

  // ── Object Fit ──
  'object-contain': { 'object-fit': 'contain' },
  'object-cover': { 'object-fit': 'cover' },
  'object-fill': { 'object-fit': 'fill' },
  'object-none': { 'object-fit': 'none' },
  'object-scale-down': { 'object-fit': 'scale-down' },

  // ── Cursor ──
  'cursor-auto': { cursor: 'auto' },
  'cursor-default': { cursor: 'default' },
  'cursor-pointer': { cursor: 'pointer' },
  'cursor-wait': { cursor: 'wait' },
  'cursor-text': { cursor: 'text' },
  'cursor-move': { cursor: 'move' },
  'cursor-not-allowed': { cursor: 'not-allowed' },
  'cursor-grab': { cursor: 'grab' },

  // ── Pointer Events ──
  'pointer-events-none': { 'pointer-events': 'none' },
  'pointer-events-auto': { 'pointer-events': 'auto' },

  // ── User Select ──
  'select-none': { 'user-select': 'none' },
  'select-text': { 'user-select': 'text' },
  'select-all': { 'user-select': 'all' },
  'select-auto': { 'user-select': 'auto' },

  // ── Visibility ──
  'visible': { visibility: 'visible' },
  'invisible': { visibility: 'hidden' },
  'collapse': { visibility: 'collapse' },

  // ── Opacity ──
  'opacity-0': { opacity: '0' },
  'opacity-5': { opacity: '0.05' },
  'opacity-10': { opacity: '0.1' },
  'opacity-20': { opacity: '0.2' },
  'opacity-25': { opacity: '0.25' },
  'opacity-30': { opacity: '0.3' },
  'opacity-40': { opacity: '0.4' },
  'opacity-50': { opacity: '0.5' },
  'opacity-60': { opacity: '0.6' },
  'opacity-70': { opacity: '0.7' },
  'opacity-75': { opacity: '0.75' },
  'opacity-80': { opacity: '0.8' },
  'opacity-90': { opacity: '0.9' },
  'opacity-95': { opacity: '0.95' },
  'opacity-100': { opacity: '1' },

  // ── Mix Blend Mode ──
  'mix-blend-normal': { 'mix-blend-mode': 'normal' },
  'mix-blend-multiply': { 'mix-blend-mode': 'multiply' },
  'mix-blend-screen': { 'mix-blend-mode': 'screen' },
  'mix-blend-overlay': { 'mix-blend-mode': 'overlay' },
  'mix-blend-darken': { 'mix-blend-mode': 'darken' },
  'mix-blend-lighten': { 'mix-blend-mode': 'lighten' },

  // ── Transition ──
  'transition': { 'transition-property': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter', 'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)', 'transition-duration': '150ms' },
  'transition-all': { 'transition-property': 'all', 'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)', 'transition-duration': '150ms' },
  'transition-none': { 'transition-property': 'none' },

  // ── Grid ──
  // Expanded (not repeat()) — Webflow Designer has a paste bug where repeat(N, ...)
  // only applies to the first cell. Spelling out each column works around it.
  'grid-cols-1': { 'grid-template-columns': 'minmax(0px, 1fr)' },
  'grid-cols-2': { 'grid-template-columns': 'minmax(0px, 1fr) minmax(0px, 1fr)' },
  'grid-cols-3': { 'grid-template-columns': 'minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr)' },
  'grid-cols-4': { 'grid-template-columns': 'minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr)' },
  'grid-cols-5': { 'grid-template-columns': 'minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr)' },
  'grid-cols-6': { 'grid-template-columns': 'minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr)' },
  'grid-cols-12': { 'grid-template-columns': 'minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr)' },
  'grid-rows-1': { 'grid-template-rows': 'minmax(0px, 1fr)' },
  'grid-rows-2': { 'grid-template-rows': 'minmax(0px, 1fr) minmax(0px, 1fr)' },
  'grid-rows-3': { 'grid-template-rows': 'minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr)' },
  'col-span-1': { 'grid-column': 'span 1 / span 1' },
  'col-span-2': { 'grid-column': 'span 2 / span 2' },
  'col-span-3': { 'grid-column': 'span 3 / span 3' },
  'col-span-4': { 'grid-column': 'span 4 / span 4' },
  'col-span-full': { 'grid-column': '1 / -1' },
  'row-span-1': { 'grid-row': 'span 1 / span 1' },
  'row-span-2': { 'grid-row': 'span 2 / span 2' },
  'row-span-full': { 'grid-row': '1 / -1' },
  'place-items-center': { 'place-items': 'center' },
  'place-content-center': { 'place-content': 'center' },

  // ── Aspect Ratio ──
  'aspect-auto': { 'aspect-ratio': 'auto' },
  'aspect-square': { 'aspect-ratio': '1 / 1' },
  'aspect-video': { 'aspect-ratio': '16 / 9' },

  // ── Text Decoration ──
  'decoration-none': { 'text-decoration-line': 'none' },

  // ── List Style ──
  'list-none': { 'list-style-type': 'none' },
  'list-disc': { 'list-style-type': 'disc' },
  'list-decimal': { 'list-style-type': 'decimal' },
  'list-inside': { 'list-style-position': 'inside' },
  'list-outside': { 'list-style-position': 'outside' },

  // ── SR Only ──
  'sr-only': { position: 'absolute', width: '1px', height: '1px', 'margin-top': '-1px', 'margin-right': '-1px', 'margin-bottom': '-1px', 'margin-left': '-1px', 'padding-top': '0', 'padding-right': '0', 'padding-bottom': '0', 'padding-left': '0', 'overflow-x': 'hidden', 'overflow-y': 'hidden', clip: 'rect(0, 0, 0, 0)', 'white-space': 'nowrap', 'border-top-width': '0', 'border-right-width': '0', 'border-bottom-width': '0', 'border-left-width': '0' },
  'not-sr-only': { position: 'static', width: 'auto', height: 'auto', 'margin-top': '0', 'margin-right': '0', 'margin-bottom': '0', 'margin-left': '0', 'overflow-x': 'visible', 'overflow-y': 'visible', clip: 'auto', 'white-space': 'normal' },

  // ── Order ──
  'order-first': { order: '-9999' },
  'order-last': { order: '9999' },
  'order-none': { order: '0' },
};

// Tailwind spacing scale: number → rem value
export const SPACING = {
  '0': '0px', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem',
  '2': '0.5rem', '2.5': '0.625rem', '3': '0.75rem', '3.5': '0.875rem',
  '4': '1rem', '5': '1.25rem', '6': '1.5rem', '7': '1.75rem',
  '8': '2rem', '9': '2.25rem', '10': '2.5rem', '11': '2.75rem',
  '12': '3rem', '14': '3.5rem', '16': '4rem', '20': '5rem',
  '24': '6rem', '28': '7rem', '32': '8rem', '36': '9rem',
  '40': '10rem', '44': '11rem', '48': '12rem', '52': '13rem',
  '56': '14rem', '60': '15rem', '64': '16rem', '72': '18rem',
  '80': '20rem', '96': '24rem', 'px': '1px',
};

// Tailwind color palette → hex
export const COLORS = {
  transparent: 'transparent', current: 'currentColor',
  black: '#000000', white: '#ffffff',
  slate: { 50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a',950:'#020617' },
  gray: { 50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827',950:'#030712' },
  zinc: { 50:'#fafafa',100:'#f4f4f5',200:'#e4e4e7',300:'#d4d4d8',400:'#a1a1aa',500:'#71717a',600:'#52525b',700:'#3f3f46',800:'#27272a',900:'#18181b',950:'#09090b' },
  neutral: { 50:'#fafafa',100:'#f5f5f5',200:'#e5e5e5',300:'#d4d4d4',400:'#a3a3a3',500:'#737373',600:'#525252',700:'#404040',800:'#262626',900:'#171717',950:'#0a0a0a' },
  stone: { 50:'#fafaf9',100:'#f5f5f4',200:'#e7e5e4',300:'#d6d3d1',400:'#a8a29e',500:'#78716c',600:'#57534e',700:'#44403c',800:'#292524',900:'#1c1917',950:'#0c0a09' },
  red: { 50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c',800:'#991b1b',900:'#7f1d1d',950:'#450a0a' },
  orange: { 50:'#fff7ed',100:'#ffedd5',200:'#fed7aa',300:'#fdba74',400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c',800:'#9a3412',900:'#7c2d12',950:'#431407' },
  amber: { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f',950:'#451a03' },
  yellow: { 50:'#fefce8',100:'#fef9c3',200:'#fef08a',300:'#fde047',400:'#facc15',500:'#eab308',600:'#ca8a04',700:'#a16207',800:'#854d0e',900:'#713f12',950:'#422006' },
  lime: { 50:'#f7fee7',100:'#ecfccb',200:'#d9f99d',300:'#bef264',400:'#a3e635',500:'#84cc16',600:'#65a30d',700:'#4d7c0f',800:'#3f6212',900:'#365314',950:'#1a2e05' },
  green: { 50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d',950:'#052e16' },
  emerald: { 50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b',950:'#022c22' },
  teal: { 50:'#f0fdfa',100:'#ccfbf1',200:'#99f6e4',300:'#5eead4',400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e',800:'#115e59',900:'#134e4a',950:'#042f2e' },
  cyan: { 50:'#ecfeff',100:'#cffafe',200:'#a5f3fc',300:'#67e8f9',400:'#22d3ee',500:'#06b6d4',600:'#0891b2',700:'#0e7490',800:'#155e75',900:'#164e63',950:'#083344' },
  sky: { 50:'#f0f9ff',100:'#e0f2fe',200:'#bae6fd',300:'#7dd3fc',400:'#38bdf8',500:'#0ea5e9',600:'#0284c7',700:'#0369a1',800:'#075985',900:'#0c4a6e',950:'#082f49' },
  blue: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a',950:'#172554' },
  indigo: { 50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81',950:'#1e1b4b' },
  violet: { 50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95',950:'#2e1065' },
  purple: { 50:'#faf5ff',100:'#f3e8ff',200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87',950:'#3b0764' },
  fuchsia: { 50:'#fdf4ff',100:'#fae8ff',200:'#f5d0fe',300:'#f0abfc',400:'#e879f9',500:'#d946ef',600:'#c026d3',700:'#a21caf',800:'#86198f',900:'#701a75',950:'#4a044e' },
  pink: { 50:'#fdf2f8',100:'#fce7f3',200:'#fbcfe8',300:'#f9a8d4',400:'#f472b6',500:'#ec4899',600:'#db2777',700:'#be185d',800:'#9d174d',900:'#831843',950:'#500724' },
  rose: { 50:'#fff1f2',100:'#ffe4e6',200:'#fecdd3',300:'#fda4af',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239',900:'#881337',950:'#4c0519' },
};

// Border radius scale
export const RADIUS = {
  'none': '0px', 'sm': '0.125rem', 'DEFAULT': '0.25rem', 'md': '0.375rem',
  'lg': '0.5rem', 'xl': '0.75rem', '2xl': '1rem', '3xl': '1.5rem', 'full': '9999px',
};

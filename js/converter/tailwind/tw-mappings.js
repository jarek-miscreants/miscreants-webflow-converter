/**
 * Comprehensive Tailwind to Miscreants class mappings
 * Maps Tailwind utility classes to their Miscreants equivalents
 */

// Direct one-to-one mappings
export const directMappings = {
  // Display
  'hidden': 'display-none',
  'block': 'display-block',
  'inline': 'display-inline',
  'inline-block': 'display-inline-block',
  'inline-flex': 'display-inline-flex',
  'inline-grid': 'display-inline-grid',
  'contents': 'display-contents',
  
  // Position
  'static': 'position-static',
  'relative': 'position-relative',
  'absolute': 'position-absolute',
  'fixed': 'position-fixed',
  'sticky': 'position-sticky',
  
  // Overflow
  'overflow-hidden': 'overflow-hidden',
  'overflow-visible': 'overflow-visible',
  'overflow-auto': 'overflow-auto',
  'overflow-scroll': 'overflow-scroll',
  'overflow-clip': 'overflow-clip',
  'overflow-x-auto': 'overflow-x-auto',
  'overflow-y-auto': 'overflow-y-auto',
  
  // Width/Height
  'w-full': 'width-full',
  'h-full': 'height-full',
  'min-h-screen': 'min-height-screen',
  
  // Text alignment
  'text-left': 'text-align-left',
  'text-center': 'text-align-center',
  'text-right': 'text-align-right',
  
  // Text transform
  'uppercase': 'text-transform-uppercase',
  'lowercase': 'text-transform-lowercase',
  'capitalize': 'text-transform-capitalize',
  'normal-case': 'text-transform-none',
  
  // Font weight
  'font-light': 'text-weight-light',
  'font-normal': 'text-weight-normal',
  'font-medium': 'text-weight-normal',
  'font-semibold': 'text-weight-bold',
  'font-bold': 'text-weight-bold',
  
  // Text wrap
  'text-wrap': 'text-wrap-wrap',
  'text-balance': 'text-wrap-balance',
  'text-pretty': 'text-wrap-pretty',
  
  // Line clamp
  'line-clamp-1': 'line-clamp-1',
  'line-clamp-2': 'line-clamp-2',
  'line-clamp-3': 'line-clamp-3',
  'line-clamp-4': 'line-clamp-4',
  
  // Flex wrap
  'flex-wrap': 'hflex-wrap',
  'flex-nowrap': null, // default in Miscreants
  
  // Flex grow/shrink
  'grow': 'flex-grow',
  'grow-0': null,
  'shrink': 'flex-shrink',
  'shrink-0': 'flex-noshrink',
  
  // Order
  'order-first': 'order-first',
  'order-last': 'order-last',
  
  // Pointer events
  'pointer-events-none': 'pointer-events-off',
  'pointer-events-auto': 'pointer-on',
  
  // Screen reader
  'sr-only': 'sr-only',
  
  // Object fit (for cover utility)
  'object-cover': 'cover',
};

// Margin mappings - Tailwind uses 4px scale, Miscreants uses custom scale
export const marginMappings = {
  // Margin top
  'mt-0': 'mt-0',
  'mt-1': 'mt-1',
  'mt-2': 'mt-1',
  'mt-3': 'mt-2',
  'mt-4': 'mt-2',
  'mt-5': 'mt-3',
  'mt-6': 'mt-3',
  'mt-8': 'mt-4',
  'mt-10': 'mt-5',
  'mt-12': 'mt-5',
  'mt-16': 'mt-6',
  'mt-20': 'mt-7',
  'mt-24': 'mt-8',
  'mt-auto': 'margin-top-auto',
  
  // Margin bottom
  'mb-0': 'mb-0',
  'mb-1': 'mb-1',
  'mb-2': 'mb-1',
  'mb-3': 'mb-2',
  'mb-4': 'mb-2',
  'mb-5': 'mb-3',
  'mb-6': 'mb-3',
  'mb-8': 'mb-4',
  'mb-10': 'mb-5',
  'mb-12': 'mb-5',
  'mb-16': 'mb-6',
  'mb-20': 'mb-7',
  'mb-24': 'mb-8',
  
  // Margin inline auto
  'mx-auto': 'margin-inline-auto',
};

// Padding mappings
export const paddingMappings = {
  // Padding all sides (block + inline)
  'p-0': ['p-block-0', 'p-inline-0'],
  'p-1': ['p-block-1', 'p-inline-1'],
  'p-2': ['p-block-1', 'p-inline-1'],
  'p-3': ['p-block-2', 'p-inline-2'],
  'p-4': ['p-block-2', 'p-inline-2'],
  'p-5': ['p-block-3', 'p-inline-3'],
  'p-6': ['p-block-3', 'p-inline-3'],
  'p-8': ['p-block-4', 'p-inline-4'],
  'p-10': ['p-block-5', 'p-inline-5'],
  'p-12': ['p-block-5', 'p-inline-5'],
  'p-16': ['p-block-6', 'p-inline-6'],
  'p-20': ['p-block-7', 'p-inline-7'],
  'p-24': ['p-block-8', 'p-inline-8'],
  
  // Padding X (inline)
  'px-0': 'p-inline-0',
  'px-1': 'p-inline-1',
  'px-2': 'p-inline-1',
  'px-3': 'p-inline-2',
  'px-4': 'p-inline-2',
  'px-5': 'p-inline-3',
  'px-6': 'p-inline-3',
  'px-8': 'p-inline-4',
  'px-10': 'p-inline-5',
  'px-12': 'p-inline-5',
  'px-16': 'p-inline-6',
  'px-20': 'p-inline-7',
  'px-24': 'p-inline-8',
  
  // Padding Y (block)
  'py-0': 'p-block-0',
  'py-1': 'p-block-1',
  'py-2': 'p-block-1',
  'py-3': 'p-block-2',
  'py-4': 'p-block-2',
  'py-5': 'p-block-3',
  'py-6': 'p-block-3',
  'py-8': 'p-block-4',
  'py-10': 'p-block-5',
  'py-12': 'p-block-5',
  'py-16': 'p-block-6',
  'py-20': 'p-block-7',
  'py-24': 'p-block-8',
  
  // Padding top
  'pt-0': 'p-top-0',
  'pt-1': 'p-top-1',
  'pt-2': 'p-top-1',
  'pt-3': 'p-top-2',
  'pt-4': 'p-top-2',
  'pt-5': 'p-top-3',
  'pt-6': 'p-top-3',
  'pt-8': 'p-top-4',
  'pt-10': 'p-top-5',
  'pt-12': 'p-top-5',
  'pt-16': 'p-top-6',
  'pt-20': 'p-top-7',
  'pt-24': 'p-top-8',
  
  // Padding bottom
  'pb-0': 'p-bottom-0',
  'pb-1': 'p-bottom-1',
  'pb-2': 'p-bottom-1',
  'pb-3': 'p-bottom-2',
  'pb-4': 'p-bottom-2',
  'pb-5': 'p-bottom-3',
  'pb-6': 'p-bottom-3',
  'pb-8': 'p-bottom-4',
  'pb-10': 'p-bottom-5',
  'pb-12': 'p-bottom-5',
  'pb-16': 'p-bottom-6',
  'pb-20': 'p-bottom-7',
  'pb-24': 'p-bottom-8',
};

// Gap mappings
export const gapMappings = {
  'gap-0': 'gap-0',
  'gap-1': 'gap-1',
  'gap-2': 'gap-1',
  'gap-3': 'gap-2',
  'gap-4': 'gap-2',
  'gap-5': 'gap-3',
  'gap-6': 'gap-3',
  'gap-8': 'gap-4',
  'gap-10': 'gap-5',
  'gap-12': 'gap-5',
  'gap-16': 'gap-6',
  'gap-20': 'gap-7',
  'gap-24': 'gap-8',
  
  // Gap X (column gap)
  'gap-x-0': 'gap-0',
  'gap-x-1': 'gap-1',
  'gap-x-2': 'gap-1',
  'gap-x-3': 'gap-2',
  'gap-x-4': 'gap-2',
  'gap-x-5': 'gap-3',
  'gap-x-6': 'gap-3',
  'gap-x-8': 'gap-4',
  
  // Gap Y (row gap)
  'gap-y-0': 'gap-row-0',
  'gap-y-1': 'gap-row-1',
  'gap-y-2': 'gap-row-1',
  'gap-y-3': 'gap-row-2',
  'gap-y-4': 'gap-row-2',
  'gap-y-5': 'gap-row-3',
  'gap-y-6': 'gap-row-3',
  'gap-y-8': 'gap-row-4',
};

// Grid column mappings
export const gridMappings = {
  'grid-cols-1': null, // single column is default
  'grid-cols-2': 'grid-column-2',
  'grid-cols-3': 'grid-column-3',
  'grid-cols-4': 'grid-column-4',
  
  // Column span
  'col-span-1': 'column-1',
  'col-span-2': 'column-2',
  'col-span-3': 'column-3',
  'col-span-4': 'column-4',
  'col-span-5': 'column-5',
  'col-span-6': 'column-6',
  'col-span-7': 'column-7',
  'col-span-8': 'column-8',
  'col-span-9': 'column-9',
  'col-span-10': 'column-10',
  'col-span-11': 'column-11',
  'col-span-12': 'column-12',
  'col-span-full': 'column-full',
  
  // Row span
  'row-span-1': 'row-span-1',
  'row-span-2': 'row-span-2',
  'row-span-3': 'row-span-3',
};

// Border radius mappings
export const radiusMappings = {
  'rounded-none': 'radius-none',
  'rounded-sm': 'radius-xsmall',
  'rounded': 'radius-small',
  'rounded-md': 'radius-small',
  'rounded-lg': 'radius-main',
  'rounded-xl': 'radius-large',
  'rounded-2xl': 'radius-large',
  'rounded-3xl': 'radius-large',
  'rounded-full': 'radius-round',
};

// Shadow mappings
export const shadowMappings = {
  'shadow-sm': 'shadow-xsmall',
  'shadow': 'shadow-small',
  'shadow-md': 'shadow-medium',
  'shadow-lg': 'shadow-large',
  'shadow-xl': 'shadow-xlarge',
  'shadow-2xl': 'shadow-xxlarge',
  'shadow-none': null,
};

// Z-index mappings
export const zIndexMappings = {
  'z-0': 'zindex-0',
  'z-10': 'zindex-1',
  'z-20': 'zindex-2',
  'z-30': 'zindex-3',
  'z-40': 'zindex-3',
  'z-50': 'zindex-3',
  '-z-10': 'zindex-negative',
};

// Container mappings
export const containerMappings = {
  'container': 'container-large',
  'max-w-xs': 'max-width-xxsmall',
  'max-w-sm': 'max-width-xsmall',
  'max-w-md': 'max-width-small',
  'max-w-lg': 'max-width-medium',
  'max-w-xl': 'max-width-large',
  'max-w-2xl': 'max-width-xlarge',
  'max-w-3xl': 'max-width-xlarge',
  'max-w-4xl': 'max-width-xxlarge',
  'max-w-5xl': 'max-width-xxlarge',
  'max-w-6xl': 'max-width-xxlarge',
  'max-w-7xl': 'max-width-xxlarge',
  'max-w-full': 'max-width-full',
  'max-w-none': 'max-width-none',
};

// Aspect ratio mappings
export const aspectRatioMappings = {
  'aspect-square': 'ratio-1-1',
  'aspect-video': 'ratio-16-9',
  'aspect-[2/1]': 'ratio-2-1',
  'aspect-[3/2]': 'ratio-3-2',
  'aspect-[2/3]': 'ratio-2-3',
  'aspect-[16/9]': 'ratio-16-9',
};

// Text size mappings
export const textSizeMappings = {
  'text-xs': 'text-size-tiny',
  'text-sm': 'text-size-small',
  'text-base': 'text-size-regular',
  'text-lg': 'text-size-large',
  'text-xl': 'text-size-large',
  'text-2xl': 'text-h6',
  'text-3xl': 'text-h5',
  'text-4xl': 'text-h4',
  'text-5xl': 'text-h3',
  'text-6xl': 'text-h2',
  'text-7xl': 'text-h1',
  'text-8xl': 'text-h1',
  'text-9xl': 'text-h1',
};

// Align items mappings
export const alignItemsMappings = {
  'items-start': 'align-items-start',
  'items-center': 'align-items-center',
  'items-end': 'align-items-end',
  'items-stretch': 'align-items-stretch',
  'items-baseline': 'align-items-start', // closest equivalent
};

// Align self mappings
export const alignSelfMappings = {
  'self-auto': 'align-self-auto',
  'self-start': 'align-self-start',
  'self-center': 'align-self-center',
  'self-end': 'align-self-end',
  'self-stretch': 'align-self-stretch',
};

// Export all mappings combined
export const allMappings = {
  ...directMappings,
  ...marginMappings,
  ...gapMappings,
  ...gridMappings,
  ...radiusMappings,
  ...shadowMappings,
  ...zIndexMappings,
  ...containerMappings,
  ...aspectRatioMappings,
  ...textSizeMappings,
  ...alignItemsMappings,
  ...alignSelfMappings,
};

// Padding is already exported above and requires special handling due to array returns

export default allMappings;

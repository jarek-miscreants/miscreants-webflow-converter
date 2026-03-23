// Miscreants Starter V3.2 — Webflow variable tokens
// These are the actual @var_ references used in styleLess

// Swatch colors (base)
export const swatchTransparent = '@var_variable-20b13b20-fd99-5472-0ec0-ac9910d96278';
export const swatchDark = '@var_variable-e46b0f95-9b0f-cfc5-e985-4080607a6e49';
export const swatchDarkFaded = '@var_variable-41cc3c4b-64d0-5a60-aed9-a8de6dbf84b1';
export const swatchLight = '@var_variable-994bda21-cfc0-9e57-7b7a-e14dcecbe2f0';
export const swatchLightFaded = '@var_variable-c01ea0b8-fad9-5337-0132-4d27474754e6';
export const swatchBrand = '@var_variable-66015c12-6cf7-8d2f-bced-8ebf96a08731';
export const swatchBrandText = '@var_variable-58223b69-87fe-dde7-b8dd-33ab7457ae33';

// Theme colors
export const themeBackground = '@var_variable-5dfae3c4-6b31-bad7-cd21-4b86eb8d26d6';
export const themeBackground2 = '@var_variable-7a637788-cc69-f1a9-2e2b-365f37671f40';
export const themeBorder = '@var_variable-8f26487d-c3bc-2deb-ac22-2a87d16ccae4';
export const themeText = '@var_variable-615ade19-f863-3557-4a55-124a5c835b74';

// Spacing tokens (space1 through space8)
export const space1 = '@var_variable-58574c72-1e3f-5af7-05f4-19152f1bc36d';
export const space2 = '@var_variable-5a6291ef-75f2-564f-214a-10fece24da04';
export const space3 = '@var_variable-195b5876-d366-7576-5b6e-0f0bd6540e73';
export const space4 = '@var_variable-0ec82967-d5db-365c-0e89-9ebcd62335d3';
export const space5 = '@var_variable-76a15b8c-00ac-3fe1-b808-6c96cc498fd0';
export const space6 = '@var_variable-3ac1c765-d883-417e-bca8-2576ef83b244';
export const space7 = '@var_variable-fadb6752-d55b-d6c3-fda4-610410cba654';
export const space8 = '@var_variable-3613b184-0eb6-1883-7461-4396747504e1';

// Section spacing
export const sectionSpaceSmall = '@var_variable-7c297828-e44d-5c3f-6dca-363b1d1b24b7';
export const sectionSpaceMain = '@var_variable-9c0a4e3b-4913-3337-be42-6648e812a183';
export const sectionSpaceLarge = '@var_variable-841947a2-c3e4-d48e-dc86-7630e517581c';

// Border
export const borderWidthMain = '@var_variable-6a827233-04fc-6e0e-9b94-ad3b23777e0b';

// Radius
export const radiusLarge = '@var_variable-d83c7706-07ae-da5f-b075-0ce449b7a35d';
export const radiusMain = '@var_variable-770fb5e2-f137-c8ee-ae9b-80c3ff057552';

// Tailwind spacing scale → Starter spacing variable
export const TW_SPACING_TO_VAR = {
  '0': '0',
  '0.5': space1, // 0.125rem ≈ space1
  '1': space1,   // 0.25rem
  '1.5': space1, // 0.375rem
  '2': space1,   // 0.5rem
  '2.5': space2, // 0.625rem
  '3': space2,   // 0.75rem
  '3.5': space2, // 0.875rem
  '4': space3,   // 1rem
  '5': space3,   // 1.25rem
  '6': space4,   // 1.5rem
  '7': space4,   // 1.75rem
  '8': space5,   // 2rem
  '9': space5,   // 2.25rem
  '10': space6,  // 2.5rem
  '11': space6,  // 2.75rem
  '12': space7,  // 3rem
  '14': space7,  // 3.5rem
  '16': space8,  // 4rem
  '20': space8,  // 5rem
  '24': space8,  // 6rem
};

// Tailwind color → Webflow variable mapping
export const TW_COLOR_TO_VAR = {
  'white': swatchLight,
  'black': swatchDark,
  'transparent': swatchTransparent,

  // Gray scale → theme semantic tokens
  'gray-50': themeBackground,
  'gray-100': themeBackground,
  'gray-200': themeBorder,
  'gray-300': themeBorder,
  'gray-400': swatchDarkFaded,
  'gray-500': swatchDarkFaded,
  'gray-600': themeText,
  'gray-700': themeText,
  'gray-800': swatchDark,
  'gray-900': swatchDark,
  'gray-950': swatchDark,

  // Slate (similar to gray)
  'slate-50': themeBackground,
  'slate-100': themeBackground,
  'slate-200': themeBorder,
  'slate-300': themeBorder,
  'slate-700': themeText,
  'slate-800': swatchDark,
  'slate-900': swatchDark,

  // Neutral
  'neutral-50': themeBackground,
  'neutral-100': themeBackground,
  'neutral-200': themeBorder,
  'neutral-800': swatchDark,
  'neutral-900': swatchDark,
};

// Tailwind colors that don't have variable mappings → hex values
export const TW_COLOR_TO_HEX = {
  'red-50': '#fef2f2', 'red-100': '#fee2e2', 'red-500': '#ef4444', 'red-600': '#dc2626', 'red-700': '#b91c1c',
  'orange-500': '#f97316', 'orange-600': '#ea580c',
  'amber-500': '#f59e0b', 'amber-600': '#d97706',
  'yellow-500': '#eab308',
  'green-50': '#f0fdf4', 'green-500': '#22c55e', 'green-600': '#16a34a', 'green-700': '#15803d',
  'blue-50': '#eff6ff', 'blue-500': '#3b82f6', 'blue-600': '#2563eb', 'blue-700': '#1d4ed8',
  'indigo-500': '#6366f1', 'indigo-600': '#4f46e5',
  'purple-500': '#a855f7', 'purple-600': '#9333ea',
  'pink-500': '#ec4899', 'pink-600': '#db2777',
};

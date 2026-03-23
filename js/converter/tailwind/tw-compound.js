/**
 * Compound Class Resolver
 * Detects and combines Tailwind classes into single Miscreants compound classes
 * E.g., flex + items-center + justify-between → hflex-between-center
 */

/**
 * Flex compound class patterns
 * Combines flex direction, justify-content, and align-items into single Miscreants class
 */
const flexPatterns = {
  // Horizontal flex patterns (default flex direction)
  horizontal: {
    // justify-start (default)
    'start-start': 'hflex-left-top',
    'start-center': 'hflex-left-center',
    'start-end': 'hflex-left-bottom',
    'start-stretch': 'hflex-left-stretch',
    
    // justify-center
    'center-start': 'hflex-center-top',
    'center-center': 'hflex-center-center',
    'center-end': 'hflex-center-bottom',
    'center-stretch': 'hflex-center-stretch',
    
    // justify-end
    'end-start': 'hflex-right-top',
    'end-center': 'hflex-right-center',
    'end-end': 'hflex-right-bottom',
    'end-stretch': 'hflex-right-stretch',
    
    // justify-between
    'between-start': 'hflex-between-top',
    'between-center': 'hflex-between-center',
    'between-end': 'hflex-between-bottom',
    'between-stretch': 'hflex-between-stretch',
  },
  
  // Vertical flex patterns (flex-col)
  vertical: {
    // align-start (items on left)
    'start-start': 'vflex-left-top',
    'start-center': 'vflex-left-center',
    'start-end': 'vflex-left-bottom',
    'start-between': 'vflex-left-between',
    
    // align-center (items centered)
    'center-start': 'vflex-center-top',
    'center-center': 'vflex-center-center',
    'center-end': 'vflex-center-bottom',
    'center-between': 'vflex-center-between',
    
    // align-end (items on right)
    'end-start': 'vflex-right-top',
    'end-center': 'vflex-right-center',
    'end-end': 'vflex-right-bottom',
    'end-between': 'vflex-right-between',
    
    // align-stretch
    'stretch-start': 'vflex-stretch-top',
    'stretch-center': 'vflex-stretch-center',
    'stretch-end': 'vflex-stretch-bottom',
    'stretch-between': 'vflex-stretch-between',
  }
};

/**
 * Extract flex properties from class list
 */
function extractFlexProperties(classes) {
  const props = {
    isFlex: false,
    isColumn: false,
    justify: 'start',
    align: 'stretch',
    wrap: false,
  };
  
  const flexClasses = [];
  const otherClasses = [];
  
  classes.forEach(cls => {
    if (cls === 'flex' || cls === 'inline-flex') {
      props.isFlex = true;
      flexClasses.push(cls);
    } else if (cls === 'flex-col' || cls === 'flex-col-reverse') {
      props.isColumn = true;
      flexClasses.push(cls);
    } else if (cls === 'flex-row' || cls === 'flex-row-reverse') {
      props.isColumn = false;
      flexClasses.push(cls);
    } else if (cls.startsWith('justify-')) {
      props.justify = cls.replace('justify-', '');
      flexClasses.push(cls);
    } else if (cls.startsWith('items-')) {
      props.align = cls.replace('items-', '');
      flexClasses.push(cls);
    } else if (cls === 'flex-wrap') {
      props.wrap = true;
      flexClasses.push(cls);
    } else if (cls === 'flex-nowrap') {
      props.wrap = false;
      flexClasses.push(cls);
    } else {
      otherClasses.push(cls);
    }
  });
  
  return { props, flexClasses, otherClasses };
}

/**
 * Resolve flex compound class
 */
function resolveFlexCompound(props) {
  if (!props.isFlex) return null;
  
  const patterns = props.isColumn ? flexPatterns.vertical : flexPatterns.horizontal;
  
  // Normalize align values
  let alignKey = props.align;
  if (alignKey === 'baseline') alignKey = 'start';
  
  // Build pattern key based on direction
  let patternKey;
  if (props.isColumn) {
    // For vertical: align-justify (align controls horizontal, justify controls vertical)
    patternKey = `${alignKey}-${props.justify}`;
  } else {
    // For horizontal: justify-align
    patternKey = `${props.justify}-${alignKey}`;
  }
  
  const result = {
    compoundClass: patterns[patternKey] || (props.isColumn ? 'vflex-left-top' : 'hflex-left-stretch'),
    additionalClasses: []
  };
  
  if (props.wrap) {
    result.additionalClasses.push(props.isColumn ? 'vflex-wrap' : 'hflex-wrap');
  }
  
  return result;
}

/**
 * Extract grid properties from class list
 */
function extractGridProperties(classes) {
  const props = {
    isGrid: false,
    columns: null,
    gap: null,
    rowGap: null,
    colGap: null,
  };
  
  const gridClasses = [];
  const otherClasses = [];
  
  classes.forEach(cls => {
    if (cls === 'grid') {
      props.isGrid = true;
      gridClasses.push(cls);
    } else if (cls.startsWith('grid-cols-')) {
      const cols = cls.replace('grid-cols-', '');
      props.columns = parseInt(cols, 10);
      gridClasses.push(cls);
    } else if (cls.startsWith('gap-') && !cls.includes('gap-x-') && !cls.includes('gap-y-')) {
      props.gap = cls;
      gridClasses.push(cls);
    } else if (cls.startsWith('gap-x-')) {
      props.colGap = cls;
      gridClasses.push(cls);
    } else if (cls.startsWith('gap-y-')) {
      props.rowGap = cls;
      gridClasses.push(cls);
    } else {
      otherClasses.push(cls);
    }
  });
  
  return { props, gridClasses, otherClasses };
}

/**
 * Resolve grid compound class
 */
function resolveGridCompound(props) {
  if (!props.isGrid) return null;
  
  const result = {
    compoundClass: null,
    additionalClasses: []
  };
  
  // Map columns to Miscreants grid class
  if (props.columns && props.columns >= 2 && props.columns <= 4) {
    result.compoundClass = `grid-column-${props.columns}`;
  } else if (props.columns && props.columns > 4) {
    // For more than 4 columns, use generic grid class
    result.compoundClass = 'grid';
  } else {
    result.compoundClass = 'grid';
  }
  
  return result;
}

/**
 * Main compound resolver function
 * Takes an array of Tailwind classes and returns resolved Miscreants classes
 */
export function resolveCompoundClasses(classes) {
  let workingClasses = [...classes];
  const resolvedClasses = [];
  const consumedClasses = new Set();
  
  // Try to resolve flex compounds
  const flexResult = extractFlexProperties(workingClasses);
  if (flexResult.props.isFlex) {
    const compound = resolveFlexCompound(flexResult.props);
    if (compound) {
      resolvedClasses.push(compound.compoundClass);
      resolvedClasses.push(...compound.additionalClasses);
      flexResult.flexClasses.forEach(c => consumedClasses.add(c));
    }
    workingClasses = flexResult.otherClasses;
  }
  
  // Try to resolve grid compounds
  const gridResult = extractGridProperties(workingClasses);
  if (gridResult.props.isGrid) {
    const compound = resolveGridCompound(gridResult.props);
    if (compound) {
      if (compound.compoundClass) {
        resolvedClasses.push(compound.compoundClass);
      }
      resolvedClasses.push(...compound.additionalClasses);
      // Only mark 'grid' and 'grid-cols-X' as consumed, not gaps
      consumedClasses.add('grid');
      gridResult.gridClasses.forEach(c => {
        if (c.startsWith('grid-cols-')) {
          consumedClasses.add(c);
        }
      });
    }
    // Keep gap classes for individual mapping
    workingClasses = gridResult.otherClasses.concat(
      gridResult.gridClasses.filter(c => c.startsWith('gap-'))
    );
  }
  
  return {
    resolvedClasses,
    remainingClasses: workingClasses,
    consumedClasses: Array.from(consumedClasses)
  };
}

/**
 * Check if a set of classes can form a compound
 */
export function canFormCompound(classes) {
  const hasFlex = classes.includes('flex') || classes.includes('inline-flex');
  const hasGrid = classes.includes('grid');
  const hasAlignment = classes.some(c => 
    c.startsWith('justify-') || c.startsWith('items-')
  );
  
  return (hasFlex && hasAlignment) || hasGrid;
}

export default resolveCompoundClasses;

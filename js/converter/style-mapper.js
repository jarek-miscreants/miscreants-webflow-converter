// Simplified style mapper — most styles now go as `style` attributes on DOM nodes.
// This module is only used for specific styleLess properties (like transitions)
// that benefit from being in Webflow's native style system.

export function buildStyleObject(id, name, styleLess = '', variants = {}) {
  return {
    _id: id,
    fake: false,
    type: 'class',
    name,
    namespace: '',
    comb: '',
    styleLess,
    variants,
    children: [],
    createdBy: 'converter',
    origin: null,
    selector: null,
  };
}

export function generateId() {
  // Generate Webflow-style short ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const seg = (len) => {
    let s = '';
    for (let i = 0; i < len; i++) {
      s += Math.random().toString(36).charAt(2);
    }
    return s;
  };
  return `${seg(8)}-${seg(4)}-${seg(4)}-${seg(4)}-${seg(12)}`;
}

// Generate a unique suffix for class names to prevent Webflow conflicts
export function generateClassSuffix() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

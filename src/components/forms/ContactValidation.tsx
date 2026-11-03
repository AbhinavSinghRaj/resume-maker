export function isValidEmail(v: string): boolean {
  if (!v) return true; // empty is fine, not an error state
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function isValidPhone(v: string): boolean {
  if (!v) return true;
  const digits = v.replace(/[\s\-()+ ]/g, "");
  return /^\d{7,15}$/.test(digits);
}

export function isValidUrl(v: string): boolean {
  if (!v) return true;
  try {
    const u = new URL(v.startsWith("http") ? v : `https://${v}`);
    return !!u.hostname.includes(".");
  } catch {
    return false;
  }
}
export function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** deterministic hash -> stable */
export function hash01(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export function rotDeg(code: string) {
  return hash01(code) * 6.2 - 3.1;
}

export function inkVariant(code: string) {
  return Math.floor(hash01(code + "_ink") * 3);
}

export function pct(n: number) {
  const v = Math.max(0, Math.min(100, Math.round(n)));
  return `${v}%`;
}

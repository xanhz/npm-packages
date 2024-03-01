export function isArray(val: any): val is any[] {
  return Array.isArray(val);
}

export function isTrue(val: any): val is true {
  return val === true;
}

export function isObject(val: any): boolean {
  return val != null && typeof val === 'object';
}

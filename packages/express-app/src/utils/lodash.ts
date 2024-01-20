export function isFunction(val: any): val is Function {
  return typeof val === 'function';
}

export function isNil(val: any): val is null | undefined {
  return val == null;
}

export function isString(val: any): val is string {
  return typeof val === 'string';
}

export function isObject(val: any): val is object {
  return val !== null && typeof val === 'object';
}

export function isEmpty(val: any): boolean {
  if (val == null) {
    return true;
  }
  if ('length' in val && typeof val.length === 'number') {
    return val.length === 0;
  }
  if ('size' in val && typeof val.size === 'number') {
    return val.size === 0;
  }
  if (isObject(val)) {
    return isEmpty(Object.keys(val));
  }
  return false;
}

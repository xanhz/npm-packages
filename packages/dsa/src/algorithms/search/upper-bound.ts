import { CompareFunction } from '../../interfaces';

/**
 * Find fist element index that is greater than `value`
 */
export function upperBound<T = any>(elements: T[], value: T, compare: CompareFunction<T>): number {
  let left = 0,
    right = elements.length,
    n = elements.length;
  while (left < right) {
    const mid = (left + right) >> 1;
    if (compare(elements[mid], value) <= 0) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return right < n && compare(elements[right], value) > 0 ? right : n;
}

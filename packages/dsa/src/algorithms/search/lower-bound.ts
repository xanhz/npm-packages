import { CompareFunction } from '../../interfaces';

/**
 * Find first element index that is not less than `value`
 */
export function lowerBound<T = any>(elements: T[], value: T, compare: CompareFunction<T>): number {
  let left = 0,
    right = elements.length;
  while (left < right) {
    const mid = (left + right) >> 1;
    if (compare(elements[mid], value) >= 0) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return compare(elements[left], value) >= 0 ? left : - 1;
}

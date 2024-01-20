import { CompareFunction } from '../interfaces';

export namespace Searching {
  export function binarySearch<T = any>(elements: T[], value: T, compare: CompareFunction<T>): number {
    let left = 0,
      right = elements.length;
    while (left < right) {
      const mid = (left + right) >> 1;
      const compareResult = compare(value, elements[mid]);
      if (compareResult == 0) {
        return mid;
      } else if (compareResult > 0) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return -1;
  }

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
    return compare(elements[left], value) >= 0 ? left : -1;
  }

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
}

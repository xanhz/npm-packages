import { CompareFunction } from '../../interfaces';

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

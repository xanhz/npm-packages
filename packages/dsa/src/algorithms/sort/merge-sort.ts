import { CompareFunction } from '../../interfaces';

export function mergeSort<T = any>(elements: T[], compare: CompareFunction<T>, inPlace = false): T[] {
  if (!inPlace) {
    const copy = [...elements];
    return mergeSort(copy, compare, true);
  }
  sort<T>(elements, 0, elements.length, compare);
  return elements;
}

function sort<T>(elements: T[], left: number, right: number, compare: CompareFunction<T>) {
  if (left + 1 == right) return;
  let mid = left + Math.floor((right - left) / 2);
  sort(elements, left, mid, compare);
  sort(elements, mid, right, compare);
  merge(elements, left, mid, right, compare);
}

function merge<T>(elements: T[], left: number, mid: number, right: number, compare: CompareFunction<T>) {
  let i = left,
    j = mid,
    k = left;
  const copied = [...elements];
  while (i < mid && j < right) {
    const isLessEqual = compare(copied[i], copied[j]) <= 0;
    if (isLessEqual) {
      elements[k] = copied[i];
      ++k;
      ++i;
    } else {
      elements[k] = copied[j];
      ++k;
      ++j;
    }
  }
  while (i < mid) {
    elements[k] = copied[i];
    ++k;
    ++i;
  }
  while (j < right) {
    elements[k] = copied[j];
    ++k;
    ++j;
  }
}

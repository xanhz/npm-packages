import { CompareFunction } from '../interfaces';

export namespace Sorting {
  export function mergeSort<T = any>(elements: T[], compare: CompareFunction<T>): T[] {
    const merge = (elements: T[], left: number, mid: number, right: number) => {
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
    };

    const sort = (elements: T[], left: number, right: number) => {
      if (left + 1 == right) return;
      let mid = left + Math.floor((right - left) / 2);
      sort(elements, left, mid);
      sort(elements, mid, right);
      merge(elements, left, mid, right);
    };

    const $elements = [...elements];
    sort($elements, 0, $elements.length);

    return $elements;
  }
}

import { mergeSort } from '../merge-sort';

describe('Merge Sort', () => {
  it('Should return sorted array', () => {
    const numbers = [4, 5, 1, 3, 0];
    const sortedNumbers = mergeSort(numbers, (a, b) => a - b);
    const expected = numbers.sort((a, b) => a - b);
    for (let i = 0; i < numbers.length; ++i) {
      expect(sortedNumbers[i]).toEqual(expected[i]);
    }
  });
});

import { Searching } from '../searching';

describe('Binary Search', () => {
  const numbers: number[] = [1, 3, 5, 7, 9, 10, 10, 22];

  it('Should found 1 and return 0', () => {
    const index = Searching.binarySearch(numbers, 1, (a, b) => a - b);
    expect(index).toBe(0);
  });

  it('Should found 10 and return value is not -1', () => {
    const index = Searching.binarySearch(numbers, 10, (a, b) => a - b);
    expect(index).not.toBe(-1);
  });

  it('Should not found 23 and return -1', () => {
    const index = Searching.binarySearch(numbers, 23, (a, b) => a - b);
    expect(index).toBe(-1);
  });
});

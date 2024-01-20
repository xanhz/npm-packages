import { Searching } from '../searching';

describe('Lower Bound', () => {
  const numbers: number[] = [1, 3, 5, 7, 9, 10, 10, 22];

  it('Should return 3', () => {
    const index = Searching.lowerBound(numbers, 6, (a, b) => a - b);
    expect(index).toBe(3);
  });

  it('Should return -1', () => {
    const index = Searching.lowerBound(numbers, 23, (a, b) => a - b);
    expect(index).toBe(-1);
  });

  it('Should return 5', () => {
    const index = Searching.lowerBound(numbers, 10, (a, b) => a - b);
    expect(index).toBe(5);
  });
});

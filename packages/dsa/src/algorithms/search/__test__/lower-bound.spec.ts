import { lowerBound } from '../lower-bound';

describe('Lower Bound', () => {
  const numbers: number[] = [1, 3, 5, 7, 9, 10, 10, 22];

  it('Should return 3', () => {
    const index = lowerBound(numbers, 6, (a, b) => a - b);
    expect(index).toBe(3);
  });

  it('Should return -1', () => {
    const index = lowerBound(numbers, 23, (a, b) => a - b);
    expect(index).toBe(-1);
  });

  it('Should return 5', () => {
    const index = lowerBound(numbers, 10, (a, b) => a - b);
    expect(index).toBe(5);
  });
});

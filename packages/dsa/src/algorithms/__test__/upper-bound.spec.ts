import { Searching } from '../searching';

describe('Lower Bound', () => {
  const numbers: number[] = [1, 3, 5, 7, 9, 10, 10, 22];

  it('Should return 3', () => {
    const index = Searching.upperBound(numbers, 5, (a, b) => a - b);
    expect(index).toBe(3);
  });

  it('Should return 4', () => {
    const index = Searching.upperBound(numbers, 8, (a, b) => a - b);
    expect(index).toBe(4);
  });

  it('Should return 8', () => {
    const index = Searching.upperBound(numbers, 22, (a, b) => a - b);
    expect(index).toBe(8);
  });
});

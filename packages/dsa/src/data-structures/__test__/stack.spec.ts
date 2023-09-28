import { Stack } from '../stack';

describe('Stack', () => {
  const stack = new Stack<number>();

  it('should be defined', () => {
    expect(stack).toBeDefined();
  });

  it('should be Stack instance', () => {
    expect(stack).toBeInstanceOf(Stack);
  });

  it('should have length 5', () => {
    stack.push(1, 2, 3, 4, 5);
    expect(stack.size()).toEqual(5);
  });

  it('should be 5 on top', () => {
    expect(stack.top()).toEqual(5);
  });

  it('should be 5 on top then 4', () => {
    expect(stack.pop()).toEqual(5);
    expect(stack.pop()).toEqual(4);
    expect(stack.size()).toEqual(3);
    expect(stack.isEmpty()).toEqual(false);
  });

  it('should be 3, 2, 1 on top and then empty', () => {
    expect(stack.pop()).toEqual(3);
    expect(stack.pop()).toEqual(2);
    expect(stack.pop()).toEqual(1);
    expect(stack.isEmpty()).toEqual(true);
  });
});

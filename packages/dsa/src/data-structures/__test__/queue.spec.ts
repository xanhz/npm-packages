import { Queue } from '../queue';

describe('Queue', () => {
  const queue = new Queue<number>();

  it('should be defined', () => {
    expect(queue).toBeDefined();
  });

  it('should be Queue instance', () => {
    expect(queue).toBeInstanceOf(Queue);
  });

  it('should be empty', () => {
    expect(queue.empty()).toEqual(true);
  });

  it('should be size 4', () => {
    queue.push(1, 2, 3, 4);
    expect(queue.size).toEqual(4);
    expect(queue.empty()).toEqual(false);
  });

  it('should return 1 on top', () => {
    expect(queue.top()).toEqual(1);
  });

  it('should return 1 on top and has size 3', () => {
    expect(queue.pop()).toEqual(1);
    expect(queue.size).toEqual(3);
  });

  it('should return 2, 3 on top and has size 1', () => {
    expect(queue.pop()).toEqual(2);
    expect(queue.pop()).toEqual(3);
    expect(queue.size).toEqual(1);
  });

  it('should return 4 on top and has size 0', () => {
    expect(queue.pop()).toEqual(4);
    expect(queue.size).toEqual(0);
  });
});

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
    expect(queue.isEmpty()).toEqual(true);
  });

  it('should be size 4', () => {
    queue.add(1, 2, 3, 4);
    expect(queue.size()).toEqual(4);
    expect(queue.isEmpty()).toEqual(false);
  });

  it('should return 1 on top', () => {
    expect(queue.peek()).toEqual(1);
  });

  it('should return 1 on top and has size 3', () => {
    expect(queue.poll()).toEqual(1);
    expect(queue.size()).toEqual(3);
  });

  it('should return 2, 3 on top and has size 1', () => {
    expect(queue.poll()).toEqual(2);
    expect(queue.poll()).toEqual(3);
    expect(queue.size()).toEqual(1);
  });

  it('should return 4 on top and has size 0', () => {
    expect(queue.poll()).toEqual(4);
    expect(queue.size()).toEqual(0);
  });
});

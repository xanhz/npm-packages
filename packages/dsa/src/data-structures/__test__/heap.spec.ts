import { Heap } from '../heap';

describe('MinHeap', () => {
  const heap = new Heap<number>((a, b) => a - b);

  it('should be defined', () => {
    expect(heap).toBeDefined();
  });

  it('should be Heap instance', () => {
    expect(heap).toBeInstanceOf(Heap);
  });

  it('should be empty', () => {
    expect(heap.isEmpty()).toEqual(true);
  });

  it('should have length 5', () => {
    heap.add(5, 3, 4, 2, 1);
    expect(heap.size()).toEqual(5);
  });

  it('should be 1 on top', () => {
    expect(heap.peek()).toEqual(1);
  });

  it('should be 1 on top then 2', () => {
    expect(heap.poll()).toEqual(1);
    expect(heap.poll()).toEqual(2);
    expect(heap.size()).toEqual(3);
  });
});

describe('MaxHeap', () => {
  const heap = new Heap<number>((a, b) => b - a);

  it('should be defined', () => {
    expect(heap).toBeDefined();
  });

  it('should be Heap instance', () => {
    expect(heap).toBeInstanceOf(Heap);
  });

  it('should be empty', () => {
    expect(heap.isEmpty()).toEqual(true);
  });

  it('should have length 5', () => {
    heap.add(1, 4, 2, 3, 5);
    expect(heap.size()).toEqual(5);
  });

  it('should be 5 on top', () => {
    expect(heap.peek()).toEqual(5);
  });

  it('should be 5 on top then 4', () => {
    expect(heap.poll()).toEqual(5);
    expect(heap.poll()).toEqual(4);
    expect(heap.size()).toEqual(3);
  });
});

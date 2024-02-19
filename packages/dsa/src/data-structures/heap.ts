import { EmptyError } from '../errors';
import { CompareFunction } from '../interfaces';
import { swap } from '../utils';

export class Heap<T = any> {
  protected elements: T[];
  protected compare: CompareFunction<T>;

  constructor(compare: CompareFunction<T>) {
    this.elements = [];
    this.compare = compare;
  }

  public get size(): number {
    return this.elements.length;
  }

  public empty(): boolean {
    return this.size == 0;
  }

  public push(...values: T[]): void {
    for (const value of values) {
      this.elements.push(value);
      let child = this.size - 1;
      let parent = (child - 1) >> 1;
      while (parent >= 0) {
        if (this.compare(this.elements[child], this.elements[parent]) >= 0) {
          break;
        }
        swap(this.elements, child, parent);
        child = parent;
        parent = (child - 1) >> 1;
      }
    }
  }

  public pop(): T {
    if (this.size == 1) {
      return this.elements.pop() as T;
    }
    const top = this.top();
    this.elements[0] = this.elements.pop() as T;
    this.heapify(0);
    return top;
  }

  public top(): T {
    if (this.empty()) {
      throw new EmptyError(`${this.constructor.name}`);
    }
    return this.elements[0];
  }

  private heapify(parent: number): void {
    let smallest = parent,
      leftChild = 2 * parent + 1,
      rightChild = 2 * parent + 2;

    if (leftChild < this.size && this.compare(this.elements[leftChild], this.elements[smallest]) < 0) {
      smallest = leftChild;
    }

    if (rightChild < this.size && this.compare(this.elements[rightChild], this.elements[smallest]) < 0) {
      smallest = rightChild;
    }

    if (smallest != parent) {
      swap(this.elements, smallest, parent);
      this.heapify(smallest);
    }
  }
}

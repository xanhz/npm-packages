import { EmptyError } from '../errors';
import { Heap } from './heap';

export class PriorityQueue<T = any> extends Heap<T> {}

export class Queue<T = any> {
  private elements: T[];
  private top: number;

  constructor() {
    this.elements = [];
    this.top = 0;
  }

  public size(): number {
    return this.elements.length - this.top;
  }

  public isEmpty(): boolean {
    return this.top >= this.elements.length;
  }

  public add(...values: T[]) {
    this.elements.push(...values);
  }

  public peek(): T {
    if (this.isEmpty()) {
      throw new EmptyError();
    }
    return this.elements[this.top];
  }

  public poll(): T {
    const value = this.peek();
    ++this.top;
    if (this.top == this.elements.length) {
      this.top = 0;
      this.elements = [];
    }
    return value;
  }
}

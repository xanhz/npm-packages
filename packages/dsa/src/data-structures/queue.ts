import { EmptyError } from '../errors';
import { Heap } from './heap';

export class PriorityQueue<T = any> extends Heap<T> {}

export class Queue<T = any> {
  private elements: T[];
  private head: number;

  constructor() {
    this.elements = [];
    this.head = 0;
  }

  public get size(): number {
    return this.elements.length - this.head;
  }

  public empty(): boolean {
    return this.head >= this.elements.length;
  }

  public push(...values: T[]): void {
    this.elements.push(...values);
  }

  public top(): T {
    if (this.empty()) {
      throw new EmptyError(`${this.constructor.name}`);
    }
    return this.elements[this.head];
  }

  public pop(): T {
    const value = this.top();
    ++this.head;
    if (this.head == this.elements.length) {
      this.head = 0;
      this.elements = [];
    }
    return value;
  }
}

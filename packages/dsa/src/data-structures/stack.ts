import { EmptyError } from '../errors';

export class Stack<T = any> {
  private elements: T[];

  constructor() {
    this.elements = [];
  }

  public get size(): number {
    return this.elements.length;
  }

  public empty(): boolean {
    return this.size == 0;
  }

  public push(...values: T[]): void {
    this.elements.push(...values);
  }

  public top(): T {
    if (this.empty()) {
      throw new EmptyError(`${this.constructor.name}`);
    }
    return this.elements[this.size - 1];
  }

  public pop(): T {
    if (this.empty()) {
      throw new EmptyError(`${this.constructor.name}`);
    }
    return this.elements.pop() as T;
  }
}

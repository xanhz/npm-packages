import { EmptyError } from '../errors';

export class Stack<T = any> {
  protected elements: T[];

  constructor() {
    this.elements = [];
  }

  public size() {
    return this.elements.length;
  }

  public isEmpty() {
    return this.size() == 0;
  }

  public push(...values: T[]) {
    this.elements.push(...values);
  }

  public top() {
    if (this.isEmpty()) {
      throw new EmptyError();
    }
    return this.elements.at(-1) as T;
  }

  public pop() {
    if (this.isEmpty()) {
      throw new EmptyError();
    }
    return this.elements.pop() as T;
  }
}

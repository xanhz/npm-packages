import { EmptyError } from '../errors';
import { CompareFunction } from '../interfaces';
import { swap } from '../utils';

export class Heap<T = any> {
  protected elements: T[];
  protected compareFn: CompareFunction<T>;

  constructor(fn: CompareFunction<T>) {
    this.elements = [];
    this.compareFn = fn;
  }

  public add(...values: T[]): void {
    for (const value of values) {
      this.elements.push(value);
      let i = this.elements.length - 1;
      while (this.hasParent(i)) {
        let j = this.parentIndex(i);
        let isSmallerThanParent = this.compare(i, j) < 0;

        if (!isSmallerThanParent) break;

        swap(this.elements, i, j);
        i = j;
      }
    }
  }

  /**
   * Retrieve top element and remove it
   */
  public poll(): T {
    const top = this.peek();
    const last = this.elements.pop() as T;

    if (this.isEmpty()) return top;

    let i = 0;
    this.elements[i] = last;
    while (this.hasLeftChild(i)) {
      let leftIndex = this.leftChildIndex(i);
      let rightIndex = this.rightChildIndex(i);

      let rightLessThanLeft = this.hasRightChild(i) && this.compare(rightIndex, leftIndex) < 0;
      let j = rightLessThanLeft ? rightIndex : leftIndex;

      if (this.compare(i, j) < 0) break;

      swap(this.elements, i, j);
      i = j;
    }
    return top;
  }

  public size() {
    return this.elements.length;
  }

  public isEmpty() {
    return this.elements.length == 0;
  }

  /**
   * Retrieve top element without removing it
   */
  public peek(): T {
    if (this.isEmpty()) {
      throw new EmptyError();
    }
    return this.elements[0];
  }

  /**
   * Get parent index of element at i
   */
  protected parentIndex(i: number) {
    return (i - 1) >> 1;
  }

  /**
   * Get parent of element at i
   */
  protected parent(i: number) {
    return this.elements[this.parentIndex(i)];
  }

  /**
   * Check if element at i has parent or not
   */
  protected hasParent(i: number) {
    return this.parentIndex(i) >= 0;
  }

  /**
   * Get child element index of element at i
   */
  protected leftChildIndex(i: number) {
    return 2 * i + 1;
  }

  /**
   * Get left element of element at i
   */
  protected leftChild(i: number) {
    return this.elements[this.leftChildIndex(i)];
  }

  /**
   * Check if element at i has left child or not
   */
  protected hasLeftChild(i: number) {
    return this.leftChildIndex(i) < this.elements.length;
  }

  /**
   * Get right element index of element at i
   */
  protected rightChildIndex(i: number) {
    return 2 * i + 2;
  }

  /**
   * Get right element of element at i
   */
  protected rightChild(i: number) {
    return this.elements[this.rightChildIndex(i)];
  }

  /**
   * Check if element at i has right child or not
   */
  protected hasRightChild(i: number) {
    return this.rightChildIndex(i) < this.elements.length;
  }

  /**
   * Swap element at i and j
   */
  protected swap(i: number, j: number) {
    const temp = this.elements[i];
    this.elements[i] = this.elements[j];
    this.elements[j] = temp;
  }

  /**
   * Compare element at i and j
   */
  protected compare(i: number, j: number) {
    return this.compareFn(this.elements[i], this.elements[j]);
  }
}

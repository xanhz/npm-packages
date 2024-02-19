# Data structure and algorithm

## Data structure

### 1. Heap

```js
const { Heap } = require('@xanhz/dsa');
const heap = new Heap<number>((a, b) => a - b); // min heap
heap.add(5, 2, 3, 1, 3); // add elements to heap
heap.top(); // return 1
heap.pop(); // return 1 and only 2, 3, 4, 5 in heap
heap.pop(); // return 2 and only 3, 4, 5 in heap
heap.size; // return 3
heap.empty(); // return false
```

### 2. Queue

```js
const { Queue } = require('@xanhz/dsa');
const queue = new Queue<number>();
queue.push(1, 2, 3); // Queue = [1, 2, 3]
queue.top(); // return 1, Queue = [1, 2, 3]
queue.pop(); // return 1, Queue = [2, 3]
queue.size; // return 2
queue.empty(); // return false
```

### 3. Priority Queue

```js
const { PriorityQueue } = require('@xanhz/dsa');
const heap = new PriorityQueue<number>((a, b) => a - b); // less is on head of queue
heap.push(5, 2, 3, 1, 3); // add elements to queue
heap.top(); // return 1
heap.pop(); // return 1 and only 2, 3, 4, 5 in heap
heap.pop(); // return 2 and only 3, 4, 5 in heap
heap.size; // return 3
heap.empty(); // return false
```

### 4. Stack

```js
const { Stack } = require('@xanhz/dsa');
const stack = new Stack<number>();
stack.push(1, 2, 3); // Stack = [1, 2, 3]
stack.top(); // return 3, Stack = [1, 2, 3]
stack.pop(); // return 3, Stack = [1, 2]
stack.size; // return 2
stack.empty(); // return false
```

## Algorithms

### 1. Sorting

```js
const { Sorting } = require('@xanhz/dsa');
const arr = [5, 3, 1, 6];

const ascArr = Sorting.mergeSort<number>(arr, (a, b) => a - b); // [1, 3, 5, 6]
const descArr = Sorting.mergeSort<number>(arr, (a, b) => b - a); // [6, 5, 3, 1]
```

### 2. Searching

```js
const { Searching } = require('@xanhz/dsa');

const arr = [1, 2, 3, 4, 5, 6];
let index = -1;

index = Searching.binarySearch<number>(arr, 4, (a, b) => a - b); // return 3 ~ value = 4
index = Searching.lowerBound<number>(arr, 4.5, (a, b) => a - b); // return 4 ~ value = 5
index = Searching.upperBound<number>(arr, 2, (a, b) => a - b); // return 2 ~ value = 3
```

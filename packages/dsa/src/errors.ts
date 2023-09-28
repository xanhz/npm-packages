export class EmptyError extends Error {
  constructor(message = 'Container is empty') {
    super(message);
  }
}

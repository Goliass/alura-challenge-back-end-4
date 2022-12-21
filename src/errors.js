class InvalidArgumentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidArgumentError';
  }
}

class UnauthorizedUserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedUserError';
  }
}

export { InvalidArgumentError, UnauthorizedUserError };
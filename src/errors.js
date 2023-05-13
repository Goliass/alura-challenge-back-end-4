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

function shutdownService() {
  console.log("Shutting down...");
  // attempt a gracefully shutdown  
  process.exit(1);

  // If a graceful shutdown is not achieved after 1 second,
  // shut down the process completely
  setTimeout(() => {
    console.log(`process.abort()`);
    process.abort(); // exit immediately
  }, 1000).unref();
}

export { InvalidArgumentError, UnauthorizedUserError, shutdownService };
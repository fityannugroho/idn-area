export class DatabaseConfigError extends Error {
  constructor(message = 'Some database config is invalid') {
    super(message);
    this.name = 'DatabaseConfigError';
  }
}

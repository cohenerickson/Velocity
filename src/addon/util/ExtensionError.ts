export default class ExtensionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExtensionError";
  }
}

export let lastError: Error | undefined;

export function setError(error: Error) {
  lastError = error;
}

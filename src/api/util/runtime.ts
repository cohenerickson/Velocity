let id: string = "";
let lastError: Error | null = null;

export function setId($id: string) {
  id = $id;
}

export { id };

export function setLastError(error: Error) {
  lastError = error;
}

export { lastError };

import { v4 } from "uuid";

const eventListeners = new Map<string, ((...args: any[]) => void)[]>();
const callRequests = new Map<
  string,
  [(data: any) => void, (data: any) => void]
>();
const callHandlers = new Map<string, Set<(data: any) => void>>();

function on(event: string, listener: (...args: any) => void): void {
  const listeners = eventListeners.get("event") ?? [];

  listeners.push(listener);

  eventListeners.set(event, listeners);
}

function emit(event: string | string[], ...args: any[]): void {
  if (Array.isArray(event)) {
    event.forEach((event) => {
      emit(event, ...args);
    });

    return;
  }

  const listeners = eventListeners.get(event) ?? [];

  listeners.forEach((listener) => {
    listener(...args);
  });

  self.postMessage({
    event,
    args
  });
}

function call<T>(action: string, data?: any): Promise<T> {
  const id = v4();
  return new Promise((accept, reject) => {
    callRequests.set(id, [accept, reject]);

    self.postMessage({
      id,
      action,
      data,
      isRequest: true
    });
  });
}

function handle<T>(
  action: string,
  callback: (event: { data: T; reply: (data: any) => void }) => void
): void {
  const openHandlers = callHandlers.get(action) ?? new Set();
  openHandlers.add(callback);
  callHandlers.set(action, openHandlers);
}

self.addEventListener("message", ({ data }) => {
  if (data.event) {
    const listeners = eventListeners.get(data.event) ?? [];

    listeners.forEach((listener) => {
      listener(...data.args);
    });
  } else if (data.action) {
    if (data.isResponse) {
      const request = callRequests.get(data.id);
      if (request) {
        if (data.success) {
          request[0](data.data);
        } else {
          request[1](data.data);
        }
      }
    } else if (data.isRequest) {
      const openHandlers = callHandlers.get(data.action) ?? new Set();
      openHandlers.forEach((handler) => {
        handler({
          data: data.data,
          reply($data: any) {
            self.postMessage({
              id: data.id,
              data: $data,
              isResponse: true
            });
          }
        });
      });
    }
  }
});

export default { on, emit, call, handle };

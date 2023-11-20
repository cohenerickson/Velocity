type Handler = {
  name: string;
  id?: number;
  once: boolean;
  callback: (...args: any[]) => Promise<any> | any;
};

const handlers: Handler[] = [];
const responders: Handler[] = [];
const requesters: Handler[] = [];

export function openSerial(scope: typeof globalThis) {
  addEventListener("message", async (event) => {
    switch (event.data.type) {
      case "event":
        const handlersToCall = handlers.filter(
          (handler) => handler.name === event.data.event
        );

        for (const handler of handlersToCall) {
          handler.callback(...event.data.args);

          if (handler.once) {
            handlers.splice(handlers.indexOf(handler), 1);
          }
        }
        break;
      case "request":
        const handler = responders.find(
          (handler) => handler.name === event.data.name
        );

        if (handler) {
          scope.postMessage({
            type: "response",
            id: event.data.id,
            args: [await handler.callback(...event.data.args)]
          });
        }

        break;
      case "response":
        const handlersToResolve = requesters.filter(
          (handler) => handler.id === event.data.id
        );

        for (const handler of handlersToResolve) {
          handler.callback(...event.data.args);
          requesters.splice(requesters.indexOf(handler), 1);
        }

        break;
    }
  });

  function on(event: string, callback: (...args: any[]) => void): void {
    handlers.push({
      name: event,
      once: false,
      callback
    });
  }

  function emit(event: string, ...args: any[]) {
    const handlersToCall = handlers.filter((handler) => handler.name === event);

    for (const handler of handlersToCall) {
      handler.callback(...args);

      scope.postMessage({
        type: "event",
        event,
        args
      });

      if (handler.once) {
        handlers.splice(handlers.indexOf(handler), 1);
      }
    }
  }

  function once(event: string, callback: (...args: any[]) => void) {
    handlers.push({
      name: event,
      once: true,
      callback
    });
  }

  async function call<T>(event: string, ...args: any[]): Promise<T> {
    return new Promise<any>(async (resolve, reject) => {
      const id = Math.random();

      const handler = handlers.find((handler) => handler.name === event);

      if (handler) {
        resolve(await handler.callback(...args));
      } else {
        requesters.push({
          name: event,
          id,
          once: true,
          callback: resolve
        });

        scope.postMessage({
          type: "request",
          id,
          event,
          args
        });
      }

      setTimeout(() => {
        const handler = requesters.find((handler) => handler.id === id);

        if (handler) {
          requesters.splice(requesters.indexOf(handler), 1);
          reject(new Error("Request timed out."));
        }
      }, 1000);
    });
  }

  function handle<T>(
    event: string,
    callback: (...args: any[]) => Promise<T> | T
  ) {
    handlers.push({
      name: event,
      once: false,
      callback
    });
  }

  return { on, emit, once, call, handle };
}

export default openSerial(globalThis);

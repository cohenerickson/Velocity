type Callback = (data: any) => void;

const events: { [key: string]: Callback[] } = {};

export function send(action: string, data: any) {
  const message = {
    action,
    data
  };
  // @ts-ignore
  self.postMessage(message, [message]);
}

export function on(action: string, callback: (data: any) => void) {
  events[action] = events[action] ?? [];
  events[action].push(callback);
}

self.addEventListener("message", ({ data }) => {
  const callbacks = events[data.action] ?? [];

  callbacks.forEach((callback) => {
    callback(data.data);
  });
});

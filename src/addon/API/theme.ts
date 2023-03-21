export function getCurrent() {}

export function update() {}

export function reset() {}

type Listener = () => void;

export const onUpdated: {
  _: Listener[];
  addListener: (listener: Listener) => void;
  removeListener: (listener: Listener) => void;
  hasListener: (listener: Listener) => void;
} = {
  _: [],
  addListener(listener: () => void) {
    this._.push(listener);
  },
  removeListener() {},
  hasListener() {}
};

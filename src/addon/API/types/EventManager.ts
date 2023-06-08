import bindingUtil from "~/addon/bindingUtil";

type Listener<T> = (data: T) => void;

export default class Event<T> {
  #listeners: Listener<T>[] = [];

  constructor(event: string) {
    bindingUtil.on(event, (data) => {
      this.#dispatch(data);
    });
  }

  addListener(listener: Listener<T>): void {
    this.#listeners.push(listener);
  }

  removeListener(listener: Listener<T>): void {
    this.#listeners = this.#listeners.filter((x) => x !== listener);
  }

  hasListener(listener: Listener<T>): boolean {
    return this.#listeners.includes(listener);
  }

  #dispatch(event: T): void {
    this.#listeners.forEach((listener) => {
      listener(event);
    });
  }
}

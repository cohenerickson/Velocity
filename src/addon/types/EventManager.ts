import bindingUtil from "~/addon/util/bindingUtil";

type Listener = (...args: any) => void;

export default class Event {
  #listeners: Listener[] = [];

  constructor(event: string) {
    bindingUtil.on(event, (...data: any[]) => {
      this.#dispatch(...data);
    });
  }

  addListener(listener: Listener): void {
    this.#listeners.push(listener);
  }

  removeListener(listener: Listener): void {
    this.#listeners = this.#listeners.filter((x) => x !== listener);
  }

  hasListener(listener: Listener): boolean {
    return this.#listeners.includes(listener);
  }

  #dispatch(...args: any[]): void {
    this.#listeners.forEach((listener) => {
      listener(...args);
    });
  }
}

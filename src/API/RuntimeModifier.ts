import EventEmitter from "events";
import { register } from "~/manager/runtimeManager";

interface Inject {
  pattern: string;
  script: (x: Window) => void;
}

export default class RuntimeModifier extends EventEmitter {
  name: string;
  #injects: Inject[] = [];

  constructor(name: string) {
    super();
    this.name = name;
    register(this);
  }

  createInject(pattern: Inject["pattern"], script: Inject["script"]): void {
    this.#injects.push({
      pattern,
      script
    });
  }

  getInjects(): Inject[] {
    return this.#injects;
  }
}

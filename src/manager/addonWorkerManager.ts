import { idleState, setIdleState } from "~/data/appState";
import createBindingUtil from "~/util/bindingUtil";

const bindingUtils = new Set<ReturnType<typeof createBindingUtil>>();
const eventListeners = new Map<string, ((...args: any[]) => void)[]>();

export default function register(worker: Worker) {
  const bindingUtil = createBindingUtil(worker);
  bindingUtils.add(bindingUtil);

  Object.entries(eventListeners).forEach(([event, listener]) => {
    bindingUtil.on(event, listener);
  });

  let idle = new (class Idle {
    #oldState = idleState();
    detectionInterval = 60;
    interval = setInterval(this.updateFunc, this.detectionInterval * 1000);

    updateFunc() {
      if (this.#oldState !== idleState()) {
        bindingUtil.emit("util.onStateChanged", idleState());
      }
      this.#oldState = idleState();
    }
  })();

  addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      setIdleState("active");
    } else {
      setIdleState("idle");
    }
  });

  bindingUtil.on("idle.setDetectionInterval", (intervalInSeconds) => {
    idle.detectionInterval = intervalInSeconds;
    clearInterval(idle.interval);
    idle.interval = setInterval(idle.updateFunc, idle.detectionInterval * 1000);
  });
}

function emit(event: string, ...args: any[]) {
  const listeners = eventListeners.get("event") ?? [];

  listeners.forEach((listener) => {
    listener(...args);
  });

  bindingUtils.forEach((bindingUtil) => {
    bindingUtil.emit(event, ...args);
  });
}

function on(event: string, callback: (...args: any[]) => void) {
  const listeners = eventListeners.get("event") ?? [];
  listeners.push(callback);
  eventListeners.set(event, listeners);

  bindingUtils.forEach((bindingUtil) => {
    bindingUtil.on(event, callback);
  });
}

export const globalBindingUtil = { emit, on };

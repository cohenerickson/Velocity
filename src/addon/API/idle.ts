import EventManager from "../types/EventManager";
import bindingUtil from "../util/bindingUtil";
import callbackWrapper from "../util/callbackWrapper";

export type IdleState = "active" | "idle" | "locked";
type StateUpdate = {
  time: number;
  state: IdleState;
};

const idleUpdates: StateUpdate[] = [
  {
    time: Date.now(),
    state: "active"
  }
];

export const getAutoLockDelay = callbackWrapper($getAutoLockDelay);

function $getAutoLockDelay(): number {
  return 0;
}

export const queryState = callbackWrapper($queryState);

async function $queryState(
  detectionIntervalInSeconds: number
): Promise<IdleState> {
  let time = Date.now() - detectionIntervalInSeconds * 1000;
  let state = idleUpdates[0];

  idleUpdates.forEach((update) => {
    if (time <= update.time) {
      state = update;
    }
  });

  return state.state;
}

export function setDetectionInterval(intervalInSeconds: number): void {
  bindingUtil.emit("idle.setDetectionInterval", intervalInSeconds);
}

export const onStateChanged = new EventManager("idle.onStateChanged");

bindingUtil.on("idle.onStateChanged", (data) => {
  idleUpdates.unshift({
    time: Date.now(),
    state: data
  });

  if (idleUpdates.length > 1000) idleUpdates.length = 1000;
});

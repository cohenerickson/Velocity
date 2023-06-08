import bindingUtil from "../bindingUtil";
import callbackWrapper from "../callbackWrapper";
import EventManager from "./types/EventManager";

type IdleState = "active" | "idle" | "locked";

let idleState: IdleState = "active";

export const getAutoLockDelay = callbackWrapper($getAutoLockDelay);

function $getAutoLockDelay(): number {
  return 0;
}

export async function queryState(
  detectionIntervalInSeconds: number,
  callback: (newState: IdleState) => void
): Promise<IdleState> {
  callback(idleState);
  return idleState;
}

export function setDetectionInterval(intervalInSeconds: number): void {}

export const onStateChanged = new EventManager<IdleState>(
  "idle.onStateChanged"
);

bindingUtil.on<IdleState>("idle.onStateChanged", (data) => {
  idleState = data;
});

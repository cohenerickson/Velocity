import EventManager from "../types/EventManager";

export const canonicalURL = "";

type CaptiveState =
  | "unknown"
  | "not_captive"
  | "unlocked_portal"
  | "locked_portal";

export async function getLastChecked(): Promise<number> {
  return 0;
}

export async function getState(): Promise<CaptiveState> {
  return "not_captive";
}

export const onConnectivityAvailable = new EventManager(
  "captivePortal.onConnectivityAvailable"
);

export const onStateChanged = new EventManager("captivePortal.onStateChanged");

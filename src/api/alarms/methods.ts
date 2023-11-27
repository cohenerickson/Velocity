import serial from "../util/serial";
import { Alarm, AlarmCreateInfo } from "./types";

function callSerial<A extends Array<any>, T>(
  fn: string,
  ...args: A
): Promise<T> | void {
  const promise = new Promise<T>(async (resolve, reject) => {
    try {
      const result = await serial.call<T>(fn, ...args);

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });

  if (typeof args.at(-1) === "function") {
    promise.then(args.at(-1));
  } else {
    return promise;
  }
}

export function clear(name?: string): Promise<boolean>;
export function clear(
  name: string,
  callback: (wasCleared: boolean) => void
): void;
export function clear(
  name: string = "",
  callback?: (wasCleared: boolean) => void
): Promise<boolean> | void {
  return callSerial("alarms.clear", name, callback);
}

export function clearAll(): Promise<boolean>;
export function clearAll(callback: (wasCleared: boolean) => void): void;
export function clearAll(
  callback?: (wasCleared: boolean) => void
): Promise<boolean> | void {
  return callSerial("alarms.clearAll", callback);
}

export function create(name: string, alarmInfo: AlarmCreateInfo): Promise<void>;
export function create(
  name: string,
  alarmInfo: AlarmCreateInfo,
  callback: () => void
): void;
export function create(
  name: string = "",
  alarmInfo: AlarmCreateInfo,
  callback?: () => void
): Promise<void> | void {
  return callSerial("alarms.create", name, alarmInfo, callback);
}

export function get(name: string): Promise<Alarm>;
export function get(name: string, callback: (alarm?: Alarm) => void): void;
export function get(
  name: string = "",
  callback?: (alarm?: Alarm) => void
): Promise<Alarm> | void {
  return callSerial("alarms.get", name, callback);
}

export function getAll(): Promise<Alarm[]>;
export function getAll(callback?: (alarms: Alarm[]) => void): void;
export function getAll(
  callback?: (alarms: Alarm[]) => void
): Promise<Alarm[]> | void {
  return callSerial("alarms.getAll", callback);
}

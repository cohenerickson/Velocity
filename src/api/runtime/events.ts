import { Event } from "../events";
import { Port } from "./classes";
import {
  MessageSender,
  OnInstalledReason,
  OnRestartRequiredReason
} from "./types";

export const onBrowserUpdateAvailable = new Event<() => void>(
  "runtime.onBrowserUpdateAvailable"
);
export const onConnect = new Event<(port: Port) => void>("runtime.onConnect");
export const onConnectExternal = new Event<(port: Port) => void>(
  "runtime.onConnectExternal"
);
export const onConnectNative = new Event<(port: Port) => void>(
  "runtime.onConnectNative"
);
export const onInstalled = new Event<
  (details: {
    id?: string;
    previousVersion?: string;
    reason: OnInstalledReason;
  }) => void
>("runtime.onInstalled");
export const onMessage = new Event<
  (
    message: any,
    sender: MessageSender,
    sendResponse: () => void
  ) => boolean | undefined
>("runtime.onMessage");
export const onMessageExternal = new Event<
  (
    message: any,
    sender: MessageSender,
    sendResponse: () => void
  ) => boolean | undefined
>("runtime.onMessageExternal");
export const onRestartRequired = new Event<
  (reason: OnRestartRequiredReason) => void
>("runtime.onRestartRequired");
export const onStartup = new Event<() => void>("runtime.onStartup");
export const onSuspend = new Event<() => void>("runtime.onSuspend");
export const onSuspendCanceled = new Event<() => void>(
  "runtime.onSuspendCanceled"
);
export const onUpdateAvailable = new Event<
  (details: { version: string }) => void
>("runtime.onUpdateAvailable");

import { Event } from "../events";
import { MutedInfo, Tab, TabStatus, ZoomSettings } from "./types";

export const onActivated = new Event<
  (activeInfo: { tabId: number; windowId: number }) => void
>("tabs.onActivated");

export const onActiveChanged = new Event<
  (
    tabId: number,
    selectInfo: {
      windowId: number;
    }
  ) => void
>("tabs.onActiveChanged");

export const onAttached = new Event<
  (
    tabId: number,
    attachInfo: {
      newPosition: number;
      newWindowId: number;
    }
  ) => void
>("tabs.onAttached");

export const onCreated = new Event<(tab: Tab) => void>("tabs.onCreated");

export const onDetached = new Event<
  (
    tabId: number,
    detachInfo: {
      oldPosition: number;
      oldWindowId: number;
    }
  ) => void
>("tabs.onDetached");

export const onHighlightChanged = new Event<
  (selectInfo: { tabIds: number[]; windowId: number }) => void
>("tabs.onHighlightChanged");

export const onHighlighted = new Event<
  (highlightInfo: { tabIds: number[]; windowId: number }) => void
>("tabs.onHighlighted");

export const onMoved = new Event<
  (
    tabId: number,
    moveInfo: {
      fromIndex: number;
      toIndex: number;
      windowId: number;
    }
  ) => void
>("tabs.onMoved");

export const onRemoved = new Event<
  (
    tabId: number,
    removeInfo: {
      isWindowClosing: boolean;
      windowId: number;
    }
  ) => void
>("tabs.onRemoved");

export const onReplaced = new Event<
  (addedTabId: number, removedTabId: number) => void
>("tabs.onReplaced");

export const onSelectionChanged = new Event<
  (
    tabId: number,
    selectInfo: {
      windowId: number;
    }
  ) => void
>("tabs.onSelectionChanged");

export const onUpdated = new Event<
  (
    tabId: number,
    changeInfo: {
      audible?: boolean;
      autoDiscardable?: boolean;
      discarded?: boolean;
      faviconUrl?: string;
      groupId?: number;
      mutedInfo?: MutedInfo;
      pinned?: boolean;
      status?: TabStatus;
      title?: string;
      url?: string;
    },
    tab: Tab
  ) => void
>("tabs.onUpdated");

export const onZoomChange = new Event<
  (ZoomChangeInfo: {
    newZoomFactor: number;
    oldZoomFactor: number;
    tabId: number;
    zoomSettings: ZoomSettings;
  }) => void
>("tabs.onZoomChange");

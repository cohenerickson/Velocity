import {
  DeleteInjectionDetails,
  ImageDetails,
  InjectDetails
} from "../extensionTypes";
import { getMeta } from "../util/meta";
import serial from "../util/serial";
import { Window } from "../windows";
import {
  CreateProperties,
  PageSettings,
  QueryInfo,
  Tab,
  UpdateProperties,
  ZoomSettings
} from "./types";

const meta = await getMeta();

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

/**
 * Creates a data URL encoding the image of an area of the given tab. You must have the <all_urls> permission to use this method.
 */
export function captureTab(
  tabId: number,
  options?: ImageDetails
): Promise<string>;
export function captureTab(
  tabId: number,
  options: ImageDetails,
  callback: (dataUrl: string) => void
): void;
export function captureTab(
  tabId: number,
  options?: ImageDetails,
  callback?: (dataUrl: string) => void
): Promise<string> | void {
  if (meta.type === "chrome") {
    throw new Error("This method is not supported in Chrome.");
  }

  if (!meta.grantedPermissions.includes("<all_urls>")) {
    throw new Error(
      "You must have the <all_urls> permission to use this method."
    );
  }

  return callSerial("tabs.captureTab", tabId, options, callback);
}

/**
 * Captures the visible area of the currently active tab in the specified window. In order to call this method, the extension must have either the <all_urls> permission or the activeTab permission. In addition to sites that extensions can normally access, this method allows extensions to capture sensitive sites that are otherwise restricted, including chrome:-scheme pages, other extensions' pages, and data: URLs. These sensitive sites can only be captured with the activeTab permission. File URLs may be captured only if the extension has been granted file access.
 */
export function captureVisibleTab(
  windowId: number,
  options: ImageDetails
): Promise<string>;
export function captureVisibleTab(
  windowId: number,
  options: ImageDetails,
  callback: (dataUrl: string) => void
): void;
export function captureVisibleTab(
  windowId: number,
  options: ImageDetails,
  callback?: (dataUrl: string) => void
): void | Promise<string> {
  return callSerial("tabs.captureVisibleTab", windowId, options, callback);
}

/**
 * Connects to the content script(s) in the specified tab. The runtime.onConnect event is fired in each content script running in the specified tab for the current extension. For more details, see Content Script Messaging.
 */
export function connect(
  tabId: number,
  connectInfo?: {
    documentId?: string;
    frameId?: number;
    name?: string;
  }
): void {
  throw new Error("Not implemented.");
}

/**
 * Creates a new tab.
 */
export function create(createProperties: CreateProperties): Promise<Tab>;
export function create(
  createProperties: CreateProperties,
  callback: (tab: Tab) => void
): void;
export function create(
  createProperties: CreateProperties,
  callback?: (tab: Tab) => void
): Promise<Tab> | void {
  return callSerial("tabs.create", createProperties, callback);
}

/**
 * Detects the primary language of the content in a tab.
 */
export function detectLanguage(tabId: number): Promise<string>;
export function detectLanguage(
  tabId: number,
  callback: (language: string) => void
): void;
export function detectLanguage(
  tabId: number,
  callback?: (language: string) => void
): Promise<string> | void {
  return callSerial("tabs.detectLanguage", tabId, callback);
}

/**
 * Discards a tab from memory. Discarded tabs are still visible on the tab strip and are reloaded when activated.
 */
export function discard(tabId: number): Promise<Tab>;
export function discard(tabId: number, callback: (tab?: Tab) => void): void;
export function discard(
  tabId: number,
  callback?: (tab?: Tab) => void
): Promise<Tab> | void {
  return callSerial("tabs.discard", tabId, callback);
}

/**
 * Duplicates a tab.
 */
export function duplicate(tabId: number): Promise<Tab>;
export function duplicate(tabId: number, callback: (tab?: Tab) => void): void;
export function duplicate(
  tabId: number,
  callback?: (tab?: Tab) => void
): Promise<Tab> | void {
  return callSerial("tabs.duplicate", tabId, callback);
}

/**
 * Injects JavaScript code into a page. For details, see the programmatic injection section of the content scripts doc.
 *
 * @deprecated Replaced by `scripting.executeScript` in Manifest V3.
 */
export function executeScript(
  tabId: number,
  details: InjectDetails
): Promise<any[]>;
export function executeScript(
  tabId: number,
  details: InjectDetails,
  callback: (result?: any[]) => void
): void;
export function executeScript(
  tabId: number,
  details: InjectDetails,
  callback?: (result?: any[]) => void
): Promise<any[]> | void {
  if (meta.manifestVersion > 2) {
    throw new Error(
      "This method is not supported in manifest version 3 extensions."
    );
  }

  return callSerial("tabs.executeScript", tabId, details, callback);
}

/**
 * Retrieves details about the specified tab.
 */
export function get(tabId: number): Promise<Tab>;
export function get(tabId: number, callback: (tab: Tab) => void): void;
export function get(
  tabId: number,
  callback?: (tab: Tab) => void
): Promise<Tab> | void {
  return callSerial("tabs.get", tabId, callback);
}

/**
 * Gets details about all tabs in the specified window.
 *
 * @deprecated Please use `tabs.query` `{windowId: windowId}`.
 */
export function getAllInWindow(windowId?: number): Promise<Tab[]>;
export function getAllInWindow(
  windowId: number,
  callback: (tabs: Tab[]) => void
): void;
export function getAllInWindow(
  windowId?: number,
  callback?: (tabs: Tab[]) => void
): Promise<Tab[]> | void {
  if (meta.manifestVersion > 2) {
    throw new Error(
      "This method is not supported in manifest version 3 extensions."
    );
  }

  return callSerial("tabs.getAllInWindow", windowId, callback);
}

/**
 * Gets the tab that this script call is being made from. Returns `undefined` if called from a non-tab context (for example, a background page or popup view).
 */
export function getCurrent(): Promise<Tab | undefined>;
export function getCurrent(callback: (tab?: Tab) => void): void;
export function getCurrent(
  callback?: (tab?: Tab) => void
): Promise<Tab | undefined> | void {
  return callSerial("tabs.getCurrent", callback);
}

/**
 * Gets the tab that is selected in the specified window.
 *
 * @deprecated Please use tabs.query {active: true}.
 */
export function getSelected(windowId?: number): Promise<Tab>;
export function getSelected(
  windowId: number,
  callback: (tab: Tab) => void
): void;
export function getSelected(
  windowId?: number,
  callback?: (tab: Tab) => void
): Promise<Tab> | void {
  if (meta.manifestVersion > 2) {
    throw new Error(
      "This method is not supported in manifest version 3 extensions."
    );
  }

  return callSerial("tabs.getSelected", windowId, callback);
}

/**
 * Gets the current zoom factor of a specified tab.
 */
export function getZoom(tabId?: number): Promise<number>;
export function getZoom(
  tabId: number,
  callback: (zoomFactor: number) => void
): void;
export function getZoom(
  tabId?: number,
  callback?: (zoomFactor: number) => void
): Promise<number> | void {
  return callSerial("tabs.getZoom", tabId, callback);
}

/**
 * Gets the current zoom settings of a specified tab.
 */
export function getZoomSettings(tabId: number): Promise<ZoomSettings>;
export function getZoomSettings(
  tabId: number,
  callback: (zoomSettings: ZoomSettings) => void
): void;
export function getZoomSettings(
  tabId?: number,
  callback?: (zoomSettings: ZoomSettings) => void
): Promise<ZoomSettings> | void {
  return callSerial("tabs.getZoomSettings", tabId, callback);
}

/**
 * Go back to the previous page, if one is available.
 */
export function goBack(tabId?: number): Promise<void>;
export function goBack(tabId?: number, callback?: () => void): void;
export function goBack(
  tabId?: number,
  callback?: () => void
): Promise<void> | void {
  return callSerial("tabs.goBack", tabId, callback);
}

/**
 * Hides one or more tabs.
 */
export function hide(tabIds: number | number[]): Promise<number[]> {
  if (meta.type === "chrome") {
    throw new Error("This method is not supported in Chrome.");
  }

  return callSerial("tabs.hide", tabIds) as Promise<number[]>;
}

/**
 * Go foward to the next page, if one is available.
 */
export function goForward(tabId?: number): Promise<void>;
export function goForward(tabId?: number, callback?: () => void): void;
export function goForward(
  tabId?: number,
  callback?: () => void
): Promise<void> | void {
  return callSerial("tabs.goForward", tabId, callback);
}

/**
 * Adds one or more tabs to a specified group, or if no group is specified, adds the given tabs to a newly created group.
 */
export function group(options: {
  createProperties?: {
    windowId?: number;
  };
  groupId?: number;
  tabs: number | number[];
}): Promise<number>;
export function group(
  options: {
    createProperties?: {
      windowId?: number;
    };
    groupId?: number;
    tabs: number | number[];
  },
  callback?: (groupId: number) => void
): void;
export function group(
  options: {
    createProperties?: {
      windowId?: number;
    };
    groupId?: number;
    tabs: number | number[];
  },
  callback?: (groupId: number) => void
): Promise<number> | void {
  if (meta.type === "firefox") {
    throw new Error("This method is not supported in Firefox.");
  }

  return callSerial("tabs.group", options, callback);
}

/**
 * Highlights the given tabs and focuses on the first of group. Will appear to do nothing if the specified tab is currently active.
 */
export function highlight(highlightInfo: {
  tabs: number | number[];
  windowId: number;
}): Promise<Window>;
export function highlight(
  highlightInfo: {
    tabs: number | number[];
    windowId: number;
  },
  callback?: (window: Window) => void
): void;
export function highlight(
  highlightInfo: {
    tabs: number | number[];
    windowId: number;
  },
  callback?: (window: Window) => void
): Promise<Window> | void {
  return callSerial("tabs.highlight", highlightInfo, callback);
}

/**
 * Injects CSS into a page. Styles inserted with this method can be removed with `scripting.removeCSS`. For details, see the programmatic injection section of the content scripts doc.
 *
 * @deprecated Replaced by scripting.insertCSS in Manifest V3.
 */
export function insertCSS(tabId: number, details: InjectDetails): Promise<void>;
export function insertCSS(
  tabId: number,
  details: InjectDetails,
  callback?: () => void
): void;
export function insertCSS(
  tabId: number,
  details: InjectDetails,
  callback?: () => void
): Promise<void> | void {
  if (meta.manifestVersion > 2) {
    throw new Error(
      "This method is not supported in manifest version 3 extensions."
    );
  }

  return callSerial("tabs.insertCSS", tabId, details, callback);
}

/**
 * Moves one or more tabs to a new position within its window, or to a new window. Note that tabs can only be moved to and from normal (window.type === "normal") windows.
 */
export function move(
  tabIds: number | number[],
  moveProperties: {
    index: number;
    windowId?: number;
  }
): Promise<Tab | Tab[]>;
export function move(
  tabIds: number | number[],
  moveProperties: {
    index: number;
    windowId?: number;
  },
  callback?: (tabs: Tab | Tab[]) => void
): void;
export function move(
  tabIds: number | number[],
  moveProperties: {
    index: number;
    windowId?: number;
  },
  callback?: (tabs: Tab | Tab[]) => void
): Promise<Tab | Tab[]> | void {
  return callSerial("tabs.move", tabIds, moveProperties, callback);
}

/**
 * Modifies the succession relationship for a group of tabs.
 */
export function moveInSuccession(
  tabIds: number[],
  tabId: number,
  options: {
    append?: boolean;
    insert?: boolean;
  }
): Promise<void> {
  if (meta.type === "chrome") {
    throw new Error("This method is not supported in Chrome.");
  }

  return callSerial(
    "tabs.moveInSuccession",
    tabIds,
    tabId,
    options
  ) as Promise<void>;
}

/**
 * Prints the contents of the active tab.
 */
export function print(): Promise<void> {
  if (meta.type === "chrome") {
    throw new Error("This method is not supported in Chrome.");
  }

  return callSerial("tabs.print") as Promise<void>;
}

/**
 * Opens print preview for the active tab.
 */
export function printPreview(): Promise<void> {
  if (meta.type === "chrome") {
    throw new Error("This method is not supported in Chrome.");
  }

  return callSerial("tabs.printPreview") as Promise<void>;
}

/**
 * Gets all tabs that have the specified properties, or all tabs if no properties are specified.
 */
export function query(queryInfo: QueryInfo): Promise<Tab[]>;
export function query(
  queryInfo: QueryInfo,
  callback?: (result: Tab[]) => void
): void;
export function query(
  queryInfo: QueryInfo,
  callback?: (result: Tab[]) => void
): Promise<Tab[]> | void {
  return callSerial("tabs.query", queryInfo, callback);
}

/**
 * Reload a tab.
 */
export function reload(
  tabId?: number,
  reloadProperties?: {
    bypassCache?: boolean;
  }
): Promise<void>;
export function reload(
  tabId?: number,
  reloadProperties?: {
    bypassCache?: boolean;
  },
  callback?: () => void
): void;
export function reload(
  tabId?: number,
  reloadProperties?: {
    bypassCache?: boolean;
  },
  callback?: () => void
): Promise<void> | void {
  return callSerial("tabs.reload", tabId, reloadProperties, callback);
}

/**
 * Closes one or more tabs.
 */
export function remove(tabIds: number | number[]): Promise<void>;
export function remove(tabIds: number | number[], callback?: () => void): void;
export function remove(
  tabIds: number | number[],
  callback?: () => void
): Promise<void> | void {
  return callSerial("tabs.remove", tabIds, callback);
}

/**
 * Removes from a page CSS that was previously injected by a call to `scripting.insertCSS`.
 *
 * @deprecated Replaced by scripting.removeCSS in Manifest V3.
 */
export function removeCSS(
  tabId: number,
  details: DeleteInjectionDetails
): Promise<void>;
export function removeCSS(
  tabId: number,
  details: DeleteInjectionDetails,
  callback?: () => void
): void;
export function removeCSS(
  tabId: number,
  details: DeleteInjectionDetails,
  callback?: () => void
): Promise<void> | void {
  if (meta.manifestVersion > 2) {
    throw new Error(
      "This method is not supported in manifest version 3 extensions."
    );
  }

  return callSerial("tabs.removeCSS", tabId, details, callback);
}

/**
 * Saves the current page as a PDF.
 */
export function saveAsPDF(
  pageSettings: PageSettings
): Promise<"saved" | "replaced" | "canceled" | "not_saved" | "not_replaced"> {
  if (meta.type === "chrome") {
    throw new Error("This method is not supported in Chrome.");
  }

  return callSerial("tabs.saveAsPDF", pageSettings) as Promise<
    "saved" | "replaced" | "canceled" | "not_saved" | "not_replaced"
  >;
}

/**
 * Sends a single message to the content script(s) in the specified tab, with an optional callback to run when a response is sent back. The `runtime.onMessage` event is fired in each content script running in the specified tab for the current extension.
 */
export function sendMessage(
  tabId: number,
  message: any,
  options?: {
    documentId?: string;
    frameId?: number;
  }
): Promise<any>;
export function sendMessage(
  tabId: number,
  message: any,
  options?: {
    documentId?: string;
    frameId?: number;
  },
  callback?: (response: any) => void
): void;
export function sendMessage(
  tabId: number,
  message: any,
  options?: {
    documentId?: string;
    frameId?: number;
  },
  callback?: (response: any) => void
): Promise<any> | void {
  return callSerial("tabs.sendMessage", tabId, message, options, callback);
}

/**
 * Sends a single request to the content script(s) in the specified tab, with an optional callback to run when a response is sent back. The extension.onRequest event is fired in each content script running in the specified tab for the current extension.
 */
export function sendRequest(tabId: number, request: any): Promise<any>;
export function sendRequest(
  tabId: number,
  request: any,
  callback?: (response: any) => void
): void;
export function sendRequest(
  tabId: number,
  request: any,
  callback?: (response: any) => void
): Promise<any> | void {
  if (meta.manifestVersion > 2) {
    throw new Error(
      "This method is not supported in manifest version 3 extensions."
    );
  }

  return callSerial("tabs.sendRequest", tabId, request, callback);
}

/**
 * Zooms a specified tab.
 */
export function setZoom(tabId: number, zoomFactor: number): Promise<void>;
export function setZoom(
  tabId: number,
  zoomFactor: number,
  callback?: () => void
): void;
export function setZoom(
  tabId: number,
  zoomFactor: number,
  callback?: () => void
): Promise<void> | void {
  return callSerial("tabs.setZoom", tabId, zoomFactor, callback);
}

/**
 * Sets the zoom settings for a specified tab, which define how zoom changes are handled. These settings are reset to defaults upon navigating the tab.
 */
export function setZoomSettings(
  tabId: number,
  zoomSettings: ZoomSettings
): Promise<void>;
export function setZoomSettings(
  tabId: number,
  zoomSettings: ZoomSettings,
  callback?: () => void
): void;
export function setZoomSettings(
  tabId: number,
  zoomSettings: ZoomSettings,
  callback?: () => void
): Promise<void> | void {
  return callSerial("tabs.setZoomSettings", tabId, zoomSettings, callback);
}

/**
 * Shows one or more tabs that were previously hidden by a call to `tabs.hide`.
 */
export function show(tabIds: number | number[]): Promise<void> {
  if (meta.type === "chrome") {
    throw new Error("This method is not supported in Chrome.");
  }

  return callSerial("tabs.show", tabIds) as Promise<void>;
}

/**
 * Toggles Reader mode for the specified tab.
 */
export function toggleReaderMode(tabId: number): Promise<void> {
  if (meta.type === "chrome") {
    throw new Error("This method is not supported in Chrome.");
  }

  return callSerial("tabs.toggleReaderMode", tabId) as Promise<void>;
}

/**
 * Removes one or more tabs from their respective groups. If any groups become empty, they are deleted.
 */
export function ungroup(tabIds: number | number[]): Promise<void>;
export function ungroup(tabIds: number | number[], callback?: () => void): void;
export function ungroup(
  tabIds: number | number[],
  callback?: () => void
): Promise<void> | void {
  if (meta.type === "firefox") {
    throw new Error("This method is not supported in Firefox.");
  }

  return callSerial("tabs.ungroup", tabIds, callback);
}

/**
 * Modifies the properties of a tab. Properties that are not specified in `updateProperties` are not modified.
 */
export function update(tabId: number, updateProperties: any): Promise<Tab>;
export function update(
  tabId: number,
  updateProperties: UpdateProperties,
  callback?: () => void
): void;
export function update(
  tabId: number,
  updateProperties: UpdateProperties,
  callback?: () => void
): Promise<Tab> | void {
  return callSerial("tabs.update", tabId, updateProperties, callback);
}

/**
 * Prepare the tab to make a potential following switch faster.
 */
export function warmup(tabId: number): Promise<void> {
  if (meta.type === "chrome") {
    throw new Error("This method is not supported in Chrome.");
  }

  return callSerial("tabs.warmup", tabId) as Promise<void>;
}

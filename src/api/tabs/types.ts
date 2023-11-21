export type MutedInfo = {
  extensionId?: string;
  muted: boolean;
  reason?: MutedInfoReason;
};

export enum MutedInfoReason {
  CAPTURE = "capture",
  EXTENSION = "extension",
  USER = "user"
}

export enum TabStatus {
  COMPLETE = "complete",
  LOADING = "loading",
  UNLOADED = "unloaded"
}

export enum WindowType {
  NORMAL = "normal",
  POPUP = "popup",
  PANEL = "panel",
  APP = "app",
  DEVTOOLS = "devtools"
}

export type ZoomSettings = {
  defaultZoomFactor?: number;
  mode?: ZoomSettingsMode;
  scope?: ZoomSettingsScope;
};

export type PageSettings = {
  edgeBottom?: number;
  edgeLeft?: number;
  edgeRight?: number;
  edgeTop?: number;
  footerCenter?: string;
  footerLeft?: string;
  footerRight?: string;
  headerCenter?: string;
  headerLeft?: string;
  headerRight?: string;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  orientation?: 0 | 1;
  paperHeight?: number;
  paperSizeUnit?: 0 | 1;
  paperWidth?: number;
  scaling?: number;
  showBackgroundColors?: boolean;
  showBackgroundImages?: boolean;
  shrinkToFit?: boolean;
  toFileName?: string;
};

export enum ZoomSettingsMode {
  AUTOMATIC = "automatic",
  MANUAL = "manual",
  DISABLED = "disabled"
}

export enum ZoomSettingsScope {
  PER_ORIGIN = "per-origin",
  PER_TAB = "per-tab"
}

export type Tab = {
  active: boolean;
  audible: boolean;
  autoDiscardable: boolean;
  cookieStoreId?: string;
  discarded: boolean;
  favIconUrl: string;
  height?: number;
  hidden: boolean;
  highlighted: boolean;
  id: number;
  incognito: boolean;
  index: number;
  isInReaderMode: boolean;
  lastAccessed: number;
  mutedInfo?: MutedInfo;
  openerTabId?: number;
  pinned: boolean;
  sessionId?: string;
  status: TabStatus;
  successorTabId?: number;
  title?: string;
  url: string;
  width?: number;
  windowId: number;
};

export type CreateProperties = {
  active?: boolean;
  index?: number;
  openerTabId?: number;
  pinned?: boolean;
  url?: string;
  windowId?: number;
};

export type UpdateProperties = {
  active?: boolean;
  autoDiscardable?: boolean;
  highlighted?: boolean;
  muted?: boolean;
  openerTabId?: number;
  pinned?: boolean;
  selected?: boolean;
  url?: string;
};

export type QueryInfo = {
  active?: boolean;
  audible?: boolean;
  autoDiscardable?: boolean;
  currentWindow?: boolean;
  discarded?: boolean;
  groupId?: number;
  highlighted?: boolean;
  index?: number;
  lastFocusedWindow?: boolean;
  muted?: boolean;
  pinned?: boolean;
  status?: TabStatus;
  title?: string;
  url?: string | string[];
  windowId?: number;
  windowType?: WindowType;
};

export type ConnectInfo = {
  documentId?: string;
  frameId?: number;
  name?: string;
};

export type MutedInfo = {
  extensionId?: string;
  muted: boolean;
  reason?: MutedInfoReason;
};

export type MutedInfoReason = "capture" | "extension" | "user";

export type TabStatus = "unloaded" | "loading" | "complete";

export type WindowType = "normal" | "popup" | "panel" | "app" | "devtools";

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

export type ZoomSettingsMode = "automatic" | "manual" | "disabled";

export type ZoomSettingsScope = "per-origin" | "per-tab";

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
}

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

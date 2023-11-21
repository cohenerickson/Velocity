import type { Tab } from "../tabs";

export enum ContextType {
  ALL = "all",
  PAGE = "page",
  FRAME = "frame",
  SELECTION = "selection",
  LINK = "link",
  EDITABLE = "editable",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  LAUNCHER = "launcher",
  BROWSER_ACTION = "browser_action",
  PAGE_ACTION = "page_action",
  ACTION = "action"
}

export enum ItemType {
  NORMAL = "normal",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  SEPARATOR = "separator"
}

export type OnClickData = {
  checked?: boolean;
  editable: boolean;
  frameId?: number;
  frameUrl?: string;
  linkUrl?: string;
  mediaType?: string;
  menuItemId: number | string;
  pageUrl?: string;
  parentMenuItemId?: number | string;
  selectionText?: string;
  srcUrl?: string;
  wasChecked?: boolean;
};

export type CreateProperties = {
  checked?: boolean;
  contexts: (ContextType | ContextType[])[];
  documentUrlPatterns?: string[];
  enabled?: boolean;
  id?: string;
  parentId?: number | string;
  targetUrlPatterns?: string[];
  title?: string;
  type?: ItemType;
  visible?: boolean;
  onclick?: (info: OnClickData, tab: Tab) => void;
};

export type UpdateProperties = {
  checked?: boolean;
  contexts?: (ContextType | ContextType[])[];
  documentUrlPatterns?: string[];
  enabled?: boolean;
  parentId?: number | string;
  targetUrlPatterns?: string[];
  title?: string;
  type?: ItemType;
  visible?: boolean;
  onclick?: (info: OnClickData, tab: Tab) => void;
};

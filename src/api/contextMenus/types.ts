import type { Tab } from "../tabs";

export type ContextType =
  | "all"
  | "page"
  | "frame"
  | "selection"
  | "link"
  | "editable"
  | "image"
  | "video"
  | "audio"
  | "launcher"
  | "browser_action"
  | "page_action"
  | "action";

export type ItemType = "normal" | "checkbox" | "radio" | "separator";

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

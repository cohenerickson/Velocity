// Types
export type ImageDetails = {
  format?: ImageFormat;
  quality?: number;
  rect?: Rect;
  scale?: number;
};

export type ImageFormat = "jpeg" | "png";

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type InjectDetails = {
  allFrames?: boolean;
  code?: string;
  cssOrigin?: CSSOrigin;
  file?: string;
  frameId?: number;
  matchAboutBlank?: boolean;
  runAt?: RunAt;
};

export type CSSOrigin = "author" | "user";

export type DeleteInjectionDetails = {
  allFrames?: boolean;
  code?: string;
  cssOrigin?: CSSOrigin;
  file?: string;
  frameId?: number;
  matchAboutBlank?: boolean;
};

export type RunAt = "document_start" | "document_end" | "document_idle";

export * as declarativeContent from "./declarativeContent";
export * as dns from "./dns";
export * as dom from "./dom";
export * as extension from "./extension";
export * as i18n from "./i18n";
export * as pageAction from "./pageAction";
export * as permissions from "./permissions";
export * as runtime from "./runtime";
export * as tabs from "./tabs";
export * as windows from "./windows";

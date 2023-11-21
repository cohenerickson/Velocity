export enum CSSOrigin {
  AUTHOR = "author",
  USER = "user"
}

export type DeleteInjectionDetails = {
  allFrames?: boolean;
  code?: string;
  cssOrigin?: CSSOrigin;
  file?: string;
  frameId?: number;
  matchAboutBlank?: boolean;
};

export enum DocumentLifecycle {
  PRERENDER = "prerender",
  ACTIVE = "active",
  CACHED = "cached",
  PENDING_DELETION = "pending_deletion"
}

export enum FrameType {
  OUTERMOST_FRAME = "outermost_frame",
  FENCED_FRAME = "fenced_frame",
  SUB_FRAME = "sub_frame"
}

export type ImageDetails = {
  format?: ImageFormat;
  quality?: number;
  rect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  scale?: number;
};

export enum ImageFormat {
  JPEG = "jpeg",
  PNG = "png"
}

export type InjectDetails = {
  allFrames?: boolean;
  code?: string;
  cssOrigin?: CSSOrigin;
  file?: string;
  frameId?: number;
  matchAboutBlank?: boolean;
  runAt?: RunAt;
};

export enum RunAt {
  DOCUMENT_START = "document_start",
  DOCUMENT_END = "document_end",
  DOCUMENT_IDLE = "document_idle"
}

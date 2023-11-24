import { Tab } from "../tabs";

export type ContextFilter = {
  contextIds?: string[];
  contextTypes?: ContextType[];
  documentIds?: string[];
  documentOrigins?: string[];
  documentUrls?: string[];
  frameIds?: number[];
  incognito?: boolean;
  tabIds?: number[];
  windowIds?: number[];
};

export enum ContextType {
  TAB = "TAB",
  POPUP = "POPUP",
  BACKGROUND = "BACKGROUND",
  OFFSCREEN_DOCUMENT = "OFFSCREEN_DOCUMENT",
  SIDE_PANEL = "SIDE_PANEL"
}

export type ExtensionContext = {
  contextId: string;
  contextType: ContextType;
  documentId?: string;
  documentOrigin?: string;
  documentUrl?: string;
  frameId: number;
  incognito: boolean;
  tabId: number;
  windowId: number;
};

export type MessageSender = {
  documentId?: string;
  documentLifecycle?: string;
  frameId?: number;
  id?: string;
  nativeApplication?: string;
  origin?: string;
  tab?: Tab;
  tlsChannelId?: string;
  url?: string;
};

export enum OnInstalledReason {
  INSTALL = "install",
  UPDATE = "update",
  CHROME_UPDATE = "chrome_update",
  BROWSER_UPDATE = "browser_update",
  SHARED_MODULE_UPDATE = "shared_module_update"
}

export enum OnRestartRequiredReason {
  APP_UPDATE = "app_update",
  OS_UPDATE = "os_update",
  PERIODIC = "periodic"
}

export enum PlatformArch {
  ARM = "arm",
  ARM64 = "arm64",
  X86_32 = "x86-32",
  X86_64 = "x86-64",
  MIPS = "mips",
  MIPS64 = "mips64"
}

export type PlatformInfo = {
  arch: PlatformArch;
  nacl_arch: PlatformNaclArch;
  os: PlatformOs;
};

export enum PlatformNaclArch {
  ARM = "arm",
  ARM64 = "arm64",
  X86_32 = "x86-32",
  X86_64 = "x86-64",
  MIPS = "mips",
  MIPS64 = "mips64"
}

export enum PlatformOs {
  MAC = "mac",
  WIN = "win",
  ANDROID = "android",
  CROS = "cros",
  LINUX = "linux",
  OPENBSD = "openbsd",
  FUCHSIA = "fuchsia"
}

export enum RequestUpdateCheckStatus {
  THROTTLED = "throttled",
  NO_UPDATE = "no_update",
  UPDATE_AVAILABLE = "update_available"
}

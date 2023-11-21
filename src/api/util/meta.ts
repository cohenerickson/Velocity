import serial from "./serial";

export type ExtensionMeta = {
  type: "chrome" | "firefox";
  version: string;
  nonGrantedPermissions: string[];
  grantedPermissions: string[];
  manifestVersion: number;
  extensionId: string;
  enabled: boolean;
  pinned: boolean;
};

export async function getMeta(): Promise<ExtensionMeta> {
  return {} as any;
}

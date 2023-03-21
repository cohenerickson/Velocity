export default interface ExtensionEntry {
  canUninstall: boolean;
  description?: string;
  id: string;
  isActive: boolean;
  isEnabled: boolean;
  name: string;
  type: "theme" | "extension";
  version: string;
  archive: string;
}

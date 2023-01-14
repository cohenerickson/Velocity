export default interface Preferences {
  "general.startup.openPreviousTabs"?: boolean;
  "general.tabs.openWindowLinksInTab"?: boolean;
  "general.tabs.switchToMedia"?: boolean;
  "general.tabs.confirmBeforeQuitting"?: boolean;
  "search.defaults.searchEngine"?:
    | "google"
    | "bing"
    | "duckduckgo"
    | "brave"
    | "custom";
  "search.defaults.searchEngine.custom"?: {
    name: string;
    pattern: string;
  };
}

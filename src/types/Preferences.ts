export default interface Preferences {
  "general.startup.openPreviousTabs"?: boolean;
  "general.tabs.openWindowLinksInTab"?: boolean;
  "general.tabs.switchToMedia"?: boolean;
  "general.tabs.confirmBeforeClosing"?: boolean;
  "search.defaults.searchEngine"?:
    | "google"
    | "bing"
    | "duckduckgo"
    | "brave"
    | "yahoo";
  "search.defaults.proxy"?: "ultraviolet";
}

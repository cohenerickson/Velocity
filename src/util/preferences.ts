import Preferences from "~/types/Preferences";

export default function preferences(): Preferences {
  return localStorage.getItem("preferences")
    ? JSON.parse(localStorage.getItem("preferences") as string)
    : ({
        "general.startup.openPreviousTabs": true,
        "general.tabs.openWindowLinksInTab": true,
        "general.tabs.switchToMedia": false,
        "general.tabs.confirmBeforeClosing": true,
        "search.defaults.searchEngine": "google",
        "search.defaults.proxy": "ultraviolet"
      } as const);
}

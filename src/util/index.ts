import type Tab from "~/api/Tab";
import { tabStack } from "~/data/appState";
import type Preferences from "~/types/Preferences";

export function preferences(): Preferences {
  return localStorage.getItem("preferences")
    ? JSON.parse(localStorage.getItem("preferences") as string)
    : ({
        "general.startup.openPreviousTabs": true,
        "general.tabs.openWindowLinksInTab": true,
        "general.tabs.switchToMedia": false,
        "general.tabs.confirmBeforeClosing": true,
        "search.defaults.useHttps": false,
        "search.defaults.searchEngine": "google",
        "search.defaults.proxy": "ultraviolet",
        "bookmarks.shown": true
      } as const);
}

export const xor = {
  encode(str: string): string {
    if (!str) return str;
    return encodeURIComponent(
      str
        .toString()
        .split("")
        .map((char, ind) =>
          ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
        )
        .join("")
    );
  },
  decode(str: string): string {
    if (!str) return str;
    let [input, ...search] = str.split("?");

    return (
      decodeURIComponent(input)
        .split("")
        .map((char, ind) =>
          ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
        )
        .join("") + (search.length ? "?" + search.join("?") : "")
    );
  }
};

export const engines = {
  google: {
    name: "Google",
    searchStr: "https://www.google.com/search?q=%s"
  },
  bing: {
    name: "Bing",
    searchStr: "https://www.bing.com/search?q=%s"
  },
  duckduckgo: {
    name: "DuckDuckGo",
    searchStr: "https://duckduckgo.com/?q=%s"
  },
  brave: {
    name: "Brave",
    searchStr: "https://search.brave.com/search?q=%s"
  },
  yahoo: {
    name: "Yahoo",
    searchStr: "https://search.yahoo.com/search?p=%s"
  }
};

// https://stackoverflow.com/a/26420284 (with slight modifications)
export function patternToRegExp(pattern: string) {
  if (pattern == "<all_urls>") return /^(?:http|https|file|ftp):\/\/.*/;

  var split = /^(\*|http|https|file|ftp):\/\/(.*)$/.exec(pattern);
  if (!split) return /$./;
  var schema = split[1];
  var fullpath = split[2];

  var split = /^([^\/]*)\/(.*)$/.exec(fullpath);
  if (!split) return /$./;
  var host = split[1];
  var path = split[2];

  // File
  if (schema == "file" && host != "") return /$./;
  if (schema != "file" && host == "") return /$./;
  if (!/^(\*|\*\.[^*]+|[^*]*)$/.exec(host)) return /$./;

  var reString = "^";
  reString += schema == "*" ? "https*" : schema;
  reString += ":\\/\\/";
  // Not overly concerned with intricacies
  //   of domain name restrictions and IDN
  //   as we're not testing domain validity
  reString += host.replace(/\*\.?/, "[^\\/]*");
  reString += "(:\\d+)?";
  reString += "\\/";
  reString += path.replace("*", ".*");
  reString += "$";

  return RegExp(reString);
}

export const ADDON_NORMALIZE_REGEX = /^\.?\//;

export function getActiveTab(): Tab {
  return Array.from(tabStack())[0];
}

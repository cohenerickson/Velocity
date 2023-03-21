import { xor } from ".";
import { engines, preferences } from "./";
import protocol from "~/manager/protocolManager";

export function normalize(url: string): string {
  if (!("location" in globalThis)) return url;
  const reverse = protocol.reverse(url);
  if (protocol.find(url)) {
    return url;
  }
  if (reverse) {
    url = reverse;
  } else if (url.startsWith(location.origin + window.__uv$config.prefix)) {
    url = url.replace(location.origin + window.__uv$config.prefix, "");
    url = xor.decode(url);
  }
  if (url === "about:newTab") {
    url = "";
  }

  return url;
}

export function generateProxyUrl(query: string): string {
  let location: string;
  if (!window.__uv$config) window.location.reload();
  if (protocol.find(query) || protocol.reverse(query)) {
    location = protocol.find(query) || "/internal/newTab";
  } else if (/^https?:\/\/([^\s]+\.)+[^\s]+(:[0-65536])?$/.test(query)) {
    location = window.__uv$config.prefix + window.__uv$config.encodeUrl(query);
  } else if (/^([^\s]+\.)+[^\s]+(:[0-65536])?$/.test(query)) {
    /*
        We use http here because otherwise we will get certifacate issues when trying to
        connect to http only websites. If a website uses https it should automatically redirect.

        In the future we should look into sniffing for https and using https if the website
        supports it.
      */
    location =
      window.__uv$config.prefix +
      window.__uv$config.encodeUrl(
        "http" +
          (preferences()["search.defaults.useHttps"] ? "s" : "") +
          "://" +
          query
      );
  } else {
    location =
      window.__uv$config.prefix +
      window.__uv$config.encodeUrl(generateSearchURL(query));
  }
  return location;
}

function generateSearchURL(query: string): string {
  return engines[
    preferences()["search.defaults.searchEngine"] || "google"
  ].searchStr.replace("%s", encodeURIComponent(query));
}

export function areEqual(a: string, b: string): boolean {
  try {
    const urlA = new URL(a);
    const urlB = new URL(b);
    return (
      urlA.origin === urlB.origin &&
      urlA.pathname === urlB.pathname &&
      urlA.search === urlB.search
    );
  } catch {
    return false;
  }
}

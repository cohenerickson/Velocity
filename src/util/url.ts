import protocol from "./protocol";
import { xor } from "./codec";
import engines from "./engines";
import preferences from "./preferences";

export function normalize(url: string): string {
  if (!("location" in globalThis)) return url;
  if (url.startsWith(location.origin + "/about/")) {
    url = url.replace(location.origin + "/about/", "about:");
  }
  if (url.startsWith(location.origin + "/~/")) {
    url = url.replace(location.origin + "/~/", "");
    url = xor.decode(url);
  }
  if (url === "about:newTab") {
    url = "";
  }

  return url;
}

export function generateProxyUrl(query: string): string {
  let location: string;
  if (/^about:/i.test(query)) {
    location =
      protocol.get(query.replace(/^about:/i, "").toLowerCase()) ||
      "/about/blank";
  } else if (/^https?:\/\/([^\s]+\.)+[^\s]+(:[0-65536])?$/.test(query)) {
    location = window.__uv$config.prefix + window.__uv$config.encodeUrl(query);
  } else if (/^([^\s]+\.)+[^\s]+(:[0-65536])?$/.test(query)) {
    /*
        We use http here because otherwise we will get certifacate issues when trying to
        connect to http only websites. If a website uses https it should automatically redirect.
      */
    location =
      window.__uv$config.prefix +
      window.__uv$config.encodeUrl("http://" + query);
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

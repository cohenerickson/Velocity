import protocol from "./protocol";

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
    location = protocol.get(query.replace(/^about:/i, "").toLowerCase()) || "/about/blank";
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
      window.__uv$config.encodeUrl(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`
      );
  }
  return location;
}

const xor = {
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

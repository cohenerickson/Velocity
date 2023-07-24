import Color from "color";
import mime from "mime-types";
import { isServer } from "solid-js/web";
import type Manifest from "webextension-manifest";
import type { Theme } from "webextension-manifest";
import type AddonReader from "~/api/AddonReader";

export const defaultTheme = {
  colors: {
    frame: "#1c1b22",
    tab_selected: "#42414d",
    tab_background_text: "white",
    toolbar: "#2b2a33",
    toolbar_text: "white",
    toolbar_field: "#1C1B22",
    toolbar_field_text: "white",
    tab_line: "transparent"
  }
};

let activeTheme = Object.assign({}, defaultTheme);

if (!isServer) updateCssVariables(activeTheme);

export default function setTheme(manifest: Manifest, reader: AddonReader) {
  const newTheme = Object.assign({}, activeTheme, manifest.theme);
  updateCssVariables(newTheme, reader);
  activeTheme = newTheme;
  localStorage.setItem("theme", JSON.stringify(activeTheme));
}

export async function updateCssVariables(theme: Theme, reader?: AddonReader) {
  const root = document.querySelector<HTMLElement>(":root")!;

  root.setAttribute("style", "");

  for (let rule in theme.colors) {
    if (rule === "accentcolor") {
      rule = "frame";
      console.warn(
        "Using accentcolor in themes is deprecated since Firefox 70."
      );
    }
    if (rule === "textcolor") {
      rule = "tab_background_text";
      console.warn(
        "Using tab_background_text in themes is deprecated since Firefox 70."
      );
    }
    // https://searchfox.org/mozilla-central/rev/31f5847a4494b3646edabbdd7ea39cb88509afe2/toolkit/components/extensions/schemas/theme.json#154
    if (rule === "bookmark_text") rule = "toolbar_text";

    const cssRule = `--${rule.replace(/_/g, "-")}`;
    root.style.setProperty(
      cssRule,
      Color(theme.colors[rule as keyof Theme["colors"]]).toString()
    );
  }

  if (theme.images && reader) {
    for (let rule in theme.images) {
      if (rule === "headerURL") rule = "theme_frame";

      const cssRule = `--${rule.replace(/_/g, "-")}`;

      if (rule === "additional_backgrounds") {
        let property = "";
        const images = theme.images.additional_backgrounds!;
        for (const i in images) {
          property += `url(${URL.createObjectURL(
            await extractBlob(images[i], reader)
          )})${images.length - 1 <= Number(i) ? "" : ","}`;
        }
        root.style.setProperty(cssRule, property);
      } else {
        const blob = URL.createObjectURL(
          await extractBlob(theme.images[rule as keyof Theme["images"]], reader)
        );
        root.style.setProperty(cssRule, `url(${blob})`);
      }
    }
  }

  if (theme.properties) {
    for (let property in theme.properties) {
      const cssRule = `--${property.replace(/_/g, "-")}`;
      const value = (theme.properties as any)[property] as string | string[];
      if (typeof value === "string") {
        root.style.setProperty(cssRule, value);
      } else {
        root.style.setProperty(cssRule, value.join(","));
      }
    }
  }
}

async function extractBlob(url: string, reader: AddonReader): Promise<Blob> {
  const blob = await reader.extractFile(url, mime.lookup(url) || "text/plain");
  if (typeof blob === "string") throw new Error("Unable to extract file.");
  return blob!;
}

import Color from "color";
import mimeDB from "mime-db";
import { isServer } from "solid-js/web";
import type Manifest from "webextension-manifest";
import type { Theme } from "webextension-manifest";
import type AddonReader from "~/API/AddonReader";

export const defaultTheme = {
  colors: {
    tab_background_text: "#fbfbfe",
    tab_selected: "rgb(66,65,77)",
    tab_text: "rgb(251,251,254)",
    icons: "rgb(251,251,254)",
    frame: "#1c1b22",
    popup: "rgb(66,65,77)",
    popup_text: "rgb(251,251,254)",
    popup_border: "rgb(82,82,94)",
    popup_highlight: "rgb(43,42,51)",
    tab_line: "transparent",
    toolbar: "rgb(43,42,51)",
    toolbar_top_separator: "transparent",
    toolbar_bottom_separator: "hsl(240, 5%, 5%)",
    toolbar_field: "rgb(28,27,34)",
    toolbar_field_border: "transparent",
    toolbar_field_text: "rgb(251,251,254)",
    toolbar_field_focus: "rgb(66,65,77)",
    toolbar_text: "rgb(251, 251, 254)",
    ntp_background: "rgb(43, 42, 51)",
    ntp_card_background: "rgb(66,65,77)",
    ntp_text: "rgb(251, 251, 254)",
    sidebar: "#38383D",
    sidebar_text: "rgb(249, 249, 250)",
    sidebar_border: "rgba(255, 255, 255, 0.1)",
    button: "rgb(43,42,51)",
    button_hover: "rgb(82,82,94)",
    button_active: "rgb(91,91,102)",
    button_primary: "rgb(0, 221, 255)",
    button_primary_hover: "rgb(128, 235, 255)",
    button_primary_active: "rgb(170, 242, 255)",
    button_primary_color: "rgb(43, 42, 51)",
    input_background: "#42414D",
    input_color: "rgb(251,251,254)",
    input_border: "#8f8f9d",
    autocomplete_popup_separator: "rgb(82,82,94)",
    appmenu_update_icon_color: "#54FFBD",
    appmenu_info_icon_color: "#80EBFF",
    tab_icon_overlay_stroke: "rgb(66,65,77)",
    tab_icon_overlay_fill: "rgb(251,251,254)",

    /*
     * these properties are normally only adjustable with user stylesheets
     * however Velocity's ui structure is different so user stylesheets won't work anyways
     */
    panel: "rgb(39, 39, 39)",
    panel_text: "rgb(255, 255, 255)",
    panel_text_disabled: "rgb(146, 146, 146)",
    panel_border: "rgba(0,0,0,.4)",
    panel_shadow: "hsla(0,0%,0%,.2)"
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
      // prettier-ignore
      console.warn("Using accentcolor in themes is deprecated since Firefox 70.");
    }
    if (rule === "textcolor") {
      rule = "tab_background_text";
      // prettier-ignore
      console.warn("Using tab_background_text in themes is deprecated since Firefox 70.");
    }
    if (rule === "bookmark_text") rule = "toolbar_text"; // https://searchfox.org/mozilla-central/rev/31f5847a4494b3646edabbdd7ea39cb88509afe2/toolkit/components/extensions/schemas/theme.json#154

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
  const blob = await reader.extractFile(url, getMime(url));
  if (typeof blob === "string") throw new Error("Unable to extract file.");
  return blob!;
}

function getMime(file: string): string {
  const extension = file.split(/\./i).at(-1) || "txt";
  for (const mime in mimeDB) {
    if (
      mimeDB[mime].extensions &&
      mimeDB[mime].extensions?.includes(extension)
    ) {
      return mime;
    }
  }
  return "text/plain";
}


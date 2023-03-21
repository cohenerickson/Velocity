import { register } from "./contentScriptManager";
import type { ContentScript } from "./contentScriptManager";
import type Manifest from "webextension-manifest";
import type AddonReader from "~/API/AddonReader";

export default function startAddon(manifest: Manifest, reader: AddonReader) {
  if (manifest.content_scripts) {
    manifest.content_scripts.forEach(async (contentScript) => {
      // TODO: figure out better way to handle this so we don't have to use @ts-ignore
      if (contentScript.js)
        // @ts-ignore
        contentScript.js = contentScript.js.map(async (script) =>
          reader.extractFile(script, "text")
        );
      if (contentScript.css)
        // @ts-ignore
        contentScript.css = contentScript.css.map(async (script) =>
          reader.extractFile(script, "text")
        );

      register(contentScript as ContentScript, manifest.permissions ?? []);
    });
  }
}

import { register } from "./contentScriptManager";
import type { ContentScript } from "./contentScriptManager";
import setTheme from "./themeManager";
import { updateCssVariables, defaultTheme } from "./themeManager";
import type { IDBPDatabase } from "idb";
import { openDB } from "idb";
import Manifest, { ContentScripts, Permissions } from "webextension-manifest";
import AddonReader from "~/API/AddonReader";
import { addons, setAddons } from "~/data/appState";
import type AddonEntry from "~/types/AddonEntry";

const db: IDBPDatabase = await openDB("addons", 1, {
  upgrade(db) {
    db.createObjectStore("addons", {
      keyPath: "id"
    });
  }
});

const tx = db.transaction("addons", "readwrite");
const store = tx.objectStore("addons");

setAddons(await store.getAll());

addons().forEach(async (addon) => {
  await initAddon(addon);
});

export async function install(
  reader: AddonReader,
  url: string
): Promise<string> {
  const manifest = await reader.extractManifest();
  if (
    window.confirm(
      `This site would like to install an add-on in Velocity: \n ${
        manifest.short_name ?? manifest.name
      }`
    )
  ) {
    const addon: AddonEntry = {
      canUninstall: true,
      id: (await reader.id) ?? manifest.name,
      isActive: true,
      isEnabled: true,
      name: manifest.name,
      type: manifest.theme ? "theme" : "extension",
      version: manifest.version,
      description: manifest.description,
      archive: url
    };

    if (addon.type === "theme") {
      setAddons(
        addons().map((x) => {
          if (x.type === "theme") {
            x.isActive = false;
            x.isEnabled = false;
          }
          return x;
        })
      );
    }

    setAddons([addon, ...addons()]);

    updateDatabase();

    await initAddon(addon, reader, manifest);

    return await reader.id;
  } else {
    throw new Error("User prevented installation.");
  }
}

export function uninstall(addon: AddonEntry): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (addon.canUninstall) {
      if (addon.type === "theme") {
        if (addon.isActive && addon.isEnabled) {
          localStorage.setItem("theme", "");
          updateCssVariables(defaultTheme);
        }
      }
      setAddons(addons().filter((x) => x.id !== addon.id));
      await updateDatabase();
      if (window.confirm("Action may require page reload.")) {
        location.reload();
        resolve();
      } else {
        console.warn(
          "Addon may still be running in the background, in order to ensure the addon is fully uninstalled please reload the tab."
        );
        resolve();
      }
    } else {
      reject();
    }
  });
}

async function initAddon(
  addon: AddonEntry,
  reader?: AddonReader,
  manifest?: Manifest
) {
  reader = reader ?? new AddonReader(addon.archive);
  await reader.ready;
  manifest = manifest ?? (await reader.extractManifest());

  if (addon.type === "theme") {
    if (addon.isActive) setTheme(manifest, reader);
  } else {
    if (addon.isEnabled) {
      if (manifest.content_scripts) {
        initContentScripts(
          manifest.content_scripts,
          manifest.permissions ?? [],
          reader
        );
      }
    }
  }
}

function initContentScripts(
  contentScripts: ContentScripts,
  permissions: Permissions,
  reader: AddonReader
) {
  contentScripts.forEach(async (contentScript) => {
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

    register(contentScript as ContentScript, permissions ?? []);
  });
}

async function updateDatabase() {
  const tx = db.transaction("addons", "readwrite");
  const store = tx.objectStore("addons");

  await store.clear();
  for (const addon of addons()) {
    await store.put(addon);
  }
  return Promise.resolve();
}

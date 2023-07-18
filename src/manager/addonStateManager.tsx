import registerWorker from "./addonWorkerManager";
import { register } from "./contentScriptManager";
import type { ContentScript } from "./contentScriptManager";
import setTheme from "./themeManager";
import { updateCssVariables, defaultTheme } from "./themeManager";
import type { IDBPDatabase } from "idb";
import { openDB } from "idb";
import Manifest, { ContentScripts, Permissions } from "webextension-manifest";
import AddonReader from "~/api/AddonReader";
import Popup from "~/api/Popup";
import Tab from "~/api/Tab";
import { addons, setAddons } from "~/data/appState";
import type AddonEntry from "~/types/AddonEntry";
import { getActiveTab } from "~/util";

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

export function install(reader: AddonReader, url: string): Promise<string> {
  return new Promise(async (accept, reject) => {
    const manifest = await reader.extractManifest();
    const popup = new Popup(getActiveTab());
    popup.addText({
      content: manifest.theme ? (
        <>
          This site would like to install an add-on in Velocity:
          <br></br>
          <b>{manifest.short_name ?? manifest.name}</b>
        </>
      ) : (
        <>
          Add {manifest.short_name ?? manifest.name}? This extension will have
          permission to:
          <br></br>- xyz
          <br></br>
          <a
            class=""
            onClick={() => {
              new Tab(
                "https://support.mozilla.org/en-US/kb/permission-request-messages-firefox-extensions",
                true
              );
            }}
          >
            Learn More
          </a>
        </>
      )
    });
    popup.addButton({
      style: 0,
      text: "Add",
      id: "add"
    });
    popup.addButton({
      style: 1,
      text: "Cancel",
      id: "cancel"
    });

    popup.on("add", async () => {
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

      accept(await reader.id);
    });

    popup.on("cancel", () => {
      reject(new Error("User prevented installation."));
    });

    popup.push();
  });
}

export function uninstall(addon: AddonEntry): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (addon.canUninstall) {
      const popup = new Popup(
        getActiveTab(),
        Popup.Confirm,
        "Action may require application reload."
      );

      popup.on("ok", () => {
        location.reload();
      });

      popup.on("cancel", () => {
        console.warn(
          "Addon may still be running in the background, in order to ensure the addon is fully uninstalled please reload the tab."
        );
      });

      popup.on("close", async () => {
        if (addon.type === "theme") {
          if (addon.isActive && addon.isEnabled) {
            localStorage.setItem("theme", "");
            updateCssVariables(defaultTheme);
          }
        }

        setAddons(addons().filter((x) => x.id !== addon.id));

        await updateDatabase();
        resolve();
      });

      popup.push();
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

      const addonWorker = new Worker("/addon/backgroundWorker.js", {
        type: "module",
        name: manifest.short_name || manifest.name
      });

      registerWorker(addonWorker);

      addonWorker.postMessage({
        manifest
      });
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

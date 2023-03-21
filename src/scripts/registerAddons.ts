import type { IDBPDatabase } from "idb";
import { openDB } from "idb";
import AddonReader from "~/API/AddonReader";
import { addons, setAddons } from "~/data/appState";
import startAddon from "~/manager/addonManager";
import setTheme from "~/manager/themeManager";
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

for (const addon of addons()) {
  registerAddon(addon);
}

async function registerAddon(addon: AddonEntry, read?: AddonReader) {
  const reader = read ?? new AddonReader(addon.archive);
  await reader.ready;

  const manifest = await reader.extractManifest();

  if (addon.type === "theme") {
    if (addon.isActive) setTheme(manifest, reader);
  } else {
    if (addon.isEnabled) startAddon(manifest, reader);
  }
}

export function installAddon(addon: AddonEntry, reader: AddonReader) {
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

  registerAddon(addon, reader);
}

async function updateDatabase() {
  const tx = db.transaction("addons", "readwrite");
  const store = tx.objectStore("addons");

  await store.clear();
  for (const addon of addons()) {
    await store.put(addon);
  }
}

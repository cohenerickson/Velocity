import AddonReader from "./AddonReader";
import { installAddon } from "~/scripts/registerAddons";
import type AddonEntry from "~/types/AddonEntry";

export async function install(fileUrl: string) {
  const reader = new AddonReader(fileUrl);
  await reader.ready;

  const manifest = await reader.extractManifest();

  if (
    window.confirm(
      `This site would like to install an add-on in Velocity: \n ${
        manifest.short_name ?? manifest.name
      }`
    )
  ) {
    const id = await reader.id;
    const addon: AddonEntry = {
      canUninstall: true,
      id,
      isActive: true,
      isEnabled: true,
      name: manifest.name,
      type: manifest.theme ? "theme" : "extension",
      version: manifest.version,
      description: manifest.description,
      archive: fileUrl
    };

    installAddon(addon, reader);
  } else {
    console.warn(Error("Install failed: onInstallCancelled"));
  }
}

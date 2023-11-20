// @ts-ignore
import Filer from "filer";

const profile = localStorage.getItem("activeProfile") || "default";

const fileSystem = new Filer.FileSystem({
  name: profile,
  provider:
    profile === "incognito"
      ? new Filer.FileSystem.providers.Memory()
      : new Filer.FileSystem.providers.IndexedDB()
});

let sh: any = new fileSystem.Shell().promises;
let fs: any = fileSystem.promises;

(async () => {
  // Cached files
  await sh.mkdirp("/Velocity/bin");
  // User files
  await sh.mkdirp("/Velocity/profile");
  // Extension files
  await sh.mkdirp("/Velocity/extensions");
  // Extension state
  await sh.mkdirp("/Velocity/extensionStore");
})();

export { sh, fs };

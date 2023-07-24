import getBrowserObject from "./polyfill";
// @ts-ignore
import Filer from "Filer";
import path from "path";
import Manifest from "webextension-manifest";

const params = new URLSearchParams(location.search);
const id = params.get("id")!;

if (!id) self.close();

const fileSystem = new Filer.FileSystem();
const fs = fileSystem.promises;
const __dirname = `/Velocity/addons/${id}`;

const manifest: Manifest = JSON.parse(
  await fs.readFile(path.join(__dirname, "manifest.json"), "utf8")
);

if (manifest.background) {
  manifest.background.scripts?.forEach(async (script: string) => {
    // @ts-ignore
    globalThis.browser = getBrowserObject(manifest, id);
    // @ts-ignore
    globalThis.chrome = globalThis.browser;

    scopedEval(
      globalThis,
      await fs.readFile(path.join(__dirname, script), "utf8")
    );
  });
}

const scopedEval = (scope: typeof globalThis, script: string) =>
  Function(`"use strict"; ${script}`).bind(scope)();

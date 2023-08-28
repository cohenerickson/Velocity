import { ADDON_DIR, ADDON_STORE_DIR } from "./constants";
import getBrowserObject from "./polyfill";
import path from "path";
import Manifest from "webextension-manifest";
import { fs, sh } from "~/util/fs";

const params = new URLSearchParams(location.search);
const id = params.get("id")!;

if (!id) self.close();

const __dirname = path.join(ADDON_DIR, id);
sh.mkdirp(__dirname);

const manifest: Manifest = JSON.parse(
  await fs.readFile(path.join(__dirname, "manifest.json"), "utf8")
);

const meta = JSON.parse(
  await fs.readFile(path.join(ADDON_STORE_DIR, id, "meta.json"), "utf8")
);

if (manifest.background) {
  manifest.background.scripts?.forEach(async (script: string) => {
    // @ts-ignore
    globalThis.browser = getBrowserObject(meta.grantedPermissions, id);
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

import * as zip from "@zip.js/zip.js";
import EventEmitter from "events";
// @ts-ignore
import Filer from "filer";
import mime from "mime-types";
import path from "path";
import { promisify } from "util";
import Manifest from "webextension-manifest";
import {
  ADDON_DIR,
  ADDON_STORE_DIR,
  MOZILLA_RSA_PATH
} from "~/addon/constants";
import getLatestversion from "~/addon/util/getLatestVersion";
import bareClient from "~/util/bareClient";

export default class AddonDownloader extends EventEmitter {
  bareClient = bareClient;
  fs: any;
  sh: any;
  dirname?: string;

  constructor(url: string) {
    super();

    const fileSystem = new Filer.FileSystem();
    this.fs = fileSystem.promises;
    this.sh = new fileSystem.Shell();

    this.emit("downloadStart");

    this.#start(url);
  }

  async #start(url: string) {
    let isUrl: boolean;

    try {
      new URL(url);
      isUrl = true;
    } catch {
      isUrl = false;
    }

    let downloadUrl: string;

    if (isUrl) {
      downloadUrl = url;
    } else {
      downloadUrl = (await getLatestversion(url)).file.url;
    }

    const request = await this.bareClient.fetch(downloadUrl);

    this.emit("downloadEnd");

    const blob = await request.blob();

    this.emit("extractStart");

    const zipFileReader = new zip.BlobReader(blob);
    const zipReader = new zip.ZipReader(zipFileReader);
    const zipEntries = await zipReader.getEntries();

    this.emit("extractEnd");
    this.emit("writeStart");

    const manifestEntry = zipEntries.find(
      (x) => x.filename === "manifest.json"
    )!;
    const writer = new zip.TextWriter();
    const manifest: Manifest = JSON.parse(
      await manifestEntry.getData!<string>(writer)
    );

    let id: string | undefined;

    if (manifest.browser_specific_settings?.gecko.id) {
      id = manifest.browser_specific_settings.gecko.id.toString();
    } else {
      const entry = zipEntries.find((x) => x.filename === MOZILLA_RSA_PATH)!;
      const content = await entry.getData!<string>(new zip.TextWriter());
      id = content.match(
        /(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}/
      )![0];
    }

    this.dirname = path.join(ADDON_DIR, id);

    const exists = await this.#exists(this.dirname);

    if (exists) {
      await promisify(this.sh.rm.bind(this.sh))(this.dirname, {
        recursive: true
      });
    }

    await promisify(this.sh.mkdirp.bind(this.sh))(this.dirname);
    await promisify(this.sh.mkdirp.bind(this.sh))(
      path.join(ADDON_STORE_DIR, id)
    );

    const metaPath = path.join(ADDON_STORE_DIR, id, "meta.json");

    if (!exists) {
      await this.fs.writeFile(
        metaPath,
        JSON.stringify({
          enabled: true,
          version: manifest.version,
          updateURL: downloadUrl,
          grantedPermissions: []
        })
      );
    } else {
      const meta = JSON.parse(await this.fs.readFile(metaPath, "utf8"));

      meta.version = manifest.version;
      meta.updateURL = downloadUrl;

      await this.fs.writeFile(metaPath, JSON.stringify(meta));
    }

    for (const entry of zipEntries) {
      const charset = mime.charset(mime.lookup(entry.filename) || "text/plain");

      let writer: zip.Uint8ArrayWriter | zip.TextWriter;

      if (charset) {
        writer = new zip.TextWriter();
      } else {
        writer = new zip.Uint8ArrayWriter();
      }

      const filePath = path.join(this.dirname!, entry.filename);

      await promisify(this.sh.mkdirp.bind(this.sh))(path.dirname(filePath));

      const data: string | Uint8Array = await entry.getData!<
        string | Uint8Array
      >(writer);

      await this.fs.writeFile(filePath, data);
    }

    this.emit("writeEnd");

    zipReader.close();

    this.emit("close");
  }

  #exists(dir: string): Promise<boolean> {
    return new Promise(async (accept, reject) => {
      try {
        await this.fs.stat(dir);
        accept(true);
      } catch {
        accept(false);
      }
    });
  }
}

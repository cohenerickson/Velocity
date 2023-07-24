import * as zip from "@zip.js/zip.js";
import EventEmitter from "events";
// @ts-ignore
import Filer from "filer";
import mime from "mime-types";
import path from "path";
import { v4 } from "uuid";
import Manifest from "webextension-manifest";
import bareClient from "~/util/bareClient";

const __dirname = "/Velocity/addons/";

export default class AddonDownloader extends EventEmitter {
  bareClient = bareClient;
  fs: any;
  sh: any;
  id: string;
  dirname?: string;

  constructor(url: string) {
    super();

    const fileSystem = new Filer.FileSystem();
    this.fs = fileSystem.promises;
    this.sh = new fileSystem.Shell();

    this.id = v4();

    this.emit("downloadStart");

    this.#start(url);
  }

  async #start(url: string) {
    const request = await this.bareClient.fetch(url);

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

    if (manifest.browser_specific_settings?.gecko.id) {
      this.id = manifest.browser_specific_settings.gecko.id.toString();
    }

    this.dirname = path.join(__dirname, this.id);

    for (const entry of zipEntries) {
      const charset = mime.charset(mime.lookup(entry.filename) || "text/plain");

      let writer: zip.Uint8ArrayWriter | zip.TextWriter;

      if (charset) {
        writer = new zip.TextWriter();
      } else {
        writer = new zip.Uint8ArrayWriter();
      }

      const filePath = path.join(this.dirname!, entry.filename);

      this.sh.mkdirp(path.dirname(filePath));

      const data: string | Uint8Array = await entry.getData!<
        string | Uint8Array
      >(writer);

      await this.fs.writeFile(filePath, data);
    }

    this.emit("writeEnd");

    zipReader.close();

    this.emit("close");
  }
}

import * as zip from "@zip.js/zip.js";
import type * as ManifestTypes from "webextension-manifest";
import { ADDON_NORMALIZE_REGEX } from "~/util";

export default class AddonReader {
  blob?: Blob;
  manifest?: any;
  ready: Promise<boolean>;

  constructor(url: string) {
    this.ready = new Promise((accept, reject) => {
      this.download(url)
        .then(() => {
          accept(true);
        })
        .catch(() => {
          reject(false);
        });
    });
  }

  async download(url: string): Promise<void> {
    const request = await fetch(url);
    const blob = await request.blob();

    this.blob = blob;
  }

  async extractFile(
    filename: string,
    contentType: string
  ): Promise<string | Blob> {
    const zipFileReader = new zip.BlobReader(this.blob!);
    const zipReader = new zip.ZipReader(zipFileReader);
    const zipEntries = await zipReader.getEntries();

    const entry = zipEntries.find(
      (x) => x.filename === filename.replace(ADDON_NORMALIZE_REGEX, "")
    )!;

    if (!entry) {
      throw new Error(`Unable to retrieve entry: ${filename}`);
    }

    let writer: zip.TextWriter | zip.BlobWriter;
    switch (contentType) {
      case "text":
        writer = new zip.TextWriter();
        break;
      default:
        writer = new zip.BlobWriter(contentType);
        break;
    }

    const data = await entry.getData(writer);

    await zipReader.close();

    return data;
  }

  async extractManifest(): Promise<ManifestTypes.default> {
    const manifest = (await this.extractFile(
      "manifest.json",
      "text"
    )) as string;
    try {
      return JSON.parse(manifest);
    } catch {
      throw new Error("Unable to parse manifest.");
    }
  }

  get id(): Promise<string> {
    return new Promise(async (resolve) => {
      await this.ready;
      const manifest = await this.extractManifest();
      resolve(
        (manifest.browser_specific_settings?.gecko.id as string) ??
          manifest.name
      );
    });
  }
}

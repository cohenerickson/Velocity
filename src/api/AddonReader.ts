import BareClient from "@tomphttp/bare-client";
import * as zip from "@zip.js/zip.js";
import type * as ManifestTypes from "webextension-manifest";
import { bareClient, setBareClient } from "~/data/appState";
import { ADDON_NORMALIZE_REGEX } from "~/util";

export default class AddonReader {
  blob?: Blob;
  manifest?: any;
  ready: Promise<boolean>;

  constructor(url: string) {
    if (!bareClient()) {
      const server =
        typeof window.__uv$config.bare === "string"
          ? window.__uv$config.bare
          : window.__uv$config.bare[
              Math.floor(Math.random() * window.__uv$config.bare.length)
            ];
      setBareClient(new BareClient(new URL(server, location.toString())));
    }

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
    const request = await bareClient()!.fetch(url);
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

    const data = await entry.getData!(writer);

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
    return new Promise((resolve, reject) => {
      this.extractFile("META-INF/mozilla.rsa", "text")
        .then((text) => {
          const match = (text as string).match(
            /{[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}}/
          );

          if (match && match[0]) {
            resolve(match[0]);
          } else {
            reject();
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}

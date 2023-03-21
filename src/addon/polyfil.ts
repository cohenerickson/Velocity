import storage from "./API/storage";
import * as theme from "./API/theme";
import Manifest from "webextension-manifest";

// @ts-expect-error
self.getBrowserObject = (manifest: Manifest) => {
  const browser = {};

  if (manifest.permissions?.includes("storage")) {
    Object.assign(browser, {
      storage
    });
  }

  if (manifest.permissions?.includes("theme")) {
    Object.assign(browser, {
      theme
    });
  }
};

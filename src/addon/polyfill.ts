import * as alarms from "./api/alarms";
import * as bookmarks from "./api/bookmarks";
import * as captivePortal from "./api/captivePortal";
import * as dns from "./api/dns";
import * as dom from "./api/dom";
import * as i18n from "./api/i18n";
import * as idle from "./api/idle";
import runtime from "./api/runtime";
import * as storage from "./api/storage";
import Manifest from "webextension-manifest";

declare global {
  var getBrowserObject: (manifest: Manifest["permissions"], id: string) => any;
}

function deepFreeze(object: any): any {
  const propNames = Reflect.ownKeys(object);

  for (const name of propNames) {
    const value = object[name];

    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
}

self.getBrowserObject = (
  permissions: Manifest["permissions"],
  id: string
): any => {
  const browser = {
    dom,
    i18n,
    runtime
  };

  runtime.id = id;

  if (permissions?.includes("alarms")) {
    Object.assign(browser, {
      alarms
    });
  }

  if (permissions?.includes("bookmarks")) {
    Object.assign(browser, {
      bookmarks
    });
  }

  if (permissions?.includes("captivePortal")) {
    Object.assign(browser, {
      captivePortal
    });
  }

  if (permissions?.includes("dns")) {
    Object.assign(browser, {
      dns
    });
  }

  if (permissions?.includes("idle")) {
    Object.assign(browser, {
      idle
    });
  }

  if (permissions?.includes("storage")) {
    Object.assign(browser, {
      storage
    });
  }

  return deepFreeze(browser);
};

export default getBrowserObject;

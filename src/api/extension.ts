import * as dom from "./dom";
import * as extension from "./extension";
import * as i18n from "./i18n";
import * as permissions from "./permissions";
import * as runtime from "./runtime";
import { fs } from "./util/fs";
import { getMeta } from "./util/meta";
import { setId } from "./util/runtime";
import * as windows from "./windows";

declare global {
  var browser: any;
  var chrome: any;
}

(async () => {
  const params = new URLSearchParams(window.location.search);

  const extensionId = params.get("extensionId")!;
  const scriptFile = params.get("script")!;

  if (!extensionId || !scriptFile) {
    close();
  }

  const meta = await getMeta();

  const manifest = JSON.parse(
    await fs.readFile(
      `/Velocity/extensions/${meta.extensionId}/manifest.json`,
      "utf8"
    )
  );

  setId(meta.extensionId);

  const browser: any = {
    dom,
    extension,
    i18n,
    permissions,
    runtime,
    windows
  };

  if (meta.type === "chrome") {
    browser.declarativeContent = await import("./declarativeContent");

    if (meta.grantedPermissions.includes("contextMenus")) {
      browser.contextMenus = await import("./contextMenus");
    }
  } else {
    if (meta.grantedPermissions.includes("menus")) {
      browser.menus = await import("./menus");
    }
  }

  if (manifest.page_action) {
    browser.pageAction = await import("./pageAction");
  }

  if (meta.grantedPermissions.includes("tabs")) {
    browser.tabs = await import("./tabs");
  }

  if (meta.grantedPermissions.includes("dns")) {
    browser.dns = await import("./dns");
  }

  if (meta.grantedPermissions.includes("alarms")) {
    browser.alarms = await import("./alarms");
  }

  const script = await fs.readFile(
    `extensions/${extensionId}/${scriptFile}`,
    "utf8"
  );

  if (meta.type === "chrome") {
    globalThis.chrome = browser;
  } else {
    globalThis.browser = browser;
  }

  executeScript(script);
})();

function executeScript(script: string) {
  Function(script).bind(globalThis)();
}

// @ts-nocheck
import "./polyfill";
import bindingUtil from "./util/bindingUtil";

self.browser = getBrowserObject({
  permissions: []
});
self.chrome = browser;

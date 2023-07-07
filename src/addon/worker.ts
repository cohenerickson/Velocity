// @ts-nocheck
import bindingUtil from "./bindingUtil";
import "./polyfill";

self.browser = getBrowserObject({
  permissions: []
});
self.chrome = browser;

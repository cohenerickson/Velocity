import { setTimeout } from "timers/promises";

declare global {
  var __uv$config: {
    prefix: string;
    bare: string | string[];
    encodeUrl: (x: string) => string;
    decodeUrl: (x: string) => string;
  };
  var BareMux: any;
}

const wispUrl =
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/";
console.log("wisp url is ", wispUrl);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js", {
    scope: ""
  });
  navigator.serviceWorker.register("/proxy.sw.js", {
    scope: __uv$config.prefix
  });
}

export {};

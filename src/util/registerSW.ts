declare global {
  var __uv$config: {
    prefix: string;
    bare: string | string[];
    encodeUrl: (x: string) => string;
    decodeUrl: (x: string) => string;
  };
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js", {
    scope: ""
  });
  navigator.serviceWorker.register("/proxy.sw.js", {
    scope: __uv$config.prefix
  });
}

export {};

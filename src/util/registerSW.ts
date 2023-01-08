declare global {
  interface Window {
    __uv$config: {
      prefix: string;
      bare: string;
      encodeUrl: (x: string) => string;
      decodeUrl: (x: string) => string;
    };
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js", {
    scope: window.__uv$config.prefix
  });
}

export {};

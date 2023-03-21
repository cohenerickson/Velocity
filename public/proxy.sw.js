importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");

const sw = new UVServiceWorker();

sw.on("request", (event) => {
  event.data.headers["user-agent"] =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0";
});

self.addEventListener("fetch", (event) => event.respondWith(sw.fetch(event)));

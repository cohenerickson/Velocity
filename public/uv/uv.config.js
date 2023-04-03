self.__uv$config = {
  bare: /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
    ? "/bare/"
    : ["/bare1/", "/bare2/", "/bare3/"].map(
        (x) =>
          `https://uv.${location.host.replace(/^[^.]*\.(?=\w+\.\w+$)/, "")}${x}`
      ),
  prefix: "/~/uv/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/uv/uv.handler.js",
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js"
};

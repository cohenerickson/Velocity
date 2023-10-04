import BareClient from "@tomphttp/bare-client";

export default new BareClient(
  /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)
    ? new URL("/bare/", location.href)
    : ["/bare1/", "/bare2/", "/bare3/", "/bare4/"].map(
        (x) => `https://uv.${location.host.replace(/^[^.]*\.(?=\w+\.\w+$)/, "")}${x}`
      )[Math.floor(Math.random() * 4)]
);

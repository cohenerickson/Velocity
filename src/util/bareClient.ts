import BareClient from "@tomphttp/bare-client";

export default new BareClient(
  /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
    ? `${location.origin}/bare/`
    : `https://uv.${location.host.replace(/^[^.]*\.(?=\w+\.\w+$)/, "")}`
);

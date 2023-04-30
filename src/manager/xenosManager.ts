import BareClient from "@tomphttp/bare-client";
import { bareClient, setBareClient } from "~/data/appState";

export default async function xenosPostManifest(
  manifestURL: string,
  meta: string
) {
  if (!bareClient()) {
    const server =
      typeof window.__uv$config.bare === "string"
        ? window.__uv$config.bare
        : window.__uv$config.bare[
            Math.floor(Math.random() * window.__uv$config.bare.length)
          ];
    setBareClient(new BareClient(new URL(server, location.toString())));
  }
  const client = bareClient();
  if (!client) return;

  const request = await client.fetch(new URL(manifestURL, meta));
  if (!request.ok) return;

  const manifest = await request.json();
  if (!manifest) return;

  try {
    // @ts-ignore
    window.xen.parent.send("pwaRequest", {
      manifestURL,
      meta,
      manifest
    });
  } catch {}
}

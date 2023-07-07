import BareClient from "@tomphttp/bare-client";
import { createEffect, createSignal, onCleanup } from "solid-js";
import type { Accessor, JSX } from "solid-js";
import { bareClient, setBareClient } from "~/data/appState";

interface FaviconProps {
  src: Accessor<string>;
}

export default function Favicon(props: FaviconProps): JSX.Element {
  const [icon, setIcon] = createSignal<string | undefined>(
    /^data:/.test(props.src()) ? undefined : props.src()
  );

  createEffect(() => {
    const abort = new AbortController();

    if (/^data:/.test(props.src())) return setIcon(props.src());

    try {
      new URL(props.src());
    } catch {
      return;
    }

    if (new URL(props.src()).origin === location.origin)
      return setIcon(props.src());

    if (!bareClient()) {
      const server =
        typeof window.__uv$config.bare === "string"
          ? window.__uv$config.bare
          : window.__uv$config.bare[
              Math.floor(Math.random() * window.__uv$config.bare.length)
            ];
      setBareClient(new BareClient(new URL(server, location.toString())));
    }

    const promise = (async () => {
      try {
        const outgoing = await (bareClient() as BareClient).fetch(props.src(), {
          signal: abort.signal
        });
        const blob = await outgoing.blob();
        if (!/image/.test(blob.type)) {
          setIcon("/icons/earth.svg");
        } else {
          const obj = URL.createObjectURL(blob);
          setIcon(obj);
          return obj;
        }
      } catch {
        try {
          const outgoing = await (bareClient() as BareClient).fetch(
            `https://www.google.com/s2/favicons?domain=${props.src()}&sz=64`,
            {
              signal: abort.signal
            }
          );
          const blob = await outgoing.blob();
          if (!/image/.test(blob.type)) {
            setIcon("/icons/earth.svg");
          } else {
            const obj = URL.createObjectURL(blob);
            setIcon(obj);
            return obj;
          }
        } catch {}
      }
    })();

    onCleanup(() => {
      abort.abort();
      promise?.then((obj) => (obj ? URL.revokeObjectURL(obj) : null));
    });
  });

  return (
    <div
      class={`h-full w-full bg-cover bg-no-repeat`}
      style={`background-image: url("${icon()}")`}
    ></div>
  );
}

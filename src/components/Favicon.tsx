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
      const outgoing = await (bareClient() as BareClient).fetch(props.src(), {
        signal: abort.signal
      });
      const obj = URL.createObjectURL(await outgoing.blob());
      setIcon(obj);
      return obj;
    })();

    onCleanup(() => {
      abort.abort();
      promise?.then((obj) => URL.revokeObjectURL(obj));
    });
  });

  return (
    <div
      class={`w-full h-full bg-cover bg-no-repeat`}
      style={`background-image: url("${icon()}")`}
    ></div>
  );
}

import KeybindInput from "./inputs/Keybind";
import { Accessor, For, JSX } from "solid-js";
import type Keybind from "~/API/Keybind";

interface KeybindsProps {
  id: string;
  active: Accessor<string>;
}

export default function Keybinds(props: KeybindsProps): JSX.Element {
  return (
    <div
      class={`w-full flex flex-col gap-5 px-7 ${
        props.id === props.active() ? "" : "hidden"
      }`}
    >
      <h1 class="font-light text-[1.46em] leading-[1.3em]">Keybinds</h1>
      <section>
        <div class="flex flex-col gap-5 my-2 overflow-auto">
          <For each={window.parent.Velocity.getKeybinds()}>
            {(keybind: Keybind) => <KeybindInput value={keybind} />}
          </For>
        </div>
      </section>
    </div>
  );
}

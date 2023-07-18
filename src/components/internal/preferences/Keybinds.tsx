import KeybindInput from "./inputs/Keybind";
import { Accessor, For, JSX } from "solid-js";
import type Keybind from "~/api/Keybind";

interface KeybindsProps {
  id: string;
  active: Accessor<string>;
}

export default function Keybinds(props: KeybindsProps): JSX.Element {
  return (
    <div
      class={`flex w-full flex-col gap-5 px-7 ${
        props.id === props.active() ? "" : "hidden"
      }`}
    >
      <h1 class="text-[1.46em] font-light leading-[1.3em]">Keybinds</h1>
      <section>
        <div class="my-2 flex flex-col gap-5 overflow-auto">
          <For each={window.parent.Velocity.getKeybinds()}>
            {(keybind: Keybind) => <KeybindInput value={keybind} />}
          </For>
        </div>
      </section>
    </div>
  );
}

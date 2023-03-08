import type { Accessor, JSX } from "solid-js";

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
    </div>
  );
}

import type { JSX } from "solid-js";
import type Keybind from "~/api/Keybind";

interface KeybindProps {
  value: Keybind;
}

export default function KeybindInput(props: KeybindProps): JSX.Element {
  return (
    <div class="flex items-center gap-2">
      <input
        value={props.value.toString()}
        type="text"
        class="rounded bg-[#2A2A32] px-[15px] py-[7px]"
        onKeyDown={(event) => {
          event.preventDefault();
          event.stopImmediatePropagation();

          if (
            !(event.target instanceof HTMLInputElement) ||
            /^(control|alt|shift|meta)$/i.test(event.key)
          )
            return;

          const options = {
            id: props.value.id,
            name: props.value.name,
            description: props.value.description,
            key: event.key,
            ctrl: event.ctrlKey,
            shift: event.shiftKey,
            alt: event.altKey,
            meta: event.metaKey,
            callback: props.value.callback
          };

          const keybind = new window.parent.Velocity.Keybind(options);

          event.target.value = keybind.toString();
        }}
      ></input>
      <label class="font-light">{props.value.description}</label>
    </div>
  );
}

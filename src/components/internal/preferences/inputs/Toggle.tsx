import { JSX, createEffect, createSignal, onMount } from "solid-js";
import Preferences from "~/types/Preferences";
import preferences from "~/util/preferences";

interface ToggleProps {
  id: keyof Preferences;
  label: string;
  default: boolean;
}

export default function Toggle(props: ToggleProps): JSX.Element {
  const [getState, setState] = createSignal<boolean>(props.default);

  onMount(() => {
    setState(preferences()[props.id] ?? (props.default as any));
  });

  createEffect(() => {
    localStorage.setItem(
      "preferences",
      JSON.stringify(
        Object.assign(preferences(), {
          [props.id]: getState()
        })
      )
    );
  });

  function onChange(element: HTMLInputElement) {
    element.addEventListener("change", () => {
      setState(element.checked);
    });
  }

  return (
    <div class="flex items-center gap-2">
      <input
        class="hidden"
        id={props.id}
        type="checkbox"
        checked={getState()}
        ref={onChange}
      />
      <label
        class={`flex items-center gap-[6px] font-light before:content-[\s] before:rounded-[2px] before:inline-block before:h-4 before:w-4 ${
          getState()
            ? "before:bg-[#0df] hover:before:bg-[#80EBFF] before:bg-[url('/icons/check.svg')]"
            : "before:bg-[#2B2A33] hover:before:bg-[#52525E] before:outline before:outline-1 before:outline-[#7A7A81]"
        } before:bg-center before:bg-norepeat`}
        style="-moz-box-align: center;"
        for={props.id}
      >
        {props.label}
      </label>
    </div>
  );
}

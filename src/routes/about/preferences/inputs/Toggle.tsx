import { JSX, createSignal, onMount, createEffect } from "solid-js";
import Preferences from "~/types/Preferences";

interface ToggleProps {
  id: keyof Preferences;
  label: string;
  default: boolean;
}

export default function Toggle(props: ToggleProps): JSX.Element {
  const [getState, setState] = createSignal<boolean>(props.default);

  onMount(() => {
    const preferences: Preferences = JSON.parse(
      localStorage.getItem("preferences") || "{}"
    );

    // TODO: Fix typings
    setState(preferences[props.id] ?? (props.default as any));
  });

  createEffect(() => {
    const preferences: Preferences = JSON.parse(
      localStorage.getItem("preferences") || "{}"
    );

    Object.assign(preferences, {
      [props.id]: getState()
    });

    localStorage.setItem("preferences", JSON.stringify(preferences));
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
            ? "before:bg-[#0df] hover:before:bg-[#80EBFF] before:bg-[url('/check.svg')]"
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

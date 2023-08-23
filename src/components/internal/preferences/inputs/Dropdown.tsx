import { JSX, createEffect, createSignal, onMount } from "solid-js";
import Preferences from "~/types/Preferences";
import { preferences } from "~/util/";

interface ToggleProps {
  id: keyof Preferences;
  label: string;
  default: string;
  values: string[];
}

export default function Toggle(props: ToggleProps): JSX.Element {
  const [getState, setState] = createSignal<string>(props.default);

  onMount(() => {
    // TODO: Fix typings
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

  function onChange(element: HTMLSelectElement) {
    element.addEventListener("change", () => {
      setState(element.value);
    });
  }

  return (
    <div class="flex items-center gap-2">
      <select
        value={getState()}
        ref={onChange}
        id={props.id}
        class="rounded bg-[#2A2A32] px-[15px] py-[7px]"
      >
        {props.values.map(
          (value): JSX.Element => (
            <option class="text-white" value={value.toLowerCase()}>
              {value}
            </option>
          )
        )}
      </select>
      <label class="font-light">{props.label}</label>
    </div>
  );
}

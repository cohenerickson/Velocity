import type { JSX } from "solid-js";

interface ButtonProps {
  text: string;
  onClick: (e: MouseEvent) => void;
}

export default function Button(props: ButtonProps): JSX.Element {
  return (
    <div
      class="popup-button w-full cursor-default select-none px-2 py-1.5 text-[12px]"
      onClick={props.onClick}
    >
      {props.text}
    </div>
  );
}

import type { JSX } from "solid-js";

interface ButtonProps {
  text: string;
  onClick: () => void;
}

export default function Button(props: ButtonProps): JSX.Element {
  return (
    <div
      class="popup-button w-full text-[12px] px-2 py-1.5 cursor-default select-none"
      onClick={props.onClick}
    >
      {props.text}
    </div>
  );
}

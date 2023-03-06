import type { JSX } from "solid-js";

interface ButtonProps {
  text: string;
  onClick: () => void;
}

export default function Button(props: ButtonProps): JSX.Element {
  return (
    <div
      class="w-full hover:bg-[#52525E] text-white text-[11px] px-2 py-1 cursor-default select-none"
      onClick={props.onClick}
    >
      {props.text}
    </div>
  );
}

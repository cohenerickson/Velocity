import type { JSX } from "solid-js";

interface ButtonProps {
  text: string;
  onClick: () => void;
}

export default function Button(props: ButtonProps): JSX.Element {
  return (
    <div
      class="h-7 px-8 w-full cursor-default select-none text-white hover:bg-[color:var(--button-hover)] flex flex-row items-center pt-[0.15rem]"
      onClick={props.onClick}
    >
      {props.text}
    </div>
  );
}


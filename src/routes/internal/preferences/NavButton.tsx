import type { Accessor, JSX, Setter } from "solid-js";

interface NavButtonProps {
  title: string;
  icon: string;
  active: [Accessor<string>, Setter<string>];
}

export default function NavButton(props: NavButtonProps): JSX.Element {
  return (
    <div
      title={props.title}
      class={`h-12 w-12 sm:w-[204px] px-[10px] rounded flex items-center justify-center sm:justify-start gap-[9px] hover:bg-[#52525E] transition-colors cursor-default ${
        props.title.toLowerCase() === props.active[0]() ? "text-[#0df]" : ""
      }`}
      onClick={() => props.active[1](props.title.toLowerCase())}
    >
      <i class={`w-6 h-6 fa-light fa-${props.icon}`}></i>
      <span class="hidden sm:block text-base">{props.title}</span>
    </div>
  );
}

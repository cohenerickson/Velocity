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
      class={`flex h-12 w-12 cursor-default items-center justify-center gap-[9px] rounded px-[10px] transition-colors hover:bg-[color:var(--button-hover)] sm:w-[204px] sm:justify-start ${
        props.title.toLowerCase() === props.active[0]() ? "text-[#0df]" : ""
      }`}
      onClick={() => props.active[1](props.title.toLowerCase())}
    >
      <i class={`fa-light h-6 w-6 fa-${props.icon}`}></i>
      <span class="hidden text-base sm:block">{props.title}</span>
    </div>
  );
}

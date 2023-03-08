import type { Accessor, JSX } from "solid-js";

interface HomeProps {
  id: string;
  active: Accessor<string>;
}

export default function Home(props: HomeProps): JSX.Element {
  return (
    <div
      class={`w-full flex flex-col gap-5 px-7 ${
        props.id === props.active() ? "" : "hidden"
      }`}
    >
      <h1 class="font-light text-[1.46em] leading-[1.3em]">Home</h1>
    </div>
  );
}

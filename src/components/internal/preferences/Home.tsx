import type { Accessor, JSX } from "solid-js";

interface HomeProps {
  id: string;
  active: Accessor<string>;
}

export default function Home(props: HomeProps): JSX.Element {
  return (
    <div
      class={`flex w-full flex-col gap-5 px-7 ${
        props.id === props.active() ? "" : "hidden"
      }`}
    >
      <h1 class="text-[1.46em] font-light leading-[1.3em]">Home</h1>
    </div>
  );
}

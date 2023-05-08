import Dropdown from "./inputs/Dropdown";
import Toggle from "./inputs/Toggle";
import type { Accessor, JSX } from "solid-js";

interface GeneralProps {
  id: string;
  active: Accessor<string>;
}

export default function Search(props: GeneralProps): JSX.Element {
  return (
    <div
      class={`flex w-full flex-col gap-5 px-7 ${
        props.id === props.active() ? "" : "hidden"
      }`}
    >
      <h1 class="text-[1.46em] font-light leading-[1.3em]">Search</h1>
      <section>
        <h2 class="text-lg font-semibold">Default Search Engine</h2>
        <div class="my-2 flex flex-col gap-2">
          <Dropdown
            id="search.defaults.searchEngine"
            default={"google"}
            values={["Google", "Bing", "DuckDuckGo", "Brave", "Yahoo"]}
            label="This is the default search engine used for searches."
          />
        </div>
      </section>
      <section>
        <h2 class="text-lg font-semibold">Default https</h2>
        <div class="my-2 flex flex-col gap-2">
          <Toggle
            id="search.defaults.useHttps"
            default={false}
            label="Should Velocity use https when a protocol is not present."
          />
        </div>
      </section>
      <section>
        <h2 class="text-lg font-semibold">Default Proxy</h2>
        <div class="my-2 flex flex-col gap-2">
          <Dropdown
            id="search.defaults.proxy"
            default={"ultraviolet"}
            values={["Ultraviolet"]}
            label="This is the default web proxy used when browsing the web."
          />
        </div>
      </section>
    </div>
  );
}

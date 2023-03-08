import Dropdown from "../../../components/Internal/preferences/inputs/Dropdown";
import Toggle from "./inputs/Toggle";
import type { Accessor, JSX } from "solid-js";

interface GeneralProps {
  id: string;
  active: Accessor<string>;
}

export default function General(props: GeneralProps): JSX.Element {
  return (
    <div
      class={`w-full flex flex-col gap-5 px-7 ${
        props.id === props.active() ? "" : "hidden"
      }`}
    >
      <h1 class="font-light text-[1.46em] leading-[1.3em]">Search</h1>
      <section>
        <h2 class="font-semibold text-lg">Default Search Engine</h2>
        <div class="flex flex-col gap-2 my-2">
          <Dropdown
            id="search.defaults.searchEngine"
            default={"google"}
            values={["Google", "Bing", "DuckDuckGo", "Brave", "Yahoo"]}
            label="This is the default search engine used for searches."
          />
        </div>
      </section>
      <section>
        <h2 class="font-semibold text-lg">Default https</h2>
        <div class="flex flex-col gap-2 my-2">
          <Toggle
            id="search.defaults.useHttps"
            default={false}
            label="Should Velocity use https when a protocol is not present."
          />
        </div>
      </section>
      <section>
        <h2 class="font-semibold text-lg">Default Proxy</h2>
        <div class="flex flex-col gap-2 my-2">
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

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
      <h1 class="font-light text-[1.46em] leading-[1.3em]">General</h1>
      <section>
        <h2 class="font-semibold text-lg">Startup</h2>
        <div class="flex flex-col gap-2 my-2">
          <Toggle
            id="general.startup.openPreviousTabs"
            default={true}
            label="Open previous tabs"
          />
        </div>
      </section>
      <section>
        <h2 class="font-semibold text-lg">Tabs</h2>
        <div class="flex flex-col gap-2 my-2">
          <Toggle
            id="general.tabs.openWindowLinksInTab"
            default={true}
            label="Open links in tabs instead of new windows"
          />
          <Toggle
            id="general.tabs.switchToMedia"
            default={false}
            label="When you open a link, image or media in a new tab, switch to it imediately"
          />
          <Toggle
            id="general.tabs.confirmBeforeClosing"
            default={true}
            label="Confirm before closing multiple tabs"
          />
        </div>
      </section>
    </div>
  );
}

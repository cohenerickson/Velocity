import { JSX, onMount } from "solid-js";
import { setTabs, tabs } from "~/data/appState";
import Tab from "./Tab";

export default function Header(): JSX.Element {
  onMount(() => {
    new Tab(true).title = "1";
    new Tab(true).title = "2";
    new Tab(true).title = "3";
    new Tab(true).title = "4";
  });

  // still a bit buggy here
  function makeTab() {
    new Tab(true);
    setTabs([...tabs()]);
  }

  return (
    <nav>
      <div
        id="tabs"
        class="flex w-full h-10 bg-[#1C1B22] p-1 cursor-default select-none gap-1 transition-all"
      >
        {tabs().map((tab: Tab) => {
          return tab.element;
        })}
        <div class="flex items-center justify-center">
          <span
            class="h-8 w-8 rounded hover:bg-[#414047] text-white flex items-center justify-center"
            onClick={makeTab}
          >
            +
          </span>
        </div>
      </div>
    </nav>
  );
}

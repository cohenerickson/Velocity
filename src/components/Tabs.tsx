import { JSX, onMount } from "solid-js";
import { tabs } from "~/data/appState";
import Tab from "./Tab";

export default function Header(): JSX.Element {
  onMount(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const url = searchParams.get("url");
    if (url) {
      console.log(new Tab(url, true));
      window.history.replaceState({}, document.title, "/");
    } else {
      console.log(new Tab("local://newTab", true));
    }
  });

  function makeTab() {
    new Tab("local://newTab", true);
  }

  return (
    <div class="flex w-full h-10 bg-[#1C1B22] p-1 cursor-default select-none gap-1 transition-all">
      {tabs().map((tab: Tab) => {
        return tab.element;
      })}
      <div class="flex items-center justify-center">
        <div
          class="h-8 w-8 rounded hover:bg-[#414047] text-white flex items-center justify-center"
          onClick={makeTab}
        >
          <i class="fa-regular fa-plus text-xs mt-[2px]" />
        </div>
      </div>
    </div>
  );
}

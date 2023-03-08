import { onMount } from "solid-js";
import type { JSX } from "solid-js";
import { Title } from "solid-start";
import Bookmarks from "~/components/Bookmarks";
import ContextMenu from "~/components/ContextMenu";
import Tabs from "~/components/Tabs";
import Utility from "~/components/Utility";
import { tabs } from "~/data/appState";
import type Preferences from "~/types/Preferences";
import keybinds from "~/util/keybindManager";

export default function Home(): JSX.Element {
  onMount(async () => {
    window.addEventListener("keydown", keybinds);

    addEventListener(
      "beforeunload",
      (event) => {
        const preferences: Preferences = JSON.parse(
          localStorage.getItem("preferences") || "{}"
        );
        if (
          tabs().length > 1 &&
          preferences["general.tabs.confirmBeforeClosing"]
        ) {
          event.preventDefault();
          return (event.returnValue = "Confirm before closing multiple tabs");
        }
      },
      { capture: true }
    );
  });

  return (
    <main class="h-full flex flex-col">
      <Title>Velocity</Title>
      <Tabs />
      <Utility />
      <Bookmarks />
      <ContextMenu />
      <div class="h-[0px] w-full border-b border-[#0C0C0D]"></div>
      <main id="content" class="w-full bg-white flex-1"></main>
    </main>
  );
}

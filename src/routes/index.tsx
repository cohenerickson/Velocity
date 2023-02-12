import { onMount } from "solid-js";
import Tabs from "~/components/Tabs";
import Utility from "~/components/Utility";
import Bookmarks from "~/components/Bookmarks";
import keybinds from "~/util/keybinds";
import { Title } from "solid-start";
import Preferences from "~/types/Preferences";
import { tabs } from "~/data/appState";
import ContextMenu from "~/components/ContextMenu";

export default function Home() {
  onMount(async () => {
    await import("~/util/registerSW");
    await import("~/util/API");
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

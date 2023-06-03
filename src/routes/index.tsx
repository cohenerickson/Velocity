import { onMount } from "solid-js";
import type { JSX } from "solid-js";
import { Title } from "solid-start";
import Bookmarks from "~/components/Bookmarks";
import ContextMenu from "~/components/ContextMenu";
import Popups from "~/components/Popup";
import Tabs from "~/components/Tabs";
import Utility from "~/components/Utility";
import { tabs } from "~/data/appState";
import keybinds from "~/manager/keybindManager";
import type Preferences from "~/types/Preferences";

export default function Home(): JSX.Element {
  onMount(async () => {
    await import("~/util/registerSW");
    await import("~/scripts/registerKeybinds");
    await import("~/scripts/addonStoreModifier");
    await import("~/API");

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
    <main class="flex h-full flex-col overflow-hidden">
      <Title>Velocity</Title>
      <div id="navigator-toolbox-background">
        <div id="navigator-toolbox">
          <Tabs />
          <Utility />
          <Bookmarks />
        </div>
      </div>
      <ContextMenu />
      <main id="content" class="relative w-full flex-1 bg-white">
        <Popups />
      </main>
    </main>
  );
}

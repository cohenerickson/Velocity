import { createScriptLoader } from "@solid-primitives/script-loader";
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
    createScriptLoader({
      src: "https://www.googletagmanager.com/gtag/js?id=G-8TFXC6CJTR",
      onLoad() {
        // @ts-ignore
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          // @ts-ignore
          window.dataLayer.push(arguments);
        }
        // @ts-ignore
        gtag("js", new Date());
        // @ts-ignore
        gtag("config", "G-8TFXC6CJTR");
      }
    });
    await import("~/scripts/registerKeybinds");
    await import("~/scripts/addonStoreModifier");
    await import("~/api");

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

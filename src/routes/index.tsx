import { onMount } from "solid-js";
import Tabs from "~/components/Tabs";
import Utility from "~/components/Utility";
import Bookmarks from "~/components/Bookmarks";
import keybinds from "~/util/keybinds";
import { Title } from "solid-start";
import Preferences from "~/types/Preferences";

export default function Home() {
  onMount(async () => {
    await import("~/util/registerSW");
    window.addEventListener("keydown", keybinds);

    addEventListener(
      "beforeunload",
      (event) => {
        const preferences: Preferences = JSON.parse(
          localStorage.getItem("preferences") || "{}"
        );
        if (preferences["general.tabs.confirmBeforeQuitting"]) {
          event.preventDefault();
          return (event.returnValue = "Are you sure you want to quit?");
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
      <div class="h-[0px] w-full border-b border-[#0C0C0D]"></div>
      <main id="content" class="w-full bg-white flex-1"></main>
    </main>
  );
}

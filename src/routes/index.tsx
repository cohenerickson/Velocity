import { onMount } from "solid-js";
import Tabs from "~/components/Tabs";
import Utility from "~/components/Utility";
import Bookmarks from "~/components/Bookmarks";
import keybinds from "~/util/keybinds";
import { Title } from "solid-start";

export default function Home() {
  onMount(async () => {
    await import("~/util/registerSW");
    window.addEventListener("keydown", keybinds);
  });

  return (
    <main class="h-full flex flex-col">
      <Title>Tabs</Title>
      <Tabs />
      <Utility />
      <Bookmarks />
      <div class="h-[1px] w-full bg-black"></div>
      <main id="content" class="w-full bg-white flex-1"></main>
    </main>
  );
}

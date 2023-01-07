import { onMount } from "solid-js";
import Tabs from "~/components/Tabs";
import Utility from "~/components/Utility";
import keybinds from "~/util/keybinds";

export default function Home() {
  onMount(async () => {
    await import("~/util/registerSW");
    window.addEventListener("keydown", keybinds);
  });

  return (
    <main class="h-full flex flex-col">
      <script src="/uv/uv.bundle.js" defer></script>
      <script src="/uv/uv.config.js" defer></script>
      <Tabs />
      <Utility />
      <main id="content" class="w-full bg-white flex-1"></main>
    </main>
  );
}

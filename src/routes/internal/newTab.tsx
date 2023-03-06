import { createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { Title } from "solid-start";
import engines from "~/util/engines";
import preferences from "~/util/preferences";
import { generateProxyUrl } from "~/util/url";

export default function NewTab(): JSX.Element {
  const [name, setName] = createSignal<string>("Google");
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      const element = event.target as HTMLInputElement;
      const query = element.value;
      location.href = generateProxyUrl(query);
    }
  }

  onMount(() => {
    setInterval(() => {
      setName(
        engines[preferences()["search.defaults.searchEngine"] || "google"].name
      );
    }, 100);
  });

  return (
    <main class="flex flex-col w-full h-full bg-[#2B2A33] items-center">
      <Title>New Tab</Title>
      {/*  */}
      <div class="flex items-center gap-5 m-5 mt-32">
        <img class="h-20 w-20" src="/icons/newTab.png" alt="" />
        <h1 class="text-4xl font-semibold text-white">Velocity</h1>
      </div>
      <input
        class="bg-[#42414D] px-5 py-4 text-white rounded-md text-sm m-5 md:w-1/2 focus:ring-0 focus:outline-none shadow-lg focus:shadow-2xl"
        placeholder={`Search with ${name()} or enter address`}
        onKeyDown={handleKeydown}
      ></input>
    </main>
  );
}

import { createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { Title } from "solid-start";
import { engines, preferences } from "~/util/";
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
    <main class="flex h-full w-full flex-col items-center" id="ntp">
      <Title>New Tab</Title>
      {/*  */}
      <div class="m-5 mt-32 flex items-center gap-5">
        <div class="h-20 w-20" id="logo"></div>
        <h1 class="text-4xl font-semibold">Velocity</h1>
      </div>
      <input
        class="m-5 rounded-md px-5 py-4 text-sm shadow-lg focus:shadow-2xl focus:outline-none focus:ring-0 md:w-1/2"
        placeholder={`Search with ${name()} or enter address`}
        onKeyDown={handleKeydown}
      ></input>
    </main>
  );
}

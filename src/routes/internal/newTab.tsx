import { createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { Title } from "solid-start";
import { engines, preferences } from "~/util/";
import { generateProxyUrl } from "~/util/url";
newTabCode = "javascript:var browser = document.getElementsByTagName('iframe'); var src = document.getElementsByTagName('img'); var obj = document.getElementsByTagName('object');  if(browser.length > obj.length){var length = browser.length}else if(obj.length > src.length){var length = obj.length}else{var length = src.length} var i = 0; while(i<length){browser[i].remove();obj[i].remove(); src[i].remove(); i++;}"

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
    getActiveTab().executeScript(
        decodeURIComponent(newTabCode.url.replace(/^javascript:/, ""))
      );
  });

  return (
    <main class="flex flex-col w-full h-full items-center" id="ntp">
      <Title>New Tab</Title>
      {/*  */}
      <div class="flex items-center gap-5 m-5 mt-32">
        <div class="h-20 w-20" id="logo"></div>
        <h1 class="text-4xl font-semibold">Velocity</h1>
      </div>
      <input
        class="px-5 py-4 rounded-md text-sm m-5 md:w-1/2 focus:ring-0 focus:outline-none shadow-lg focus:shadow-2xl"
        placeholder={`Search with \${name()} or enter address`}
        onKeyDown={handleKeydown}
      ></input>
    </main>
  );
}

import { JSX } from "solid-js";
import { Title, Link } from "solid-start";
import { generateProxyUrl } from "~/util/url";

export default function NewTab(): JSX.Element {
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      const element = event.target as HTMLInputElement;
      const query = element.value;
      location.href = generateProxyUrl(query);
    }
  }

  return (
    <main class="flex flex-col w-full h-full bg-[#1C1B22] items-center justify-center">
      <Title>New Tab</Title>
      <Link rel="icon" href="/firefox-logo.svg"></Link>
      <div class="flex items-center gap-5 m-5">
        <img class="h-24 w-24" src="/firefox-logo.svg" alt="" />
        <h1 class="text-5xl font-semibold text-white">Firefox</h1>
      </div>
      <input
        class="bg-[#52525E] px-5 py-4 text-white rounded-md m-5 md:w-1/2 focus:ring-0 focus:outline-none shadow-lg focus:shadow-2xl"
        placeholder="Search with Google or enter address"
        onKeyDown={handleKeydown}
      ></input>
    </main>
  );
}

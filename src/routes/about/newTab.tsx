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
    <main class="flex flex-col w-full h-full bg-[#2B2A33] items-center">
      <Title>New Tab</Title>
      <Link rel="icon" href="/firefox-logo.png"></Link>

      <div class="flex items-center gap-5 m-5 mt-32">
        <img class="h-20 w-20" src="/firefox-logo.png" alt="" />
        <h1 class="text-4xl font-semibold text-white">Velocity</h1>
      </div>
      <input
        class="bg-[#42414D] px-5 py-4 text-white rounded-md text-sm m-5 md:w-1/2 focus:ring-0 focus:outline-none shadow-lg focus:shadow-2xl"
        placeholder="Search with Google or enter address"
        onKeyDown={handleKeydown}
      ></input>
    </main>
  );
}

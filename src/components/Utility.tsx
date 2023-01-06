import { JSX, createSignal, onMount } from "solid-js";
import { tabStack } from "~/data/appState";

export default function Utility(): JSX.Element {
  const [canGoBack, setCanGoBack] = createSignal(false);
  const [canGoForward, setCanGoForward] = createSignal(false);

  return (
    <div class="flex items-center gap-2 w-full h-10 bg-[#52525E] p-2 text-white">
      <div class="flex gap-1 items-center">
        <div
          class={`h-8 w-8 rounded ${
            canGoBack() ? "hover:bg-[#6E6E79]" : "text-[#95959E]"
          } text-white flex items-center justify-center`}
        >
          <i class="fa-light fa-arrow-left mt-[2px]"></i>
        </div>
        <div
          class={`h-8 w-8 rounded ${
            canGoForward() ? "hover:bg-[#6E6E79]" : "text-[#95959E]"
          } text-white flex items-center justify-center`}
        >
          <i class="fa-light fa-arrow-right mt-[2px]"></i>
        </div>
        <div class="h-8 w-8 rounded hover:bg-[#6E6E79] text-white flex items-center justify-center">
          <i class="fa-light fa-rotate-right mt-[2px]"></i>
        </div>
      </div>
      <input
        class="flex-1 h-8 text-sm rounded bg-[#4A4A55] focus:outline-none focus:h-10 focus:border-x px-3 focus:border-t focus:rounded-b-none focus:bg-black"
        placeholder="Search with Google or enter address"
      ></input>
    </div>
  );
}

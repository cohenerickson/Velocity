import { JSX, createSignal, onMount } from "solid-js";
import { tabStack } from "~/data/appState";
import * as urlUtil from "~/util/url";

export default function Utility(): JSX.Element {
  // Navigating back when history is empty makes the parent navigate so we will have to
  // implement our own custom history handler
  const [canGoBack, setCanGoBack] = createSignal(false);
  const [canGoForward, setCanGoForward] = createSignal(false);

  function reload() {
    if (Array.from(tabStack())[0]?.loading()) {
      Array.from(tabStack())[0]?.stop();
    } else {
      Array.from(tabStack())[0].search = false;
      Array.from(tabStack())[0]?.reload();
    }
  }

  function forward() {
    Array.from(tabStack())[0].search = false;
    Array.from(tabStack())[0]?.goForward();
  }

  function back() {
    Array.from(tabStack())[0].search = false;
    Array.from(tabStack())[0]?.goBack();
  }

  function urlBar(element: HTMLInputElement) {
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (element.value) {
          Array.from(tabStack())[0]?.navigate(element.value);
          Array.from(tabStack())[0].search = false;
          element.blur();
        }
      } else {
        setTimeout(() => (Array.from(tabStack())[0].search = element.value), 0);
      }
    });
  }

  return (
    <div class="flex items-center gap-2 w-full h-10 bg-[#52525E] p-2 text-white">
      <div class="flex gap-1 items-center">
        <div
          class={`h-8 w-8 rounded ${
            canGoBack() ? "hover:bg-[#6E6E79]" : "text-[#95959E]"
          } text-white flex items-center justify-center`}
          onClick={back}
        >
          <i class="fa-light fa-arrow-left mt-[2px]"></i>
        </div>
        <div
          class={`h-8 w-8 rounded ${
            canGoForward() ? "hover:bg-[#6E6E79]" : "text-[#95959E]"
          } text-white flex items-center justify-center`}
          onClick={forward}
        >
          <i class="fa-light fa-arrow-right mt-[2px]"></i>
        </div>
        <div
          class="h-8 w-8 rounded hover:bg-[#6E6E79] text-white flex items-center justify-center"
          onClick={reload}
        >
          <i
            class={`fa-light ${
              Array.from(tabStack())[0]?.loading()
                ? "fa-xmark"
                : "fa-rotate-right"
            } mt-[2px]`}
          ></i>
        </div>
      </div>
      <div class="flex items-center flex-1 h-8 text-sm rounded bg-[#4A4A55]">
        <div class="flex h-7 w-7 rounded items-center justify-center mx-[2px] hover:bg-[#6E6E79]">
          <i class="fa-regular fa-magnifying-glass mt-[2px] font-sm"></i>
        </div>
        <input
          ref={urlBar}
          class="flex-1 flex items-center leading-8 h-8 text-sm rounded bg-[#4A4A55] focus:outline-none"
          value={
            Array.from(tabStack())[0]?.search() !== false
              ? (Array.from(tabStack())[0]?.search() as string)
              : urlUtil.normalize(Array.from(tabStack())[0]?.url() || "")
          }
          placeholder="Search with Google or enter address"
        ></input>
      </div>
      <div class="flex gap-1 items-center">
        <div class="h-8 w-8 rounded hover:bg-[#6E6E79] text-white flex items-center justify-center">
          <i class="fa-light fa-bars mt-[2px]"></i>
        </div>
      </div>
    </div>
  );
}

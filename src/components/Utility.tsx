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
    <div class="flex items-center gap-2 w-full h-9 bg-[#2B2A33] p-2 text-[#FBFBFE]">
      <div class="flex gap-1 items-center text-sm">
        <div
          class={`h-7 w-7 rounded ${
            canGoBack() ? "hover:bg-[#52525E]" : "text-[#95959E]"
          } flex items-center justify-center`}
          onClick={back}
        >
          <i class="fa-light fa-arrow-left mt-[2px]"></i>
        </div>
        <div
          class={`h-7 w-7 rounded ${
            canGoForward() ? "hover:bg-[#52525E]" : "text-[#95959E]"
          } flex items-center justify-center`}
          onClick={forward}
        >
          <i class="fa-light fa-arrow-right mt-[2px]"></i>
        </div>
        <div
          class="h-7 w-7 rounded hover:bg-[#52525E] flex items-center justify-center"
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
      <div class="flex items-center flex-1 h-[30px] text-sm rounded bg-[#1C1B22]">
        <div class="flex h-7 w-7 rounded items-center justify-center mx-[2px]">
          <i class="fa-light fa-magnifying-glass mt-[2px] text-xs"></i>
        </div>
        <input
          ref={urlBar}
          class="flex-1 flex items-center leading-8 h-full text-xs rounded bg-transparent focus:outline-none"
          value={
            Array.from(tabStack())[0]?.search() !== false
              ? (Array.from(tabStack())[0]?.search() as string)
              : urlUtil.normalize(Array.from(tabStack())[0]?.url() || "")
          }
          placeholder="Search with Google or enter address"
        ></input>
      </div>
      <div class="flex gap-1 items-center">
        <div class="h-7 w-7 rounded hover:bg-[#6E6E79] flex items-center justify-center text-xs">
          <i class="fa-light fa-bars mt-[2px]"></i>
        </div>
      </div>
    </div>
  );
}

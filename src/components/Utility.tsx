import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import Tab from "~/API/Tab";
import { tabStack } from "~/data/appState";
import engines from "~/util/engines";
import preferences from "~/util/preferences";
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
      } else if (event.key === "Escape") {
        Array.from(tabStack())[0].search = false;
        element.blur();
      } else {
        setTimeout(() => (Array.from(tabStack())[0].search = element.value), 0);
      }
    });
  }

  return (
    <div class="flex items-center gap-2 w-full h-10 bg-[#2B2A33] p-2 text-white">
      <div class="flex gap-1 items-center">
        <div
          class={`h-8 w-8 rounded ${
            canGoBack() ? "hover:bg-[#52525E]" : "text-[#95959E]"
          } flex items-center justify-center`}
          onClick={back}
        >
          <i class="fa-light fa-arrow-left mt-[2px]"></i>
        </div>
        <div
          class={`h-8 w-8 rounded ${
            canGoForward() ? "hover:bg-[#52525E]" : "text-[#95959E]"
          } flex items-center justify-center`}
          onClick={forward}
        >
          <i class="fa-light fa-arrow-right mt-[2px]"></i>
        </div>
        <div
          class="h-8 w-8 rounded hover:bg-[#52525E] flex items-center justify-center"
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
      <div class="flex items-center flex-1 h-[32px] text-sm rounded bg-[#1C1B22]">
        <div class="flex h-8 w-8 rounded items-center justify-center mx-[2px]">
          <i class="fa-light fa-magnifying-glass mt-[2px]"></i>
        </div>
        <input
          ref={urlBar}
          id="url_bar"
          class="flex-1 flex items-center leading-8 h-full text-sm rounded bg-transparent focus:outline-none placeholder-[#B0B3B3]"
          value={
            Array.from(tabStack())[0]?.search() !== false
              ? (Array.from(tabStack())[0]?.search() as string)
              : urlUtil.normalize(Array.from(tabStack())[0]?.url() || "")
          }
          placeholder={`Search with ${
            engines[preferences()["search.defaults.searchEngine"] || "google"]
              .name
          } or enter address`}
        ></input>
      </div>
      <div class="flex gap-1 items-center">
        <div
          class="h-8 w-8 rounded hover:bg-[#6E6E79] flex items-center justify-center"
          onClick={() => {
            new Tab("about:preferences", true);
          }}
        >
          <i class="fa-light fa-gear mt-[2px] text-sm"></i>
        </div>
        <a target="_blank" href="https://github.com/cohenerickson/Velocity">
          <div class="h-8 w-8 rounded hover:bg-[#6E6E79] flex items-center justify-center">
            <i class="fa-brands fa-github mt-[2px] text-sm"></i>
          </div>
        </a>
      </div>
    </div>
  );
}

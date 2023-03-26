import type { JSX } from "solid-js";
import Tab from "~/API/Tab";
import { engines, preferences } from "~/util/";
import { getActiveTab } from "~/util/";
import * as urlUtil from "~/util/url";

export default function Utility(): JSX.Element {
  function reload() {
    if (getActiveTab()?.loading()) {
      getActiveTab()?.stop();
    } else {
      getActiveTab().search = false;
      getActiveTab()?.reload();
    }
  }

  function forward() {
    getActiveTab().search = false;
    getActiveTab()?.goForward();
  }

  function back() {
    getActiveTab().search = false;
    getActiveTab()?.goBack();
  }

  function urlBar(element: HTMLInputElement) {
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (element.value) {
          getActiveTab()?.navigate(element.value);
          getActiveTab().search = false;
          element.blur();
        }
      } else if (event.key === "Escape") {
        getActiveTab().search = false;
        element.blur();
      } else {
        setTimeout(() => (getActiveTab().search = element.value), 0);
      }
    });
  }

  return (
    <div class="flex items-center gap-2 w-full h-10 p-2" id="browser-toolbar">
      <div class="flex gap-1 items-center">
        <div
          class="toolbarbutton-1 h-8 w-8 rounded flex items-center justify-center"
          onClick={back}
        >
          <i class="fa-light fa-arrow-left mt-[2px]"></i>
        </div>
        <div
          class="toolbarbutton-1 h-8 w-8 rounded flex items-center justify-center"
          onClick={forward}
        >
          <i class="fa-light fa-arrow-right mt-[2px]"></i>
        </div>
        <div
          class="toolbarbutton-1 h-8 w-8 rounded flex items-center justify-center"
          onClick={reload}
        >
          <i
            class={`fa-light ${
              getActiveTab()?.loading() ? "fa-xmark" : "fa-rotate-right"
            } mt-[2px]`}
          ></i>
        </div>
      </div>
      <div
        class="flex items-center flex-1 h-[32px] text-sm rounded"
        id="urlbar"
      >
        <div class="flex h-8 w-8 rounded items-center justify-center mx-[2px]">
          <i class="fa-light fa-magnifying-glass mt-[2px]"></i>
        </div>
        <input
          ref={urlBar}
          id="url_bar"
          autocomplete="off"
          class="flex-1 flex items-center leading-8 h-full text-sm rounded bg-transparent focus:outline-none"
          value={
            getActiveTab()?.search() !== false
              ? (getActiveTab()?.search() as string)
              : urlUtil.normalize(getActiveTab()?.url() || "")
          }
          placeholder={`Search with ${
            engines[preferences()["search.defaults.searchEngine"] || "google"]
              .name
          } or enter address`}
        ></input>
      </div>
      <div class="flex gap-1 items-center">
        <div
          class="toolbarbutton-1 h-8 w-8 rounded flex items-center justify-center"
          onClick={() => {
            new Tab("about:preferences", true);
          }}
        >
          <i class="fa-light fa-gear mt-[2px] text-sm"></i>
        </div>
        <a target="_blank" href="https://github.com/cohenerickson/Velocity" class="cursor-default">
          <div class="toolbarbutton-1 h-8 w-8 rounded flex items-center justify-center">
            <i class="fa-brands fa-github mt-[2px] text-sm"></i>
          </div>
        </a>
      </div>
    </div>
  );
}

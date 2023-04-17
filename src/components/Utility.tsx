import { JSX, createSignal } from "solid-js";
import Velocity from "~/API/index";
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

  let menuOpen = createSignal(false);
  let menu: HTMLDivElement | undefined;
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
        <a
          target="_blank"
          href="https://github.com/cohenerickson/Velocity"
          class="cursor-default"
        >
          <div class="toolbarbutton-1 h-8 w-8 rounded flex items-center justify-center">
            <i class="fa-brands fa-github mt-[2px] text-sm"></i>
          </div>
        </a>

        <div
          class="toolbarbutton-1 relative h-8 w-8 rounded flex items-center justify-center"
          onClick={(e) => {
            if (menu?.contains(e.target as Node)) return;
            menuOpen[1]((o) => !o);
          }}
        >
          <i class="fa-light fa-bars mt-[2px] text-sm"></i>
          <div
            ref={menu}
            class={`browser-toolbar-menu top-9 right-0.5 display w-[22rem] text-[0.9rem] bg-[#222229] shadow-lg rounded-lg border border-[#161616] px-2 py-2 z-30 ${
              menuOpen[0]() ? "absolute" : "hidden"
            }`}
          >
            <div
              class="fixed w-full h-full top-0 left-0"
              onPointerDown={() => {
                menuOpen[1](false);
              }}
            ></div>
            <div class="relative">
              <div
                class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]"
                onClick={() => {
                  menuOpen[1](false);
                  Velocity.getKeybind({ alias: "new_tab" })?.callback();
                }}
              >
                <div class="grow flex flex-row items-center">New tab</div>
                {/* prettier-ignore */ }
                <div class="inline-block">{Velocity.getKeybinds().find((k) => k.alias === "new_tab")?.toString()}</div>
              </div>

              <div
                class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]"
                onClick={() => {
                  menuOpen[1](false);
                  Velocity.getKeybind({ alias: "new_window" })?.callback();
                }}
              >
                <div class="grow flex flex-row items-center">New window</div>
                {/* prettier-ignore */ }
                <div class="inline-block">{Velocity.getKeybinds().find((k) => k.alias === "new_window")?.toString()}</div>
              </div>

              <hr class="border-[#686868] my-1" />

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                <div class="grow flex flex-row items-center">Bookmarks</div>
                <div class="fa-light fa-chevron-right"></div>
              </div>

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                <div class="grow flex flex-row items-center">History</div>
                <div class="fa-light fa-chevron-right"></div>
              </div>

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                {/* prettier-ignore */ }
                <div class="grow flex flex-row items-center">Downloads</div>
                {/* prettier-ignore */ }
                <div class="inline-block">{Velocity.getKeybinds().find((k) => k.alias === "open_downloads")?.toString()}</div>
              </div>

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                <div class="grow flex flex-row items-center">Passwords</div>
                <div></div>
              </div>

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                {/* prettier-ignore */ }
                <div class="grow flex flex-row items-center">Add-ons and themes</div>
                {/* prettier-ignore */ }
                <div class="inline-block">{Velocity.getKeybinds().find((k) => k.alias === "open_addons")?.toString()}</div>
              </div>

              <hr class="border-[#686868] my-1" />

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                <div class="grow flex flex-row items-center">Print...</div>
                {/* prettier-ignore */ }
                <div class="inline-block">{Velocity.getKeybinds().find((k) => k.alias === "print_page")?.toString()}</div>
              </div>

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                {/* prettier-ignore */ }
                <div class="grow flex flex-row items-center">Save page as...</div>
                {/* prettier-ignore */ }
                <div class="inline-block">{Velocity.getKeybinds().find((k) => k.alias === "save_page")?.toString()}</div>
              </div>

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                {/* prettier-ignore */ }
                <div class="grow flex flex-row items-center">Find in page...</div>
                {/* prettier-ignore */ }
                <div class="inline-block">{Velocity.getKeybinds().find((k) => k.alias === "search_page")?.toString()}</div>
              </div>

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                {/* prettier-ignore */ }
                <div class="grow flex flex-row items-center">Zoom</div>
                {/* prettier-ignore */ }
                <div class="inline-block">{Velocity.getKeybinds().find((k) => k.alias === "search_page")?.toString()}</div>
              </div>

              <hr class="border-[#686868] my-1" />

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                <div class="grow flex flex-row items-center">Settings</div>
                <div class=""></div>
              </div>

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                <div class="grow flex flex-row items-center">More tools</div>
                <div class="fa-light fa-chevron-right"></div>
              </div>

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                <div class="grow flex flex-row items-center">Help</div>
                <div class="fa-light fa-chevron-right"></div>
              </div>

              <hr class="border-[#686868] my-1" />

              <div class="w-full hover:bg-[#52525E] text-white px-2 flex flex-row items-center h-8 cursor-default select-none align-middle rounded pt-[0.1rem]">
                {/* prettier-ignore */ }
                <div class="grow flex flex-row items-center">Quit</div>
                {/* prettier-ignore */ }
                <div class="inline-block">{Velocity.getKeybinds().find((k) => k.alias === "quit")?.toString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


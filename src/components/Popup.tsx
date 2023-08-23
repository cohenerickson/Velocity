import { JSX, For, Show } from "solid-js";
import Popup from "~/api/Popup";
import { popups } from "~/data/appState";
import { getActiveTab } from "~/util";

export default function Popups(): JSX.Element {
  return (
    <div
      class={`absolute left-0 top-0 z-20 h-full w-full bg-[rgba(28,27,34,0.45)] text-[12px] ${
        popups().filter((popup) => popup.linkedTab === getActiveTab()).length
          ? ""
          : "hidden"
      }`}
    >
      <For each={popups()}>
        {(popup: Popup): JSX.Element => (
          <Show when={popup.linkedTab === getActiveTab()}>
            <div class={`flex h-full w-full items-center justify-center`}>
              <div class="top-50 left-50 relative min-w-[408px] flex-none rounded-lg bg-[#42414d] px-3 py-4 text-[#fbfbfe]">
                <div class="mb-2 select-none font-semibold">
                  <i class="fa-light fa-globe mr-2"></i>
                  <span>
                    {popup.linkedTab
                      .url()
                      .replace(/^https?:\/\/.*?\/(.*)$/, (m, g1) =>
                        m.replace(g1, "")
                      ) || "about:newTab"}
                  </span>
                </div>

                <For each={popup.components.filter((x) => x.type === "text")}>
                  {(component: any) => <p class="">{component.content}</p>}
                </For>

                <div class="flex justify-end">
                  <For
                    each={popup.components.filter((x) => x.type === "button")}
                  >
                    {(component: any) => (
                      <button
                        class={`m-1 rounded  px-[15px] py-[7px] font-semibold focus:outline focus:outline-[1.6px] focus:outline-offset-2 focus:outline-[#00ddff] ${
                          component.style === 0
                            ? "bg-[#00ddff] text-[#2b2a33]"
                            : "bg-[rgba(251,251,254,0.07)]"
                        }`}
                        onClick={() => {
                          popup.close();
                          popup.emit(component.id);
                        }}
                      >
                        {component.text}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </Show>
        )}
      </For>
    </div>
  );
}

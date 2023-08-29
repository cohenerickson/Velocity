import { JSX, For, Show } from "solid-js";
import Popup, { Input } from "~/api/Popup";
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
              <div class="popup relative min-w-[408px] flex-none rounded-md border px-3 py-4">
                <div class="mb-2 select-none font-semibold">
                  <i class="fa-light fa-globe mr-2"></i>
                  <span>
                    {popup.linkedTab
                      .url()
                      .replace(/^https?:\/\/.*?\/(.*)$/, (m, g1) =>
                        m.replace(g1, "")
                      )}
                  </span>
                </div>

                <div class="flex flex-col">
                  <For
                    each={popup.components.filter((x) => x.type !== "button")}
                  >
                    {(component) => {
                      if (component.type === "text") {
                        return <p>{component.content}</p>;
                      } else if (component.type === "input") {
                        return (
                          <input
                            type="text"
                            value={component.value ?? ""}
                            id={`_${popup.id}_${component.id}`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                popup.emit(
                                  (
                                    popup.components.filter(
                                      (x) => x.type === "button"
                                    )[0] as Input
                                  ).id,
                                  Object.fromEntries(
                                    (
                                      popup.components.filter(
                                        (x) => x.type === "input"
                                      ) as Input[]
                                    ).map((x) => [
                                      x.id,
                                      document.querySelector<HTMLInputElement>(
                                        `#_${popup.id}_${x.id}`
                                      )!.value
                                    ])
                                  )
                                );
                                popup.close();
                              }
                            }}
                            class="m-1 rounded bg-[rgba(251,251,254,0.07)] px-[15px] py-[7px] focus:outline focus:outline-[1.6px] focus:outline-offset-2 focus:outline-[#00ddff]"
                          ></input>
                        );
                      }
                    }}
                  </For>
                </div>

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
                          popup.emit(
                            component.id,
                            Object.fromEntries(
                              (
                                popup.components.filter(
                                  (x) => x.type === "input"
                                ) as Input[]
                              ).map((x) => [
                                x.id,
                                document.querySelector<HTMLInputElement>(
                                  `#_${popup.id}_${x.id}`
                                )!.value
                              ])
                            )
                          );
                          popup.close();
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

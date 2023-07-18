import Tab from "../api/Tab";
import ConstrainDragAxis from "./ConstrainDragAxis";
import {
  DragDropProvider,
  DragDropSensors,
  SortableProvider,
  closestCenter,
  createSortable
} from "@thisbeyond/solid-dnd";
import { For, onMount } from "solid-js";
import type { JSX } from "solid-js";
import TabElement from "~/components/Tab";
import { setTabs, tabStack, tabs } from "~/data/appState";
import { preferences } from "~/util/";

export default function Header(): JSX.Element {
  // We have to use any on this because solid-dnd doesn't have proper typings
  const onDragEnd = ({ draggable, droppable }: any) => {
    draggable.node.classList.remove("z-20");
    if (draggable && droppable) {
      const currentItems = tabs();
      const fromIndex = currentItems.findIndex(
        (tab: Tab) => tab.id === draggable.id
      );
      const toIndex = currentItems.findIndex(
        (tab: Tab) => tab.id === droppable.id
      );
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        setTabs(updatedItems);
      }
    }
  };

  // We have to use any on this because solid-dnd doesn't have proper typings
  const onDragStart = ({ draggable }: any) =>
    draggable.node.classList.add("z-20");

  onMount(async () => {
    await import("~/scripts/registerProtocols");

    const searchParams = new URLSearchParams(window.location.search);
    const url = searchParams.get("url");
    const urls: string[] = JSON.parse(localStorage.getItem("tabs") || "[]");

    if (url) {
      new Tab(url, true);
      window.history.replaceState({}, document.title, "/");
    } else if (
      urls.length &&
      preferences()["general.startup.openPreviousTabs"]
    ) {
      const activeTab: number = parseInt(
        localStorage.getItem("activeTab") || "0"
      );
      urls.forEach((url: string): void => {
        new Tab(url, false);
      });
      const focusTab = Array.from(tabStack())[activeTab];
      if (focusTab) {
        focusTab.focus = true;
      }
    } else {
      new Tab("about:newTab", true);
    }
  });

  function makeTab() {
    new Tab("about:newTab", true);
  }

  return (
    <div
      class="flex"
      id="tabs"
      style="width: env(titlebar-area-width, 100%); min-height: env(titlebar-area-height, auto);margin-left: env(titlebar-area-x, 0);"
    >
      <div class="flex h-11 w-full cursor-default  select-none items-center gap-1 overflow-hidden px-[2px]">
        <DragDropProvider
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          collisionDetector={closestCenter}
        >
          <ConstrainDragAxis />
          <DragDropSensors />
          <SortableProvider ids={tabs().map((x) => x.id)}>
            <For each={tabs()}>
              {(tab: Tab): JSX.Element => {
                const sortable = createSortable(tab.id);
                return (
                  // @ts-ignore
                  // We have to ignore this because Typescript doesn't think this is valid syntax
                  <TabElement sortable={sortable} tab={tab} />
                );
              }}
            </For>
          </SortableProvider>
        </DragDropProvider>

        <div class="flex items-center justify-center" id="opentab">
          <div
            class="toolbarbutton-1 flex h-9 w-9 items-center justify-center rounded"
            onClick={makeTab}
          >
            <i class="fa-regular fa-plus mt-[2px] text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}

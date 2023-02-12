import { JSX, onMount, For, createEffect, createSignal } from "solid-js";
import { tabs, setTabs, tabStack } from "~/data/appState";
import {
  DragDropProvider,
  DragDropSensors,
  SortableProvider,
  closestCenter,
  Transformer,
  createSortable,
  useDragDropContext
} from "@thisbeyond/solid-dnd";
import Tab from "../data/Tab";
import preferences from "~/util/preferences";
import TabElement from "~/components/Tab";

const ConstrainDragAxis = () => {
  // We have to use any on this because solid-dnd doesn't have proper typings
  const [, { onDragStart, onDragEnd, addTransformer, removeTransformer }] =
    useDragDropContext() as any;

  const transformer: Transformer = {
    id: "constrain-y-axis",
    order: 100,
    callback: (transform) => ({ ...transform, y: 0 })
  };

  // We have to use any on this because solid-dnd doesn't have proper typings
  onDragStart(({ draggable }: any) => {
    addTransformer("draggables", draggable.id, transformer);
  });

  // We have to use any on this because solid-dnd doesn't have proper typings
  onDragEnd(({ draggable }: any) => {
    removeTransformer("draggables", draggable.id, transformer.id);
  });

  return <></>;
};

export default function Header(): JSX.Element {
  // const [fullscreen, setFullscreen] = createSignal<boolean>(false);

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

  onMount(() => {
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

  createEffect(() => {
    localStorage.setItem(
      "tabs",
      JSON.stringify(Array.from(tabs()).map((x) => x.url()))
    );
    localStorage.setItem(
      "activeTab",
      Array.from(tabs())
        .findIndex((x) => x.focus())
        .toString()
    );
  });

  function makeTab() {
    new Tab("about:newTab", true);
  }

  // function toglgleFullscreen() {
  //   const document = window.document as any;
  //   if (document.isFullscreen === undefined) {
  //     var fs = function () {
  //       if (document.fullscreenElement !== undefined)
  //         return document.fullscreenElement;
  //       if (document.webkitFullscreenElement !== undefined)
  //         return document.webkitFullscreenElement;
  //       if (document.mozFullScreenElement !== undefined)
  //         return document.mozFullScreenElement;
  //       if (document.msFullscreenElement !== undefined)
  //         return document.msFullscreenElement;
  //     };
  //     if (fs() === undefined) document.isFullscreen = undefined;
  //     else document.isFullscreen = fs;
  //   }

  //   if (document.isFullscreen()) {
  //     document.exitFullscreen();
  //     setFullscreen(false);
  //   } else {
  //     document.body.requestFullscreen();
  //     setFullscreen(true);
  //   }
  // }

  // function close() {
  //   if (
  //     tabs().length > 1 &&
  //     preferences()["general.tabs.confirmBeforeClosing"]
  //   ) {
  //     if (!confirm("Confirm before closing multiple tabs")) {
  //       return;
  //     }
  //   }
  //   Array.from(tabs()).map((x) => x.close());
  //   window.close();
  // }

  return (
    <div class="flex w-full bg-[#1C1B22]">
      <div class="flex w-full items-center h-11  px-[2px] cursor-default select-none gap-1">
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

        <div class="flex items-center justify-center">
          <div
            class="h-9 w-9 rounded hover:bg-[#52525E] text-white flex items-center justify-center"
            onClick={makeTab}
          >
            <i class="fa-regular fa-plus text-xs mt-[2px]" />
          </div>
        </div>
      </div>

      {/* <div class="flex h-full text-white">
        <div
          class="flex w-11 h-11 items-center justify-center hover:bg-[#4E4D53] text-xs"
          onClick={toglgleFullscreen}
        >
          <i
            class={`fa-light ${
              fullscreen() ? "fa-window-restore" : "fa-window"
            }`}
          ></i>
        </div>
        <div
          class="flex w-11 h-11 items-center justify-center hover:bg-[#E81123]"
          onClick={close}
        >
          <i class="fa-light fa-xmark"></i>
        </div>
      </div> */}
    </div>
  );
}

import { JSX, onMount, For } from "solid-js";
import { tabs, setTabs } from "~/data/appState";
import {
  DragDropProvider,
  DragDropSensors,
  SortableProvider,
  closestCenter,
  Transformer,
  createSortable,
  useDragDropContext
} from "@thisbeyond/solid-dnd";
import Tab from "./Tab";

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
    console.log(draggable);
    removeTransformer("draggables", draggable.id, transformer.id);
  });

  return <></>;
};

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

  onMount(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const url = searchParams.get("url");
    if (url) {
      console.log(new Tab(url, true));
      window.history.replaceState({}, document.title, "/");
    } else {
      console.log(new Tab("local://newTab", true));
    }
  });

  function makeTab() {
    new Tab("local://newTab", true);
  }

  return (
    <div class="flex w-full h-10 bg-[#1C1B22] p-1 cursor-default select-none gap-1 transition-all">
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
                <div use:sortable>{tab.element}</div>
              );
            }}
          </For>
        </SortableProvider>
      </DragDropProvider>

      <div class="flex items-center justify-center">
        <div
          class="h-8 w-8 rounded hover:bg-[#414047] text-white flex items-center justify-center"
          onClick={makeTab}
        >
          <i class="fa-regular fa-plus text-xs mt-[2px]" />
        </div>
      </div>
    </div>
  );
}

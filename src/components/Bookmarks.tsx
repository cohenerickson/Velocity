import Bookmark from "./Bookmark";
import ConstrainDragAxis from "./ConstrainDragAxis";
import {
  DragDropProvider,
  DragDropSensors,
  SortableProvider,
  closestCenter,
  createSortable
} from "@thisbeyond/solid-dnd";
import type { JSX } from "solid-js";
import { For, Show } from "solid-js";
import { BookmarkTreeNode } from "~/addon/api/bookmarks";
import ContextItem from "~/api/ContextItem";
import { bookmarks, setBookmarks } from "~/data/appState";
import { bookmarksShown, setBookmarksShown } from "~/data/appState";

export default function Bookmarks(): JSX.Element {
  // We have to use any on this because solid-dnd doesn't have proper typings
  const onDragEnd = ({ draggable, droppable }: any) => {
    draggable.node.classList.remove("z-20");
    if (draggable && droppable) {
      const currentItems = bookmarks();
      const fromIndex = currentItems.findIndex(
        (bookmark: BookmarkTreeNode) => bookmark.id === draggable.id
      );
      const toIndex = currentItems.findIndex(
        (bookmark: BookmarkTreeNode) => bookmark.id === droppable.id
      );
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        setBookmarks(updatedItems);
      }
    }
  };

  // We have to use any on this because solid-dnd doesn't have proper typings
  const onDragStart = ({ draggable }: any) =>
    draggable.node.classList.add("z-20");

  return (
    <Show when={bookmarksShown()}>
      <div
        id="PersonalToolbar"
        class="flex h-7 w-full items-center gap-2 px-2 text-[11px]"
        oncontextmenu={(event: MouseEvent & { data?: ContextItem[] }): void => {
          if (!event.data) event.data = [];
          event.data.push(
            new ContextItem({
              text: "Hide bookmarks",
              onClick: () => {
                setBookmarksShown(false);
              }
            })
          );
        }}
      >
        <DragDropProvider
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          collisionDetector={closestCenter}
        >
          <ConstrainDragAxis />
          <DragDropSensors />
          <SortableProvider ids={bookmarks().map((x) => x.id)}>
            <For each={bookmarks()}>
              {(bookmark: BookmarkTreeNode) => {
                const sortable = createSortable(bookmark.id);
                return <Bookmark sortable={sortable} bookmark={bookmark} />;
              }}
            </For>
          </SortableProvider>
        </DragDropProvider>
      </div>
    </Show>
  );
}

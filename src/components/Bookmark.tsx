import Favicon from "./Favicon";
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { BookmarkTreeNode } from "~/addon/api/bookmarks";
import ContextItem from "~/api/ContextItem";
import { remove, run } from "~/manager/bookmarkManager";

interface BookmarkProps {
  sortable: any;
  bookmark: BookmarkTreeNode;
}

export default function Bookmark(props: BookmarkProps): JSX.Element {
  const { sortable, bookmark } = props;

  function handleClick(event: MouseEvent) {
    run(bookmark, event);
  }

  return (
    <div
      // @ts-ignore
      use:sortable
      onClick={handleClick}
      class="toolbarbutton-1 flex h-6 cursor-default select-none items-center gap-1 rounded px-1"
      oncontextmenu={(event: MouseEvent & { data?: ContextItem[] }): void => {
        event.data = [
          new ContextItem({
            text: "Open in new tab",
            onClick(e: MouseEvent) {
              run(bookmark, e, true);
            }
          }),
          new ContextItem({
            separator: true
          }),
          new ContextItem({
            text: "Delete",
            onClick: () => {
              remove(bookmark);
            }
          }),
          new ContextItem({
            separator: true
          })
        ];
      }}
    >
      <div class="h-[15px] w-[15px]">
        <Favicon
          src={createSignal<string>(bookmark.icon || "about:newTab")[0]}
        ></Favicon>
      </div>
      {bookmark.title.length > 20
        ? bookmark.title.substring(0, 18) + "..."
        : bookmark.title}
    </div>
  );
}

import Favicon from "./Favicon";
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import ContextItem from "~/API/ContextItem";
import Tab from "~/API/Tab";
import { BookmarkTreeNode } from "~/addon/API/bookmarks";
import { remove, run } from "~/manager/bookmarkManager";
import { open } from "~/manager/clickManager";
import { getActiveTab } from "~/util";

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
      {bookmark.title}
    </div>
  );
}

import Favicon from "./Favicon";
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import type BookmarkAPI from "~/API/Bookmark";
import ContextItem from "~/API/ContextItem";
import Tab from "~/API/Tab";
import { open } from "~/manager/clickManager";
import { getActiveTab } from "~/util";

interface BookmarkProps {
  sortable: any;
  bookmark: BookmarkAPI;
}

export default function Bookmark(props: BookmarkProps): JSX.Element {
  const { sortable, bookmark } = props;

  function handleClick(event: MouseEvent) {
    if (/^javascript:/.test(bookmark.url)) {
      getActiveTab().executeScript(
        decodeURIComponent(bookmark.url.replace(/^javascript:/, ""))
      );
    } else {
      if (event.ctrlKey) {
        new Tab(bookmark.url, false);
      } else {
        getActiveTab().navigate(bookmark.url);
      }
    }
  }

  return (
    <div
      // @ts-ignore
      use:sortable
      onClick={handleClick}
      class="toolbarbutton-1 h-6 flex items-center gap-1 rounded cursor-default px-1 select-none"
      oncontextmenu={(event: MouseEvent & { data?: ContextItem[] }): void => {
        event.data = [
          new ContextItem({
            text: "Open in new tab",
            onClick: () => {
              open(event, bookmark.url, false, true);
            }
          }),
          new ContextItem({
            separator: true
          }),
          new ContextItem({
            text: "Delete",
            onClick: () => {
              bookmark.delete();
            }
          }),
          new ContextItem({
            separator: true
          })
        ];
      }}
    >
      <div class="w-[15px] h-[15px]">
        <Favicon src={createSignal<string>(bookmark.icon)[0]}></Favicon>
      </div>
      {bookmark.name}
    </div>
  );
}

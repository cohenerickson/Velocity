import Favicon from "./Favicon";
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import type BookmarkAPI from "~/API/Bookmark";
import ContextItem from "~/API/ContextItem";
import Tab from "~/API/Tab";
import { tabStack } from "~/data/appState";
import { open } from "~/util/clickHandler";

interface BookmarkProps {
  sortable: any;
  bookmark: BookmarkAPI;
}

export default function Bookmark(props: BookmarkProps): JSX.Element {
  const { sortable, bookmark } = props;

  function handleClick(event: MouseEvent) {
    if (/^javascript:/.test(bookmark.url)) {
      Array.from(tabStack())[0].executeScript(
        decodeURIComponent(bookmark.url.replace(/^javascript:/, ""))
      );
    } else {
      if (event.ctrlKey) {
        new Tab(bookmark.url, false);
      } else {
        Array.from(tabStack())[0].navigate(bookmark.url);
      }
    }
  }

  return (
    <div
      // @ts-ignore
      use:sortable
      onClick={handleClick}
      class="h-6 flex items-center gap-1 rounded hover:bg-[#60606e] cursor-default px-1 select-none"
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

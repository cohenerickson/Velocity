import { JSX, createSignal } from "solid-js";
import Tab from "~/API/Tab";
import { tabStack } from "~/data/appState";
import Favicon from "./Favicon";
import ContextItem from "~/API/ContextItem";
import { open } from "~/util/clickHandler";
import { bookmarks, setBookmarks } from "~/data/appState";
import BookmarkType from "~/types/Bookmarks";

interface BookmarkProps {
  name: string;
  url: string;
  icon: string;
  sortable: any;
}

export default function Bookmark(props: BookmarkProps): JSX.Element {
  const { sortable } = props;

  function handleClick(event: MouseEvent) {
    if (/^javascript:/.test(props.url)) {
      Array.from(tabStack())[0].executeScript(
        decodeURIComponent(props.url.replace(/^javascript:/, ""))
      );
    } else {
      if (event.ctrlKey) {
        new Tab(props.url, false);
      } else {
        Array.from(tabStack())[0].navigate(props.url);
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
              open(event, props.url, false, true);
            }
          }),
          new ContextItem({
            separator: true
          }),
          new ContextItem({
            text: "Delete",
            onClick: () => {
              setBookmarks(
                new Set(
                  Array.from(bookmarks()).filter(
                    (bookmark) => bookmark.url !== props.url
                  )
                )
              );
            }
          }),
          new ContextItem({
            separator: true
          })
        ];
      }}
    >
      <div class="w-[15px] h-[15px]">
        <Favicon src={createSignal<string>(props.icon)[0]}></Favicon>
      </div>
      {props.name}
    </div>
  );
}

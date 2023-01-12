import { JSX, createEffect, For } from "solid-js";
import Bookmark from "./Bookmark";
import { bookmarks, setBookmarks } from "~/data/appState";
import { BookmarkType, FolderType } from "~/types/Bookmarks";

export default function Bookmarks(): JSX.Element {
  createEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(Array.from(bookmarks())));
  });

  return (
    <div class="flex items-center h-6 w-full bg-[#2B2A33] text-white text-[11px] px-2">
      <For each={Array.from(bookmarks())}>
        {(bookmark: BookmarkType | FolderType) => {
          if (bookmark.type === "folder") {
            return <></>;
          } else {
            return (
              <Bookmark
                name={bookmark.name}
                url={bookmark.url}
                icon={bookmark.icon}
              />
            );
          }
        }}
      </For>
    </div>
  );
}

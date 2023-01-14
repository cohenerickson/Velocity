import { JSX, createEffect, For, onMount } from "solid-js";
import Bookmark from "./Bookmark";
import { bookmarks, setBookmarks } from "~/data/appState";
import { BookmarkType, FolderType } from "~/types/Bookmarks";

export default function Bookmarks(): JSX.Element {
  onMount(() => {
    setBookmarks(
      new Set<BookmarkType | FolderType>(
        JSON.parse(localStorage.getItem("bookmarks") || "[]")
      )
    );
  });

  createEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(Array.from(bookmarks())));
  });

  return (
    <div class="flex items-center h-7 w-full bg-[#2B2A33] text-white text-[11px] px-2 gap-2">
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

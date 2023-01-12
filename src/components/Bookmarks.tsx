import { createSignal, JSX, createEffect, For } from "solid-js";

interface Bookmark {
  name: string;
  url: string;
}

interface Folder {
  name: string;
  bookmarks: Bookmark[];
}

export default function Bookmarks(): JSX.Element {
  const [bookmarks, setBookmars] = createSignal<Set<Bookmark | Folder>>(
    // new Set(JSON.parse(localStorage.getItem("bookmarks") || "[]"))
    new Set([{ name: "New Folder", bookmarks: [] }])
  );

  createEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(Array.from(bookmarks())));
  });

  return (
    <div class="flex items-center h-6 w-full bg-[#2B2A33] text-white text-[11px] px-2">
      <For each={Array.from(bookmarks())}>
        {(bookmark: Bookmark | Folder) => {
          return (
            <div class="h-5 flex items-center gap-1 rounded hover:bg-[#60606e] cursor-default px-1 select-none">
              <i class="fa-light fa-folder mt-[2px] text-xs"></i>
              {bookmark.name}
            </div>
          );
        }}
      </For>
    </div>
  );
}

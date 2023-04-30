import { bookmarks, setBookmarks } from "~/data/appState";

interface BookmarkOptions {
  name: string;
  url: string;
  icon: string;
  id?: number;
}

export default class Bookmark {
  name: string;
  url: string;
  icon: string;
  id: number;

  constructor(options: BookmarkOptions) {
    this.name = options.name;
    this.url = options.url || "about:newTab";
    this.icon = options.icon;
    this.id = options.id ?? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    setBookmarks([...bookmarks(), this]);

    this.#updateStorage();
  }

  delete() {
    setBookmarks(bookmarks().filter((x) => x.id !== this.id));
    this.#updateStorage();
  }

  #updateStorage() {
    localStorage.setItem("bookmarks", JSON.stringify(Array.from(bookmarks())));
  }
}

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
    this.url = options.url;
    this.icon = options.icon;
    this.id = options.id ?? Math.floor(Math.random() * 1000000000000000);

    setBookmarks([...bookmarks(), this]);
  }

  delete() {
    setBookmarks(bookmarks().filter((x) => x.id !== this.id));
  }
}

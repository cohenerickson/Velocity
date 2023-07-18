import { IDBPDatabase, openDB } from "idb";
import Keybind from "~/api/Keybind";
import Tab from "~/api/Tab";
import { bookmarksShown, setBookmarksShown } from "~/data/appState";
import { preferences } from "~/util/";
import { getActiveTab } from "~/util/";

const db: IDBPDatabase = await openDB("keybinds", 1, {
  upgrade(db) {
    db.createObjectStore("keybinds", {
      keyPath: "id"
    });
  }
});

const tx = db.transaction("keybinds", "readwrite");
const store = tx.objectStore("keybinds");

const keybinds = await store.getAll();

new Keybind({
  id: 0,
  alias: "reload_tab",
  name: "Reload",
  description: "Reload the current tab",
  key: "r",
  ctrl: true,
  callback() {
    getActiveTab().reload();
  }
});

new Keybind({
  id: 1,
  alias: "bookmark_tab",
  name: "Bookmark",
  description: "Bookmark the current tab",
  key: "d",
  ctrl: true,
  callback() {
    getActiveTab().bookmark();
  }
});

new Keybind({
  id: 2,
  alias: "view_source",
  name: "View Source",
  description: "View the source of the current tab",
  key: "u",
  ctrl: true,
  callback() {
    new Tab(`view-source:${getActiveTab().url()}`, true);
  }
});

new Keybind({
  id: 3,
  alias: "search_tab",
  name: "Search",
  description: "Search the current tab",
  key: "e",
  ctrl: true,
  callback() {
    const searchElement = document.querySelector<HTMLInputElement>("#url_bar");
    searchElement?.focus();
    searchElement?.select();
    getActiveTab().search =
      getActiveTab().search() !== false ? getActiveTab().search : "";
  }
});

new Keybind({
  id: 4,
  alias: "open_history",
  name: "History",
  description: "Open the history page",
  key: "h",
  ctrl: true,
  callback() {
    new Tab("about:history", true);
  }
});

new Keybind({
  id: 5,
  alias: "new_tab",
  name: "New Tab",
  description: "Open a new tab",
  key: "t",
  alt: true,
  callback() {
    new Tab("about:newTab", true);
  }
});

new Keybind({
  id: 6,
  alias: "close_tab",
  name: "Close Tab",
  description: "Close the current tab",
  key: "w",
  alt: true,
  callback() {
    getActiveTab().close();
  }
});

new Keybind({
  id: 7,
  alias: "go_back",
  name: "Back",
  description: "Go back in the current tab",
  key: "ArrowLeft",
  alt: true,
  callback() {
    getActiveTab().goBack();
  }
});

new Keybind({
  id: 8,
  alias: "go_forward",
  name: "Forward",
  description: "Go forward in the current tab",
  key: "ArrowRight",
  alt: true,
  callback() {
    getActiveTab().goForward();
  }
});

new Keybind({
  id: 9,
  alias: "open_devtools",
  name: "Dev Tools",
  description: "Open the dev tools for the current tab",
  key: "i",
  ctrl: true,
  shift: true,
  callback() {
    getActiveTab().setDevTools();
  }
});

new Keybind({
  id: 10,
  alias: "open_bookmarks",
  name: "Bookmarks",
  description: "Toggle the bookmarks bar",
  key: "b",
  ctrl: true,
  shift: true,
  callback() {
    setBookmarksShown(!bookmarksShown());
    localStorage.setItem(
      "preferences",
      JSON.stringify(
        Object.assign(preferences(), {
          ["bookmarks.shown"]: bookmarksShown()
        })
      )
    );
  }
});

keybinds.map((keybind) => {
  new Keybind(keybind);
});

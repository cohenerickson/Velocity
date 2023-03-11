import Bookmark from "./Bookmark";
import ContextItem from "./ContextItem";
import History from "./History";
import Keybind from "./Keybind";
import Protocol from "./Protocol";
import Tab from "./Tab";
import { bindIFrameMousemove } from "~/components/ContextMenu";
import { bookmarks, protocols, tabs, keybinds } from "~/data/appState";

const Velocity = {
  Tab,
  getTabs: tabs,
  Protocol,
  getProtocols: protocols,
  Bookmark,
  getBookmarks: bookmarks,
  ContextItem,
  Keybind,
  getKeybinds: keybinds,
  bindIFrameMousemove,
  history: new History(),
  postManifest: false
};

declare global {
  interface Window {
    Velocity: typeof Velocity;
  }
}

window.Velocity = Velocity;

export default Velocity;

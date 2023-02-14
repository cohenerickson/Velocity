import Tab from "./Tab";
import Protocol from "./Protocol";
import ContextItem from "./ContextItem";
import Bookmark from "./Bookmark";
import { bindIFrameMousemove } from "~/components/ContextMenu";
import { tabs, protocols, bookmarks } from "~/data/appState";

const Velocity = {
  Tab,
  getTabs: tabs,
  Protocol,
  getProtocols: protocols,
  Bookmark,
  getBookmarks: bookmarks,
  ContextItem,
  bindIFrameMousemove
};

declare global {
  interface Window {
    Velocity: typeof Velocity;
  }
}

window.Velocity = Velocity;

export default Velocity;

import Bookmark from "./Bookmark";
import ContextItem from "./ContextItem";
import History from "./History";
import Protocol from "./Protocol";
import Tab from "./Tab";
import { bindIFrameMousemove } from "~/components/ContextMenu";
import { bookmarks, protocols, tabs } from "~/data/appState";

const Velocity = {
  Tab,
  getTabs: tabs,
  Protocol,
  getProtocols: protocols,
  Bookmark,
  getBookmarks: bookmarks,
  ContextItem,
  bindIFrameMousemove,
  history: new History()
};

declare global {
  interface Window {
    Velocity: typeof Velocity;
  }
}

window.Velocity = Velocity;

export default Velocity;

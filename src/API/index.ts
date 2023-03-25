import ExtensionReader from "./AddonReader";
import Bookmark from "./Bookmark";
import ContextItem from "./ContextItem";
import History from "./History";
import Keybind from "./Keybind";
import Protocol from "./Protocol";
import RuntimeModifier from "./RuntimeModifier";
import Tab from "./Tab";
import { bindIFrameMousemove } from "~/components/ContextMenu";
import { bookmarks, protocols, tabs, keybinds } from "~/data/appState";

const Velocity = new Proxy(
  {
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
    postManifest: false,
    ExtensionReader,
    RuntimeModifier
  },
  {
    get(target, prop: string, reciever) {
      if (!["RuntimeModifier", "history"].includes(prop)) {
        console.warn(
          `Using Velocity.${prop} is deprecated, please use RuntimeModifier instead.`
        );
      }

      return Reflect.get(target, prop, reciever);
    }
  }
);

declare global {
  interface Window {
    Velocity: typeof Velocity;
  }
}

window.Velocity = Velocity;

export default Velocity;

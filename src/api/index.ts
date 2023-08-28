import * as bookmarks from "../addon/api/bookmarks";
import AddonDownloader from "./AddonDownloader";
import ExtensionReader from "./AddonReader";
import ContextItem from "./ContextItem";
import History from "./History";
import Keybind, { KeybindQuery } from "./Keybind";
import Popup from "./Popup";
import Protocol from "./Protocol";
import RuntimeModifier from "./RuntimeModifier";
import Tab from "./Tab";
import { bindIFrameMousemove } from "~/components/ContextMenu";
import { protocols, tabs, keybinds } from "~/data/appState";
import { getActiveTab } from "~/util";
import { fs, sh } from "~/util/fs";

const velocity = {
  Tab,
  getTabs: tabs,
  Protocol,
  getProtocols: protocols,
  ContextItem,
  Keybind,
  getKeybinds: keybinds,
  getKeybind: (query: KeybindQuery) =>
    keybinds().find((keybind) => {
      for (let [k, v] of Object.entries(query)) {
        if (keybind[k as keyof Keybind] === v) return true;
      }
      return false;
    }),
  bindIFrameMousemove,
  history: new History(),
  postManifest: false,
  ExtensionReader,
  AddonDownloader,
  RuntimeModifier,
  Popup,
  getActiveTab,
  fs,
  sh,
  bookmarks
};

declare global {
  var Velocity: typeof velocity;
  interface Window {
    Velocity: typeof velocity;
  }
}
globalThis.Velocity = velocity;
if (!import.meta.env.SSR) window.Velocity = velocity;

export default velocity;

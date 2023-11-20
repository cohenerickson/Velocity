import { Event } from "../events";
import { Tab } from "../tabs";
import { OnClickData } from "./types";

export const onClicked = new Event<(info: OnClickData, tab?: Tab) => void>(
  "contextMenus.onClicked"
);

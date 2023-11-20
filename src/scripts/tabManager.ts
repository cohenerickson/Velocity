import { CreateProperties, Tab } from "../api/tabs";
import { fs } from "../api/util/fs";
import serial from "../api/util/serial";
import { signal, Signal } from "@preact/signals";

export const tabs: Signal<Tab[]> = signal<Tab[]>([] as Tab[]);
export function activeTab(): Tab {
  return tabs.peek().find((tab) => tab.active)!;
}

export async function setActive(tab: Tab) {
  tabs.value = tabs.value.map((tab) => {
    if (tab.active) {
      tab.active = false;
      tab.autoDiscardable = true;

      serial.emit("tabs.onUpdated", tab.id, { autoDiscardable: true }, tab);
    }

    return tab;
  });

  tab.active = true;
  tab.autoDiscardable = false;

  tabs.value.splice(tab.index, 1, tab);

  serial.emit("tabs.onUpdated", tab.id, { autoDiscardable: false }, tab);

  await write();
}

serial.handle<Tab>(
  "tabs.create",
  async (createProperties: CreateProperties = {}) => {
    const tab: Tab = {
      active: false,
      audible: false,
      autoDiscardable: true,
      discarded: false,
      favIconUrl: "",
      height: undefined,
      hidden: false,
      highlighted: false,
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      incognito: false,
      index: tabs.value.length,
      isInReaderMode: false,
      lastAccessed: Date.now(),
      mutedInfo: undefined,
      openerTabId: createProperties.openerTabId ?? undefined,
      pinned: createProperties.pinned ?? false,
      sessionId: undefined,
      status: "loading",
      successorTabId: undefined,
      title: createProperties.url ?? "New Tab",
      url: createProperties.url ?? "about:newTab",
      width: undefined,
      windowId: 1
    };

    tabs.value.splice(tab.index, 0, tab);

    const pinned = tabs.peek().filter((tab) => tab.pinned);
    const unpinned = tabs.peek().filter((tab) => !tab.pinned);

    tabs.value = [...pinned, ...unpinned];

    for (let i = 0; i < tabs.peek().length; i++) {
      tabs.value[i].index = i;
    }

    tabs.value = [...tabs.peek()];

    if (createProperties.active ?? true) {
      await setActive(tab);
    }

    return tab;
  }
);

serial.handle("tabs.remove", (tabIds: number | number[]) => {
  if (typeof tabIds === "number") {
    tabIds = [tabIds];
  }

  for (let i = 0; i < tabIds.length; i++) {
    const tab = tabs.peek().find((tab) => tab.id === (tabIds as number[])[i])!;

    tabs.value.splice(tab.index, 1);

    for (let i = 0; i < tabs.peek().length; i++) {
      tabs.value[i].index = i;
    }

    tabs.value = [...tabs.peek()];
  }
});

export function write(): Promise<void> {
  return fs.writeFile(
    "/Velocity/profile/tabs.json",
    JSON.stringify(tabs.peek()),
    "utf8"
  );
}

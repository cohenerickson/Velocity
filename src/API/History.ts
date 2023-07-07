import type Tab from "./Tab";
import EventEmitter from "events";
import type { IDBPDatabase } from "idb";
import { openDB } from "idb";
import { isServer } from "solid-js/web";
import protocols from "~/manager/protocolManager";
import type HistoryEntry from "~/types/HistoryEntry";

export default class History extends EventEmitter {
  #db?: IDBPDatabase;

  constructor() {
    super();
    this.#init().then(() => {
      this.emit("ready");
    });
  }

  async #init(): Promise<IDBPDatabase<unknown>> {
    if (!isServer) {
      this.#db = await openDB("history", 1, {
        upgrade(db) {
          db.createObjectStore("history", { keyPath: "id" });
        }
      });
    }

    return this.#db as IDBPDatabase<unknown>;
  }

  async add(tab: Tab): Promise<any> {
    if (!this.#db) return;

    if (!tab.url() || protocols.find(tab.url())) return;

    const tx = this.#db.transaction("history", "readwrite");
    const store = tx.objectStore("history");

    return await store.put({
      id: tab.historyId,
      timestamp: Date.now(),
      url: tab.url() || "about:newTab",
      title: tab.title(),
      favicon: tab.icon()
    });
  }

  async get(): Promise<HistoryEntry[]> {
    if (!this.#db) return [];

    const tx = this.#db.transaction("history", "readonly");
    const store = tx.objectStore("history");

    const history = await store.getAll();

    return history;
  }

  async delete(key: number): Promise<void> {
    if (!this.#db) return;

    const tx = this.#db.transaction("history", "readwrite");
    const store = tx.objectStore("history");

    return await store.delete(key);
  }

  async clear(): Promise<void> {
    if (!this.#db) return;

    const tx = this.#db.transaction("history", "readwrite");
    const store = tx.objectStore("history");

    return await store.clear();
  }
}

import type Tab from "./Tab";
import { IDBPDatabase, openDB } from "idb";
import protocols from "~/util/protocols";

export default class History {
  #db?: IDBPDatabase<unknown>;

  constructor() {
    this.#init();
  }

  async #init() {
    const db = await openDB("history", 1, {
      upgrade(db) {
        db.createObjectStore("history", { keyPath: "id" });
      }
    });

    this.#db = db;
  }

  async add(tab: Tab) {
    if (!this.#db) return;

    console.log(tab.url());

    if (!tab.url() || protocols.reverse(tab.url())) return;

    const tx = this.#db.transaction("history", "readwrite");
    const store = tx.objectStore("history");

    await store.put({
      id: tab.historyId,
      timestamp: Date.now(),
      url: tab.url() || "about:newTab",
      title: tab.title(),
      favicon: tab.icon()
    });
  }

  async get() {
    if (!this.#db) return [];

    const tx = this.#db.transaction("history", "readonly");
    const store = tx.objectStore("history");

    const history = await store.getAll();

    return history;
  }

  async delete(key: number) {
    if (!this.#db) return;

    const tx = this.#db.transaction("history", "readwrite");
    const store = tx.objectStore("history");

    await store.delete(key);
  }

  async clear() {
    if (!this.#db) return;

    const tx = this.#db.transaction("history", "readwrite");
    const store = tx.objectStore("history");

    await store.clear();
  }
}

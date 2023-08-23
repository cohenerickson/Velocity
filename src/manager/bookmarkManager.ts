import { globalBindingUtil } from "./addonWorkerManager";
import { IDBPDatabase, openDB } from "idb";
import { isServer } from "solid-js/web";
import { v4 } from "uuid";
import {
  BookmarkDB,
  BookmarkTreeNode,
  CreateDetails
} from "~/addon/api/bookmarks";
import Tab from "~/api/Tab";
import { bookmarks, setBookmarks } from "~/data/appState";
import { getActiveTab } from "~/util";

let db: IDBPDatabase<BookmarkDB>;
if (!isServer) {
  db = await openDB<BookmarkDB>("bookmarks", 1, {
    upgrade(db) {
      db.createObjectStore("bookmarks", {
        keyPath: "id"
      });
    }
  });
}

export async function create(bookmark: CreateDetails) {
  const node: BookmarkTreeNode = {
    dateAdded: Date.now(),
    dateGroupModified: Date.now(),
    dateLastUsed: bookmark.type !== "folder" ? Date.now() : undefined,
    id: v4(),
    index: bookmark.index,
    parentId: bookmark.parentId,
    title: bookmark.title || bookmark.url || "New Folder",
    type: bookmark.type ?? "folder",
    url: bookmark.url,
    icon: bookmark.icon
  };

  setBookmarks([...bookmarks(), node]);

  await db.put("bookmarks", node);

  globalBindingUtil.emit("bookmarks.create", node.id, node);
}

export async function remove(node: BookmarkTreeNode) {
  setBookmarks(bookmarks().filter((x) => x.id !== node.id));

  await db.delete("bookmarks", node.id);

  globalBindingUtil.emit("bookmarks.onRemoved", node.id, {
    index: node.index,
    node,
    parentId: node.parentId
  });
}

export async function run(
  node: BookmarkTreeNode,
  event?: MouseEvent,
  ctrlOverride?: boolean
) {
  if (node.url !== undefined) {
    if (/^javascript:/.test(node.url)) {
      getActiveTab().executeScript(
        decodeURIComponent(node.url.replace(/^javascript:/, ""))
      );
    } else {
      if (event?.ctrlKey || ctrlOverride) {
        new Tab(node.url || "about:newTab", false);
      } else {
        getActiveTab().navigate(node.url || "about:newTab");
      }
    }
  }
}

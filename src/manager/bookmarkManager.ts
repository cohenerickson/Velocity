import { globalBindingUtil } from "./addonWorkerManager";
import {
  BookmarkTreeNode,
  CreateDetails,
  remove,
  create,
  update
} from "~/addon/api/bookmarks";
import Tab from "~/api/Tab";
import { bookmarks, setBookmarks } from "~/data/appState";
import { getActiveTab } from "~/util";

export async function createNode(bookmark: CreateDetails) {
  const node = await create(bookmark);

  setBookmarks([...bookmarks(), node]);

  globalBindingUtil.emit("bookmarks.create", node.id, node);
}

export async function removeNode(node: BookmarkTreeNode) {
  await remove(node.id);

  setBookmarks(bookmarks().filter((x) => x.id !== node.id));

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

export async function edit(node: BookmarkTreeNode) {
  const popup = new Velocity.Popup(Velocity.getActiveTab());

  popup.addComponent({
    type: "text",
    content: "Name"
  });
  popup.addComponent({
    type: "input",
    id: "title",
    value: node.title
  });

  popup.addComponent({
    type: "text",
    content: "URL"
  });
  popup.addComponent({
    type: "input",
    id: "url",
    value: node.url
  });

  popup.addButton({
    style: 0,
    text: "Save",
    id: "save"
  });
  popup.addButton({
    style: 1,
    text: "Cancel",
    id: "cancel"
  });

  popup.on("save", (data) => {
    update(node.id, {
      title: data.title,
      url: data.url
    });

    // TODO: Fix
    setBookmarks([
      ...bookmarks().filter((x) => x.id !== node.id),
      Object.assign({}, node, {
        title: data.title,
        url: data.url
      })
    ]);
  });

  popup.push();
}

import EventManager from "../types/EventManager";
import bindingUtil from "../util/bindingUtil";
import callbackWrapper from "../util/callbackWrapper";
import { openDB, DBSchema } from "idb";
import { v4 } from "uuid";

export interface BookmarkDB extends DBSchema {
  bookmarks: {
    key: string;
    value: BookmarkTreeNode;
  };
}

export type BookmarkTreeNode = {
  children?: BookmarkTreeNode[];
  dateAdded?: number;
  dateGroupModified?: number;
  dateLastUsed?: number;
  id: string;
  index?: number;
  parentId?: string;
  title: string;
  type: BookmarkTreeNodeType;
  unmodifiable?: BookmarkTreeNodeUnmodifiable;
  url?: string;
  icon?: string;
};

export type CreateDetails = {
  index?: number;
  parentId?: string;
  title?: string;
  type?: BookmarkTreeNodeType;
  url: string;
  icon?: string;
};

export type BookmarkTreeNodeType = "bookmark" | "folder" | "separator";
export type BookmarkTreeNodeUnmodifiable = "managed";

type BookmarkLocation = {
  index?: number;
  parentId?: string;
};

type BookmarkSearchQuery = {
  query?: string;
  title?: string;
  url?: string;
};

type BookmarkChanges = {
  title?: string;
  url?: string;
};

const db = await openDB<BookmarkDB>("bookmarks", 1, {
  upgrade(db) {
    db.createObjectStore("bookmarks", {
      keyPath: "id"
    });
  }
});

export const create = callbackWrapper($create);

async function $create(bookmark: CreateDetails): Promise<BookmarkTreeNode> {
  const node: BookmarkTreeNode = {
    dateAdded: Date.now(),
    dateGroupModified: Date.now(),
    dateLastUsed: bookmark.type !== "folder" ? Date.now() : undefined,
    id: v4(),
    index: bookmark.index,
    parentId: bookmark.parentId,
    title: bookmark.title || bookmark.url || "New Folder",
    type: bookmark.type ?? "folder",
    url: bookmark.url
  };

  await db.add("bookmarks", node);

  bindingUtil.emit("bookmarks.reload");
  bindingUtil.emit("bookmarks.create", node.id, node);

  return node;
}

export const get = callbackWrapper($get);

async function $get(
  idOrIdList: string | string[]
): Promise<BookmarkTreeNode[]> {
  const nodes = filterBookmarks(
    await db.getAll("bookmarks"),
    Array.isArray(idOrIdList) ? idOrIdList : [idOrIdList]
  );

  if (!nodes.length) {
    throw new Error("Bookmark not found");
  }

  return nodes;
}

export const getChildren = callbackWrapper($getChildren);

async function $getChildren(id: string): Promise<BookmarkTreeNode[]> {
  const nodes = await db.getAll("bookmarks");
  const children = getChildrenOf(nodes, id);
  const [node] = filterBookmarks(nodes, [id]);

  if (!node) {
    throw new Error("Bookmark not found");
  }

  return children;
}

export const getRecent = callbackWrapper($getRecent);

async function $getRecent(numberOfItems: number): Promise<BookmarkTreeNode[]> {
  if (numberOfItems === undefined) {
    throw new Error("numberOfItems argument is required");
  }

  if (typeof numberOfItems !== "number" || numberOfItems % 1 !== 0) {
    throw new Error("numberOfItems argument must be an integer");
  }

  if (numberOfItems <= 0) {
    throw new Error("numberOfItems argument must be greater than zero");
  }

  const nodes = await db.getAll("bookmarks");

  return nodes
    .sort((a, b) => (b.dateAdded ?? 0) - (a.dateAdded ?? 0))
    .slice(0, numberOfItems);
}

export const getSubTree = callbackWrapper($getSubTree);

async function $getSubTree(id: string): Promise<BookmarkTreeNode[]> {
  const nodes = await db.getAll("bookmarks");
  const [node] = filterBookmarks(nodes, [id]);

  if (!node) {
    throw new Error("Bookmark not found");
  }

  const children = getChildrenOf(nodes, node.id);

  for (let i = 0; i < children.length; i++) {
    children[i] = getFullNode(nodes, children[i]);
  }

  return [
    Object.assign({}, node, {
      children
    })
  ];
}

export const getTree = callbackWrapper($getTree);

async function $getTree(): Promise<BookmarkTreeNode[]> {
  const nodes = await db.getAll("bookmarks");

  const children: BookmarkTreeNode[] = [];

  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i].parentId) {
      children.push(getFullNode(nodes, nodes[i]));
    }
  }

  return [
    {
      children,
      title: "Bookmarks Bar",
      type: "folder",
      id: "0"
    }
  ];
}

export const move = callbackWrapper($move);

async function $move(
  id: string,
  destination: BookmarkLocation
): Promise<BookmarkTreeNode> {
  const [node] = await $get(id);
  const oldParentId = node.parentId;
  const oldIndex = node.index;

  if (node.unmodifiable === "managed") {
    throw new Error("Bookmark is managed");
  }

  if (destination.parentId) {
    const [parent] = await $get(destination.parentId);
    parent.dateGroupModified = Date.now();
    await db.put("bookmarks", parent);

    if (node.parentId) {
      const [oldParent] = await $get(node.parentId);
      oldParent.dateGroupModified = Date.now();
      await db.put("bookmarks", oldParent);

      if (node.parentId !== destination.parentId) {
        let children = await $getSubTree(node.parentId);
        children = children.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

        const currentIndex = children.findIndex((x) => x.id === node.id);
        children.splice(currentIndex, 1);

        for (let i = 0; i < children.length; i++) {
          let child = children[i];
          const oldParentId = child.parentId;
          const oldIndex = child.index;

          child.index = i;

          await db.put("bookmarks", child);

          if (oldIndex !== child.index || oldParentId !== child.parentId) {
            bindingUtil.emit("bookmarks.onMoved", {
              parentId: child.parentId,
              oldParentId,
              index: child.index,
              oldIndex
            });
          }
        }

        bindingUtil.emit("bookmarks.onChildrenReordered", oldParentId, {
          childIds: children.map((x) => x.id)
        });
      }
    }

    node.parentId = destination.parentId;
  }

  if (destination.index) {
    node.index = destination.index;

    if (node.parentId) {
      const [parent] = await $get(node.parentId);
      parent.dateGroupModified = Date.now();
      await db.put("bookmarks", parent);

      let children = await $getSubTree(node.parentId);
      children = children.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

      const currentIndex = children.findIndex((x) => x.id === node.id);
      children.splice(currentIndex, 1);
      children.splice(destination.index, 0, node);

      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        const oldParentId = child.parentId;
        const oldIndex = child.index;

        child.index = i;

        await db.put("bookmarks", child);

        if (oldIndex !== child.index || oldParentId !== child.parentId) {
          bindingUtil.emit("bookmarks.onMoved", {
            parentId: child.parentId,
            oldParentId,
            index: child.index,
            oldIndex
          });
        }
      }

      bindingUtil.emit("bookmarks.onChildrenReordered", oldParentId, {
        childIds: children.map((x) => x.id)
      });
    }
  }

  await db.put("bookmarks", node);

  bindingUtil.emit("bookmarks.onMoved", {
    parentId: node.parentId,
    oldParentId,
    index: node.index,
    oldIndex
  });
  bindingUtil.emit("bookmarks.reload");

  return node;
}

export const remove = callbackWrapper($remove);

async function $remove(id: string): Promise<void> {
  const [node] = await $getSubTree(id);

  if (!node.parentId) {
    throw new Error("The bookmark root cannot be modified");
  }

  if (node.children) {
    throw new Error("Item is a non-empty folder");
  }

  await db.delete("bookmarks", id);

  bindingUtil.emit("bookmarks.onRemoved", node.id, {
    index: node.index,
    node,
    parentId: node.parentId
  });
  bindingUtil.emit("bookmarks.reload");
}

export const removeTree = callbackWrapper($removeTree);

async function $removeTree(id: string): Promise<void> {
  const [node] = await $getSubTree(id);

  if (!node.parentId) {
    throw new Error("The bookmark root cannot be modified");
  }

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      await removeTree(node.children[i].id);
    }
  }

  await db.delete("bookmarks", id);

  bindingUtil.emit("bookmarks.onRemoved", node.id, {
    index: node.index,
    node,
    parentId: node.parentId
  });
  bindingUtil.emit("bookmarks.reload");
}

export const search = callbackWrapper($search);

async function $search(
  query: BookmarkSearchQuery | string
): Promise<BookmarkTreeNode[]> {
  if (!query) {
    throw new Error("Query object is required");
  }

  if (typeof query === "string") {
    query = { query };
  }

  if (typeof query !== "object") {
    throw new Error("Query must be an object or a string");
  }

  if (query.query && typeof query.query !== "string") {
    throw new Error("Query option must be a string");
  }

  if (query.title && typeof query.title !== "string") {
    throw new Error("Title option must be a string");
  }

  if (!query.query && !query.title && !query.url) {
    throw new Error("A query option must be specified");
  }

  let nodes = await db.getAll("bookmarks");

  if (query.title) {
    nodes = nodes.filter(
      (x) => x.title === (query as BookmarkSearchQuery).title
    );
  }

  if (query.url) {
    nodes = nodes.filter(
      (x) =>
        x.url?.replace(/\/$/, "").toLowerCase() ===
        (query as BookmarkSearchQuery).url?.replace(/\/$/, "").toLowerCase()
    );
  }

  if (query.query) {
    nodes = nodes.filter(
      (x) =>
        x.url
          ?.toLowerCase()
          .includes((query as BookmarkSearchQuery).query as string) ||
        x.title
          ?.toLowerCase()
          .includes((query as BookmarkSearchQuery).query as string)
    );
  }

  return nodes;
}

export const update = callbackWrapper($update);

async function $update(
  id: string,
  changes: BookmarkChanges
): Promise<BookmarkTreeNode> {
  const [node] = await $get(id);

  if (node.unmodifiable === "managed") {
    throw new Error("Bookmark is managed");
  }

  if (changes.title !== undefined) {
    node.title = changes.title;
  }

  if (changes.url !== undefined) {
    node.url = changes.url;
  }

  await db.put("bookmarks", node);

  bindingUtil.emit("bookmarks.reload");

  return node;
}

export const MAX_SUSTAINED_WRITE_OPERATIONS_PER_MINUTE = 1000000;
export const MAX_WRITE_OPERATIONS_PER_HOUR = 1000000;

export const onCreated = new EventManager("bookmarks.onCreated");
export const onRemoved = new EventManager("bookmarks.onRemoved");
export const onChanged = new EventManager("bookmarks.onChanged");
export const onMoved = new EventManager("bookmarks.onMoved");
export const onChildrenReordered = new EventManager(
  "bookmarks.onChildrenReordered"
);
export const onImportBegan = new EventManager("bookmarks.onImportBegan");
export const onImportEnded = new EventManager("bookmarks.onImportEnded");

function filterBookmarks(
  bookmarks: BookmarkTreeNode[],
  ids: string[]
): BookmarkTreeNode[] {
  const returnBookmarks: BookmarkTreeNode[] = [];

  bookmarks.forEach((bookmark: BookmarkTreeNode) => {
    if (ids.includes(bookmark.id)) {
      returnBookmarks.push(bookmark);
    }
  });

  return returnBookmarks;
}

function getChildrenOf(
  nodes: BookmarkTreeNode[],
  id: string
): BookmarkTreeNode[] {
  const children: BookmarkTreeNode[] = [];

  nodes.forEach((node) => {
    if (node.parentId === id) {
      children.push(node);
    }
  });

  return children;
}

function getFullNode(
  nodes: BookmarkTreeNode[],
  node: BookmarkTreeNode
): BookmarkTreeNode {
  const children = getChildrenOf(nodes, node.id);

  for (let i = 0; i < children.length; i++) {
    children[i] = getFullNode(nodes, children[i]);
  }

  return Object.assign({}, node, {
    children
  });
}

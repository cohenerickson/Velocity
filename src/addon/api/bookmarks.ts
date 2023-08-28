import EventManager from "../types/EventManager";
import ExtensionError from "../util/ExtensionError";
import bindingUtil from "../util/bindingUtil";
import callbackWrapper from "../util/callbackWrapper";
import { v4 } from "uuid";
import { fs, sh } from "~/util/fs";

const ROOT_GUID = "root________";

let bookmarks = new Array<BookmarkTreeNode>();
sh.mkdirp("/Velocity");
if (await sh.exists("/Velocity/bookmarks.json")) {
  bookmarks = JSON.parse(await fs.readFile("/Velocity/bookmarks.json", "utf8"));
}

async function write() {
  await fs.writeFile(
    "/Velocity/bookmarks.json",
    JSON.stringify(bookmarks),
    "utf8"
  );
}

function throwIfRootGuid(id: string) {
  // We don't want to throw when running in non-extension context
  if (id === ROOT_GUID && !("Velocity" in globalThis)) {
    throw new ExtensionError("The bookmark root cannot be modified");
  }
}

type Node = {
  dateAdded?: number;
  dateGroupModified?: number;
  dateLastUsed?: number;
  id: string;
  index: number;
  parentId: string;
  title: string;
  type: BookmarkTreeNodeType;
  unmodifiable?: BookmarkTreeNodeUnmodifiable;
  url?: string;
  icon?: string;
};

export type BookmarkTreeNode<
  T extends boolean = false,
  Y extends boolean = false
> = T extends true
  ? Y extends true
    ? Node & {
        children: BookmarkTreeNode<true, true>[];
      }
    : Node & {
        children: BookmarkTreeNode<true, false>[];
      }
  : Node;

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

export const create = callbackWrapper($create);

/** Creates a bookmark or folder under the specified parentId. If url is NULL or missing, it will be a folder. */
async function $create(bookmark: CreateDetails): Promise<BookmarkTreeNode> {
  let parent: BookmarkTreeNode<true>;
  if (bookmark.parentId) {
    parent = (await $getSubTree(bookmark.parentId))[0];
  } else {
    parent = (await $getTree())[0];
  }

  const node: BookmarkTreeNode<false> = {
    dateAdded: Date.now(),
    dateGroupModified: Date.now(),
    dateLastUsed: bookmark.type !== "folder" ? Date.now() : undefined,
    id: v4(),
    index: parent.children!.length,
    parentId: bookmark.parentId || ROOT_GUID,
    title: bookmark.title || bookmark.url || "New Folder",
    type: bookmark.type ?? "folder",
    url: bookmark.url,
    icon: bookmark.icon ?? bookmark.url
  };

  throwIfRootGuid(node.parentId);

  bookmarks.push(node);

  await write();

  bindingUtil.emit("bookmarks.reload");
  bindingUtil.emit("bookmarks.create", node.id, node);

  return node;
}

export const get = callbackWrapper($get);

/** Retrieves the specified BookmarkTreeNode(s). */
async function $get(
  idOrIdList: string | string[]
): Promise<BookmarkTreeNode[]> {
  const nodes = await filterBookmarks(
    bookmarks,
    Array.isArray(idOrIdList) ? idOrIdList : [idOrIdList]
  );

  if (idOrIdList === ROOT_GUID || idOrIdList.includes(ROOT_GUID)) {
    nodes.push((await $getTree())[0]);
  }

  if (!nodes.length) {
    throw new ExtensionError("Bookmark not found");
  }

  return nodes;
}

export const getChildren = callbackWrapper($getChildren);

/** Retrieves the children of the specified BookmarkTreeNode id. */
async function $getChildren(id: string): Promise<BookmarkTreeNode[]> {
  const children = getChildrenOf(bookmarks, id);
  let [node] = await filterBookmarks(bookmarks, [id]);

  if (!node) {
    throw new ExtensionError("Bookmark not found");
  }

  return children;
}

export const getRecent = callbackWrapper($getRecent);

/** Retrieves the recently added bookmarks. */
async function $getRecent(numberOfItems: number): Promise<BookmarkTreeNode[]> {
  if (numberOfItems === undefined) {
    throw new ExtensionError("numberOfItems argument is required");
  }

  if (typeof numberOfItems !== "number" || numberOfItems % 1 !== 0) {
    throw new ExtensionError("numberOfItems argument must be an integer");
  }

  if (numberOfItems <= 0) {
    throw new ExtensionError(
      "numberOfItems argument must be greater than zero"
    );
  }

  return bookmarks
    .sort((a, b) => (b.dateAdded ?? 0) - (a.dateAdded ?? 0))
    .slice(0, numberOfItems);
}

export const getSubTree = callbackWrapper($getSubTree);

/** Retrieves part of the Bookmarks hierarchy, starting at the specified node. */
async function $getSubTree(
  id: string
): Promise<BookmarkTreeNode<true, true>[]> {
  const [node] = await filterBookmarks(bookmarks, [id]);

  if (!node) {
    throw new ExtensionError("Bookmark not found");
  }

  const children = getChildrenOf(bookmarks, node.id);

  for (let i = 0; i < children.length; i++) {
    children[i] = await getFullNode(bookmarks, children[i]);
  }

  return [
    Object.assign({}, node, {
      children
    }) as BookmarkTreeNode<true, true>
  ];
}

export const getTree = callbackWrapper($getTree);

/** Retrieves the entire Bookmarks hierarchy. */
async function $getTree(): Promise<BookmarkTreeNode<true>[]> {
  return [
    await getFullNode(bookmarks, {
      title: "Bookmarks Bar",
      type: "folder",
      id: ROOT_GUID,
      index: 0,
      parentId: ROOT_GUID
    })
  ];
}

export const move = callbackWrapper($move);

/** Moves the specified BookmarkTreeNode to the provided location. */
async function $move(
  id: string,
  destination: BookmarkLocation
): Promise<BookmarkTreeNode> {
  const [node] = await $get(id);
  const oldParentId = node.parentId;
  const oldIndex = node.index;
  const events = [];

  throwIfRootGuid(node.parentId);

  if (destination.parentId !== undefined) {
    throwIfRootGuid(destination.parentId);

    const [parent] = await $getSubTree(destination.parentId);

    node.parentId = destination.parentId;
    node.index = parent.children.length;

    events.push({
      parentId: node.parentId,
      oldParentId,
      index: node.index,
      oldIndex
    });

    const [oldParent] = await $getSubTree(oldParentId);

    for (const index in oldParent.children) {
      const [child] = await $get(oldParent.children[index].id);

      const oldParentId = child.parentId;
      const oldIndex = child.index;

      events.push({
        parentId: node.parentId,
        oldParentId,
        index: node.index,
        oldIndex
      });

      child.index = Number(index);
    }
  }

  if (destination.index !== undefined) {
    const [parent] = await $getSubTree(destination.parentId || node.parentId);

    parent.children.splice(
      parent.children.findIndex((x) => x.id === node.id),
      1
    );

    parent.children.splice(
      destination.index,
      0,
      node as BookmarkTreeNode<true>
    );

    for (const index in parent.children) {
      const [child] = await $get(parent.children[index].id);

      const oldParentId = child.parentId;
      const oldIndex = child.index;

      events.push({
        parentId: node.parentId,
        oldParentId,
        index: node.index,
        oldIndex
      });

      child.index = Number(index);
    }

    events.push({
      parentId: node.parentId,
      oldParentId,
      index: node.index,
      oldIndex
    });
  }

  await write();

  events.forEach((event) => {
    bindingUtil.emit("bookmarks.onMoved", event);
  });
  bindingUtil.emit("bookmarks.reload");

  return node;
}

export const remove = callbackWrapper($remove);

/** Removes a bookmark or an empty bookmark folder. */
async function $remove(id: string): Promise<void> {
  const [node] = await $getSubTree(id);

  throwIfRootGuid(node.parentId);

  if (node.children?.length) {
    throw new ExtensionError("Item is a non-empty folder");
  }

  const index = bookmarks.findIndex((x) => x.id === id);
  bookmarks.splice(index, 1);

  await write();

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

  throwIfRootGuid(node.parentId);

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      await removeTree(node.children[i].id);
    }
  }

  const index = bookmarks.findIndex((x) => x.id === id);
  bookmarks.splice(index, 1);

  await write();

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

  let nodes = Array.from(bookmarks);

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

  Object.assign(bookmarks.find((x) => x.id === id)!, node);

  await write();

  bindingUtil.emit("bookmarks.reload");

  return node;
}

/** @deprecated */
export const MAX_SUSTAINED_WRITE_OPERATIONS_PER_MINUTE = 1000000;
/** @deprecated */
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

async function filterBookmarks(
  bookmarks: BookmarkTreeNode[],
  ids: string[]
): Promise<BookmarkTreeNode[]> {
  const returnBookmarks: BookmarkTreeNode[] = [];

  for (const id of ids) {
    if (id === ROOT_GUID) {
      return await $getTree();
    }

    returnBookmarks.push(bookmarks.find((x) => x.id === id)!);
  }

  return returnBookmarks.filter((x) => !!x);
}

function getChildrenOf(
  nodes: BookmarkTreeNode[],
  id: string
): BookmarkTreeNode[] {
  let children: BookmarkTreeNode[] = [];

  for (const node of nodes) {
    if (node.parentId === id) {
      children.push(node);
    }
  }

  return children.sort((a, b) => (a.index > b.index ? 1 : -1));
}

async function getFullNode(
  nodes: BookmarkTreeNode[],
  node: BookmarkTreeNode
): Promise<BookmarkTreeNode<true, true>> {
  let children = getChildrenOf(nodes, node.id);

  for (let i = 0; i < children.length; i++) {
    children[i] = await getFullNode(nodes, children[i]);
  }

  return Object.assign({}, node, {
    children: children.sort((a, b) => (a.index > b.index ? 1 : -1))
  }) as BookmarkTreeNode<true, true>;
}

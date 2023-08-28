import EventManager from "../types/EventManager";
import bindingUtil from "../util/bindingUtil";
import callbackWrapper from "../util/callbackWrapper";
import { v4 } from "uuid";
import { fs, sh } from "~/util/fs";

// @ts-ignore
self.fs = fs;

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

export const create = callbackWrapper($create);

/** Creates a bookmark or folder under the specified parentId. If url is NULL or missing, it will be a folder. */
async function $create(bookmark: CreateDetails): Promise<BookmarkTreeNode> {
  let parent: BookmarkTreeNode;
  if (bookmark.parentId) {
    parent = (await $get(bookmark.parentId))[0];
  } else {
    parent = (await $getTree())[0];
  }

  const node: BookmarkTreeNode = {
    dateAdded: Date.now(),
    dateGroupModified: Date.now(),
    dateLastUsed: bookmark.type !== "folder" ? Date.now() : undefined,
    id: v4(),
    index: parent.children!.length,
    parentId: bookmark.parentId,
    title: bookmark.title || bookmark.url || "New Folder",
    type: bookmark.type ?? "folder",
    url: bookmark.url,
    icon: bookmark.icon ?? bookmark.url
  };

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
  const nodes = filterBookmarks(
    bookmarks,
    Array.isArray(idOrIdList) ? idOrIdList : [idOrIdList]
  );

  if (!nodes.length) {
    throw new Error("Bookmark not found");
  }

  return nodes;
}

export const getChildren = callbackWrapper($getChildren);

/** Retrieves the children of the specified BookmarkTreeNode id. */
async function $getChildren(id: string): Promise<BookmarkTreeNode[]> {
  const children = getChildrenOf(bookmarks, id);
  const [node] = filterBookmarks(bookmarks, [id]);

  if (!node) {
    throw new Error("Bookmark not found");
  }

  return children;
}

export const getRecent = callbackWrapper($getRecent);

/** Retrieves the recently added bookmarks. */
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

  return bookmarks
    .sort((a, b) => (b.dateAdded ?? 0) - (a.dateAdded ?? 0))
    .slice(0, numberOfItems);
}

export const getSubTree = callbackWrapper($getSubTree);

/** Retrieves part of the Bookmarks hierarchy, starting at the specified node. */
async function $getSubTree(id: string): Promise<BookmarkTreeNode[]> {
  const [node] = filterBookmarks(bookmarks, [id]);

  if (!node) {
    throw new Error("Bookmark not found");
  }

  const children = getChildrenOf(bookmarks, node.id);

  for (let i = 0; i < children.length; i++) {
    children[i] = getFullNode(bookmarks, children[i]);
  }

  return [
    Object.assign({}, node, {
      children
    })
  ];
}

export const getTree = callbackWrapper($getTree);

/** Retrieves the entire Bookmarks hierarchy. */
async function $getTree(): Promise<BookmarkTreeNode[]> {
  const children: BookmarkTreeNode[] = [];

  for (let i = 0; i < bookmarks.length; i++) {
    if (!bookmarks[i].parentId) {
      children.push(getFullNode(bookmarks, bookmarks[i]));
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

/** Moves the specified BookmarkTreeNode to the provided location. */
async function $move(
  id: string,
  destination: BookmarkLocation
): Promise<BookmarkTreeNode> {
  // TODO: Implement

  await write();

  return {} as BookmarkTreeNode;
}

export const remove = callbackWrapper($remove);

/** Removes a bookmark or an empty bookmark folder. */
async function $remove(id: string): Promise<void> {
  const [node] = await $getSubTree(id);

  if (!node.parentId && !Velocity) {
    throw new Error("The bookmark root cannot be modified");
  }

  if (node.children?.length) {
    throw new Error("Item is a non-empty folder");
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

  if (!node.parentId && !Velocity) {
    throw new Error("The bookmark root cannot be modified");
  }

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

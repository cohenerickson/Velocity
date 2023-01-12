export interface BookmarkType {
  type: "bookmark";
  name: string;
  url: string;
  icon: string;
}

export interface FolderType {
  type: "folder";
  name: string;
  bookmarks: BookmarkType[];
}

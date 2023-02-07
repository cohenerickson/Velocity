import { createSignal } from "solid-js";
import Tab from "~/data/Tab";
import BareClient from "@tomphttp/bare-client";
import { BookmarkType, FolderType } from "~/types/Bookmarks";

export const [tabs, setTabs] = createSignal<Tab[]>([]);
export const [tabStack, setTabStack] = createSignal<Set<Tab>>(new Set());
export const [bareClient, setBareClient] = createSignal<
  BareClient | undefined
>();
export const [bookmarks, setBookmarks] = createSignal<
  Set<BookmarkType | FolderType>
>(new Set([]));

import { createSignal } from "solid-js";
import Tab from "~/API/Tab";
import BareClient from "@tomphttp/bare-client";
import Bookmark from "~/types/Bookmarks";

export const [tabs, setTabs] = createSignal<Tab[]>([]);
export const [tabStack, setTabStack] = createSignal<Set<Tab>>(new Set());
export const [bareClient, setBareClient] = createSignal<
  BareClient | undefined
>();
export const [bookmarks, setBookmarks] = createSignal<Set<Bookmark>>(
  new Set([])
);
export const [bookmarksShown, setBookmarksShown] = createSignal<boolean>(true);

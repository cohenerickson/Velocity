import { createSignal } from "solid-js";
import Tab from "~/API/Tab";
import BareClient from "@tomphttp/bare-client";
import Bookmark from "~/API/Bookmark";
import Protocol from "~/API/Protocol";

export const [tabs, setTabs] = createSignal<Tab[]>([]);
export const [tabStack, setTabStack] = createSignal<Set<Tab>>(new Set());
export const [bareClient, setBareClient] = createSignal<
  BareClient | undefined
>();
export const [bookmarks, setBookmarks] = createSignal<Bookmark[]>([]);
export const [bookmarksShown, setBookmarksShown] = createSignal<boolean>(true);
export const [protocols, setProtocols] = createSignal<Protocol[]>([]);

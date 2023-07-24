import type BareClient from "@tomphttp/bare-client";
import { createSignal } from "solid-js";
import { BookmarkTreeNode } from "~/addon/api/bookmarks";
import { IdleState } from "~/addon/api/idle";
import type Keybind from "~/api/Keybind";
import Popup from "~/api/Popup";
import type Protocol from "~/api/Protocol";
import type Tab from "~/api/Tab";
import type AddonEntry from "~/types/AddonEntry";
import $bareClient from "~/util/bareClient";

export const [tabs, setTabs] = createSignal<Tab[]>([]);
export const [popups, setPopups] = createSignal<Popup[]>([]);
export const [tabStack, setTabStack] = createSignal<Set<Tab>>(new Set());
export const [bareClient, setBareClient] =
  createSignal<BareClient>($bareClient);
export const [bookmarks, setBookmarks] = createSignal<BookmarkTreeNode[]>([]);
export const [bookmarksShown, setBookmarksShown] = createSignal<boolean>(true);
export const [protocols, setProtocols] = createSignal<Protocol[]>([]);
export const [keybinds, setKeybinds] = createSignal<Keybind[]>([]);
export const [addons, setAddons] = createSignal<AddonEntry[]>([]);
export const [idleState, setIdleState] = createSignal<IdleState>("active");

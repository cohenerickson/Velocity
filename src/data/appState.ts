import type BareClient from "@tomphttp/bare-client";
import { createSignal } from "solid-js";
import type Bookmark from "~/API/Bookmark";
import type Keybind from "~/API/Keybind";
import Popup from "~/API/Popup";
import type Protocol from "~/API/Protocol";
import type Tab from "~/API/Tab";
import type AddonEntry from "~/types/AddonEntry";

export const [tabs, setTabs] = createSignal<Tab[]>([]);
export const [popups, setPopups] = createSignal<Popup[]>([]);
export const [tabStack, setTabStack] = createSignal<Set<Tab>>(new Set());
export const [bareClient, setBareClient] = createSignal<
  BareClient | undefined
>();
export const [bookmarks, setBookmarks] = createSignal<Bookmark[]>([]);
export const [bookmarksShown, setBookmarksShown] = createSignal<boolean>(true);
export const [protocols, setProtocols] = createSignal<Protocol[]>([]);
export const [keybinds, setKeybinds] = createSignal<Keybind[]>([]);
export const [addons, setAddons] = createSignal<AddonEntry[]>([]);

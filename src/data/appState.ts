import { createSignal } from "solid-js";
import Tab from "~/components/Tab";
import BareClient from "@tomphttp/bare-client";

export const [tabs, setTabs] = createSignal<Tab[]>([]);
export const [tabStack, setTabStack] = createSignal<Set<Tab>>(new Set());
export const [bareClient, setBareClient] = createSignal<BareClient | undefined>();

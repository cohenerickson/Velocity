import { createSignal } from "solid-js";
import Tab from "~/components/Tab";

export const [tabs, setTabs] = createSignal<Tab[]>([]);
export const [tabStack, setTabStack] = createSignal<Set<Tab>>(new Set());

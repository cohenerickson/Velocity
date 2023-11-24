import { ExtensionMeta } from "../api/util/meta";
import { signal, Signal } from "@preact/signals";

export const extensions: Signal<ExtensionMeta[]> = signal<ExtensionMeta[]>([]);

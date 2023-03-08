import { keybinds, setKeybinds } from "~/data/appState";

interface KeybindOptions {
  name: string;
  description: string;
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: (event: KeyboardEvent) => void;
}

export default class Keybind {
  id: number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  name: string;
  description: string;
  key: string;
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  meta: boolean;
  callback: (event: KeyboardEvent) => void;

  constructor(options: KeybindOptions) {
    this.name = options.name;
    this.description = options.description;
    this.key = options.key;
    this.shift = options.shift ?? false;
    this.ctrl = options.ctrl ?? false;
    this.alt = options.alt ?? false;
    this.meta = options.meta ?? false;
    this.callback = options.callback;

    setKeybinds([...keybinds(), this]);
  }
}

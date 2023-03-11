import { keybinds, setKeybinds } from "~/data/appState";

interface KeybindOptions {
  id?: number;
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
  name!: string;
  description!: string;
  key!: string;
  shift!: boolean;
  ctrl!: boolean;
  alt!: boolean;
  meta!: boolean;
  callback!: (event: KeyboardEvent) => void;

  constructor(options: KeybindOptions) {
    if (!options.id) {
      this.name = options.name;
      this.description = options.description;
      this.key = options.key;
      this.shift = options.shift ?? false;
      this.ctrl = options.ctrl ?? false;
      this.alt = options.alt ?? false;
      this.meta = options.meta ?? false;
      this.callback = options.callback;

      setKeybinds([...keybinds(), this]);
    } else {
      setKeybinds(
        keybinds().map((keybind: Keybind) => {
          if (keybind.id === options.id) {
            keybind.name = options.name ?? keybind.name;
            keybind.description = options.description ?? keybind.description;
            keybind.key = options.key ?? keybind.key;
            keybind.shift = options.shift ?? keybind.shift;
            keybind.ctrl = options.ctrl ?? keybind.ctrl;
            keybind.alt = options.alt ?? keybind.alt;
            keybind.meta = options.meta ?? keybind.meta;
            keybind.callback = options.callback ?? keybind.callback;
          }
          return keybind;
        })
      );

      return keybinds().find(
        (keybind: Keybind) => keybind.id === options.id
      ) as Keybind;
    }
  }

  toString() {
    let str = "";
    if (this.ctrl) str += "Ctrl + ";
    if (this.alt) str += "Alt + ";
    if (this.meta) str += "Meta + ";
    if (this.shift) str += "Shift + ";
    str += this.key.charAt(0).toUpperCase() + this.key.slice(1);
    return str;
  }
}

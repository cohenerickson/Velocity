import { keybinds } from "~/data/appState";

export default function keybindManager(event: KeyboardEvent) {
  for (const keybind of keybinds()) {
    if (
      event.key.toLowerCase() === keybind.key.toLowerCase() &&
      event.ctrlKey === keybind.ctrl &&
      event.shiftKey === keybind.shift &&
      event.altKey === keybind.alt &&
      event.metaKey === keybind.meta
    ) {
      event.preventDefault();
      keybind.callback(event);
    }
  }
}

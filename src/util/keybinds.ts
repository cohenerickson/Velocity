import Tab from "~/data/Tab";
import { tabStack } from "~/data/appState";

export default function keybinds(e: KeyboardEvent) {
  if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
    if (e.key === "r") {
      // ctrl + r
      e.preventDefault();
      Array.from(tabStack())[0].reload();
    } else if (e.key === "d") {
      // ctrl + d
      e.preventDefault();
      Array.from(tabStack())[0].bookmark();
    } else if (e.key === "u") {
      // ctrl + u
      e.preventDefault();
      new Tab(`view-source:${Array.from(tabStack())[0].url()}`, true);
    } else if (e.key === "e") {
      // ctrl + e
      e.preventDefault();
      const searchElement =
        document.querySelector<HTMLInputElement>("#url_bar");
      searchElement?.focus();
      searchElement?.select();
      Array.from(tabStack())[0].search =
        Array.from(tabStack())[0].search() !== false
          ? Array.from(tabStack())[0].search
          : "";
    }
  } else if (!e.ctrlKey && !e.shiftKey && e.altKey && !e.metaKey) {
    if (e.key === "t") {
      // ctrl + t
      e.preventDefault();
      new Tab("about:newTab", true);
    } else if (e.key === "w") {
      // ctrl + w
      e.preventDefault();
      Array.from(tabStack())[0].close();
    } else if (e.key === "ArrowLeft") {
      // alt + ArrowLeft
      e.preventDefault();
      Array.from(tabStack())[0].goBack();
    } else if (e.key === "ArrowRight") {
      // alt + ArrowRight
      e.preventDefault();
      Array.from(tabStack())[0].goForward();
    }
  } else if (e.ctrlKey && !e.shiftKey && e.altKey && !e.metaKey) {
    if (e.key === "i") {
      // ctrl + shift + i
      e.preventDefault();
      Array.from(tabStack())[0].setDevTools();
    }
  }
}

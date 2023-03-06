import preferences from "./preferences";
import Tab from "~/API/Tab";
import { tabStack } from "~/data/appState";
import { bookmarksShown, setBookmarksShown } from "~/data/appState";

export default function keybinds(e: KeyboardEvent) {
  const key = e.key.toLowerCase();
  if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
    if (key === "r") {
      // ctrl + r
      e.preventDefault();
      Array.from(tabStack())[0].reload();
    } else if (key === "d") {
      // ctrl + d
      e.preventDefault();
      Array.from(tabStack())[0].bookmark();
    } else if (key === "u") {
      // ctrl + u
      e.preventDefault();
      new Tab(`view-source:${Array.from(tabStack())[0].url()}`, true);
    } else if (key === "e") {
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
    } else if (key === "h") {
      // ctrl + h
      e.preventDefault();
      new Tab("about:history", true);
    }
  } else if (!e.ctrlKey && !e.shiftKey && e.altKey && !e.metaKey) {
    if (key === "t") {
      // ctrl + t
      e.preventDefault();
      new Tab("about:newTab", true);
    } else if (key === "w") {
      // ctrl + w
      e.preventDefault();
      Array.from(tabStack())[0].close();
    } else if (key === "ArrowLeft") {
      // alt + ArrowLeft
      e.preventDefault();
      Array.from(tabStack())[0].goBack();
    } else if (key === "ArrowRight") {
      // alt + ArrowRight
      e.preventDefault();
      Array.from(tabStack())[0].goForward();
    }
  } else if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
    if (key === "i") {
      // ctrl + shift + i
      e.preventDefault();
      Array.from(tabStack())[0].setDevTools();
    } else if (key === "b") {
      // ctrl + shift + b
      e.preventDefault();
      setBookmarksShown(!bookmarksShown());
      localStorage.setItem(
        "preferences",
        JSON.stringify(
          Object.assign(preferences(), {
            ["bookmarks.shown"]: bookmarksShown()
          })
        )
      );
    }
  }
}

import Tab from "~/components/Tab";
import { tabs, setTabs, tabStack } from "~/data/appState";

export default function keybinds(e: KeyboardEvent) {
  if (e.altKey) {
    if (e.key === "t") {
      e.preventDefault();
      new Tab("about:newTab", true);
      setTabs([...tabs()]);
    } else if (e.key === "w") {
      e.preventDefault();
      Array.from(tabStack())[0].close();
    } else if (e.key === "r") {
      e.preventDefault();
      Array.from(tabStack())[0].reload();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      Array.from(tabStack())[0].goBack();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      Array.from(tabStack())[0].goForward();
    } else if (e.key === "d") {
      Array.from(tabStack())[0].bookmark();
    }
  }
}

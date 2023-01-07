import Tab from "~/components/Tab";
import { tabs, setTabs } from "~/data/appState";

export default function LinkManager(event: MouseEvent) {
  const target = event.target as HTMLAnchorElement;
  if (target.tagName === "A") {
    if (target.target === "_blank" || event.ctrlKey) {
      event.preventDefault();
      if (target.href) {
        new Tab(target.href, true);
        setTabs([...tabs()]);
      }
    }
  }
}
  
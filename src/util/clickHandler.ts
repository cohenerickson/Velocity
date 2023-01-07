import Tab from "~/components/Tab";

export default function LinkManager(event: MouseEvent) {
  const target = event.target as HTMLAnchorElement;
  if (target.tagName === "A" && target.href) {
    console.log(event);
    if (event.ctrlKey) {
      event.preventDefault();
      new Tab(target.href, false);
    }
    if (target.target === "_blank") {
      event.preventDefault();
      new Tab(target.href, true);
    }
  }
}

import Tab from "~/components/Tab";

export default function clickHandler(event: MouseEvent) {
  const element = getAnchor(event.target);
  if (element && element.href) {
    if (event.ctrlKey) {
      event.preventDefault();
      new Tab(element.href, false);
    } else if (element.target === "_blank") {
      event.preventDefault();
      new Tab(element.href, true);
    }
  }
}

function getAnchor(element: EventTarget | null): HTMLAnchorElement | undefined {
  if (!element) return;
  const target = element as HTMLElement;
  if (target.tagName === "A") {
    return target as HTMLAnchorElement;
  } else if (target.parentElement) {
    return getAnchor(target.parentElement);
  } else {
    return;
  }
}

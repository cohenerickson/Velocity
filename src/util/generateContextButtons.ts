import ContextItem from "~/data/ContextItem";
import Tab from "~/data/Tab";
import { tabStack } from "~/data/appState";
import { open } from "~/util/clickHandler";

export default function generateContextButtons(
  element: HTMLElement
): ContextItem[] {
  const buttons: ContextItem[] = [];

  if (isElementOfType(element, "a")) {
    buttons.push(
      new ContextItem({
        text: "Open link in new tab",
        onClick: () => {
          open(undefined, getElementAttribute(element, "href"), true, false);
        }
      }),
      new ContextItem({
        text: "Copy link address",
        onClick: () => {
          navigator.clipboard.writeText(getElementAttribute(element, "href"));
        }
      }),
      new ContextItem({ separator: true })
    );
  }

  if (isElementOfType(element, "img")) {
    buttons.push(
      new ContextItem({
        text: "Open image in new tab",
        onClick: () => {
          open(undefined, getElementAttribute(element, "src"), true, false);
        }
      }),
      new ContextItem({
        text: "Copy image address",
        onClick: () => {
          navigator.clipboard.writeText(getElementAttribute(element, "src"));
        }
      }),
      new ContextItem({ separator: true })
    );
  }

  const selection = Array.from(tabStack())[0]
    .iframe.contentWindow?.getSelection()
    ?.toString();
  if (selection) {
    buttons.push(
      new ContextItem({
        text: "Copy",
        onClick: () => {
          navigator.clipboard.writeText(selection);
        }
      }),
      new ContextItem({ separator: true })
    );
  }

  if (buttons.length === 0) {
    buttons.push(
      new ContextItem({
        text: "Back",
        onClick: () => {
          Array.from(tabStack())[0].goBack();
        }
      }),
      new ContextItem({
        text: "Forward",
        onClick: () => {
          Array.from(tabStack())[0].goForward();
        }
      }),
      new ContextItem({
        text: "Reload",
        onClick: () => {
          Array.from(tabStack())[0].reload();
        }
      }),
      new ContextItem({ separator: true })
    );
  }

  buttons.push(
    new ContextItem({
      text: "View Page Source",
      onClick: () => {
        new Tab("view-source:" + Array.from(tabStack())[0].url(), true);
      }
    }),
    new ContextItem({
      text: "Inspect",
      onClick: () => {
        Array.from(tabStack())[0].setDevTools(true);
      }
    })
  );

  return buttons;
}

function isElementOfType(element: HTMLElement, type: string): boolean {
  if (element.tagName.toLowerCase() === type) {
    return true;
  } else if (element.parentElement) {
    return isElementOfType(element.parentElement, type);
  } else {
    return false;
  }
}

function getElementAttribute(element: any, attribute: string): string {
  if (element[attribute]) {
    return element[attribute];
  } else if (element.parentElement) {
    return getElementAttribute(element.parentElement, attribute);
  } else {
    return "";
  }
}

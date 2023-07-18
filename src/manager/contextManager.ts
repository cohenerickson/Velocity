import { open } from "./clickManager";
import ContextItem from "~/api/ContextItem";
import Tab from "~/api/Tab";
import { getActiveTab } from "~/util/";

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

  const selection = getActiveTab()
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
          getActiveTab().goBack();
        }
      }),
      new ContextItem({
        text: "Forward",
        onClick: () => {
          getActiveTab().goForward();
        }
      }),
      new ContextItem({
        text: "Reload",
        onClick: () => {
          getActiveTab().reload();
        }
      }),
      new ContextItem({ separator: true })
    );
  }

  buttons.push(
    new ContextItem({
      text: "View Page Source",
      onClick: () => {
        new Tab("view-source:" + getActiveTab().url(), true);
      }
    }),
    new ContextItem({
      text: "Inspect",
      onClick: () => {
        getActiveTab().setDevTools(true);
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

import Tab from "./Tab";
import EventEmitter from "events";
import { JSX } from "solid-js";
import { popups, setPopups } from "~/data/appState";

export type Text = {
  type?: "text";
  content: string | JSX.Element;
};
export type Button = {
  type?: "button";
  id: string;
  style: 0 | 1;
  text: string;
};
export type Input = {
  type?: "input";
  id: string;
};

type Component = Text | Button | Input;

export default class Popup extends EventEmitter {
  static Alert = 0;
  static Confirm = 1;
  static Prompt = 2;

  components: Component[] = [];
  linkedTab: Tab;

  constructor(tab: Tab, type?: number, content: string = "") {
    super();

    this.linkedTab = tab;

    tab.on("closed", this.close);
    tab.on("navigate", this.close);

    if (type !== undefined) {
      this.addText({
        content
      });

      if (type === Popup.Prompt) {
        this.addInput({
          id: "value"
        });
      }

      if (type !== Popup.Alert) {
        this.addButton({
          style: 0,
          text: "Ok",
          id: "ok"
        });
        this.addButton({
          style: 1,
          text: "Cancel",
          id: "cancel"
        });
      }
    }
  }

  addComponent(component: Component): void {
    this.components.push(component);
  }

  addText(textComponent: Text): void {
    textComponent.type = "text";
    this.addComponent(textComponent);
  }

  addButton(buttonComponent: Button): void {
    buttonComponent.type = "button";
    this.addComponent(buttonComponent);
  }

  addInput(inputComponent: Input): void {
    inputComponent.type = "input";
    this.addComponent(inputComponent);
  }

  push(): void {
    this.emit("open");
    setPopups([...popups(), this]);
  }

  close(): void {
    this.emit("close");
    setPopups(popups().filter((popup) => popup !== this));
  }
}

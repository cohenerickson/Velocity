import { JSX, Setter, Accessor, createSignal } from "solid-js";
import { tabs, setTabs, tabStack, setTabStack } from "~/data/appState";

export default class Tab {
  element: JSX.Element;
  #title: [Accessor<string>, Setter<string>];
  #icon: [Accessor<string>, Setter<string>];
  #focus: [Accessor<boolean>, Setter<boolean>];

  constructor(isActive?: boolean) {
    const title = createSignal<string>("New Tab");
    this.#title = title;
    const icon = createSignal<string>("./defaultIcon.png");
    this.#icon = icon;
    const focus = createSignal<boolean>(false);
    this.#focus = focus;

    setTabs([...tabs(), this]);

    this.element = (
      <div
        class={`text-white h-full ${
          this.#focus[0]() ? "bg-[#52525E]" : "hover:bg-[#35343A]"
        } w-48 p-2 flex items-center gap-2 text-xs rounded shadow-inner-lg overflow-hidden transition-all`}
        onClick={() => {
          this.focus = true;
        }}
      >
        <div
          class="w-4 h-4 bg-cover bg-no-repeat"
          style={`background-image: url("${this.#icon[0]()}")`}
        ></div>
        <div class="flex-1 overflow-hidden">
          <span>{this.#title[0]()}</span>
        </div>
        <div
          class="h-5 w-5 flex items-center justify-center hover:bg-neutral-500 opacity-50 transition-all rounded"
          onClick={this.close.bind(this)}
        >
          x
        </div>
      </div>
    );
    setTabStack(new Set([this, ...tabStack()]));

    if (isActive) {
      this.focus = true;
    }
  }

  set focus(value: boolean) {
    if (value) {
      tabs().forEach((tab) => {
        tab.focus = false;
      });
      setTabStack(new Set([this, ...tabStack()]));
    }
    this.#focus[1](value);
  }

  get focus(): boolean {
    return this.#focus[0]();
  }

  close(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (tabs().length === 1) {
      new Tab();
    }
    setTabStack(new Set(Array.from(tabStack()).filter((tab) => tab !== this)));
    setTabs(tabs().filter((tab) => tab !== this));
    Array.from(tabStack())[0].focus = true;
  }

  get title(): string {
    return this.#title[0]();
  }

  set title(title: string) {
    this.#title[1](title);
  }

  get icon(): string {
    return this.#icon[0]();
  }

  set icon(icon: string) {
    this.#icon[1](icon);
  }
}

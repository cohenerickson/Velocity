import { JSX, Setter, Accessor, createSignal, onMount } from "solid-js";
import { tabs, setTabs, tabStack, setTabStack } from "~/data/appState";
import localProto from "~/util/protocol";

export default class Tab {
  element: JSX.Element;
  iframe: HTMLIFrameElement = document.createElement("iframe");
  id: number = Math.floor(Math.random() * 1000000000000000000);
  #title: [Accessor<string>, Setter<string>];
  #icon: [Accessor<string>, Setter<string>];
  #focus: [Accessor<boolean>, Setter<boolean>];
  history: string[] = [];
  historyIndex: number = 0;

  constructor(url?: string, isActive?: boolean) {
    const title = createSignal<string>("New Tab");
    this.#title = title;
    const icon = createSignal<string>(
      "https://www.mozilla.org/media/protocol/img/logos/firefox/browser/logo.eb1324e44442.svg"
    );
    this.#icon = icon;
    const focus = createSignal<boolean>(false);
    this.#focus = focus;

    setTabs([...tabs(), this]);

    this.element = (
      <div
        class={`text-white h-full ${
          this.#focus[0]() ? "bg-[#52525E]" : "hover:bg-[#35343A]"
        } w-48 p-2 flex items-center gap-2 text-xs rounded shadow-inner-lg overflow-hidden transition-all`}
        onMouseDown={() => {
          this.focus = true;
        }}
      >
        <div
          class="w-4 h-4 bg-cover bg-no-repeat"
          style={`background-image: url("${this.#icon[0]()}")`}
        ></div>
        <div class="flex-1 overflow-hidden">
          <p
            class="text-clip whitespace-nowrap w-full"
            style="-webkit-mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);"
          >
            {this.#title[0]()}
          </p>
        </div>
        <div
          class="h-5 w-5 flex items-center justify-center hover:bg-neutral-500 opacity-50 transition-all rounded text-xs"
          onClick={this.close.bind(this)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <i class="fa-regular fa-xmark text-xs mt-[2px]"></i>
        </div>
      </div>
    );
    setTabStack(new Set([this, ...tabStack()]));

    if (isActive) {
      this.focus = true;
    }

    this.iframe.classList.add("w-full", "h-full", "border-0");
    document
      .querySelector<HTMLDivElement>("#content")
      ?.appendChild(this.iframe);

    this.navigate(url || "chrome:///newTab");
  }

  navigate(url: string) {
    const location = localProto.get(url.replace("chrome://", "")) || url;
    this.iframe.src = location;
    this.#historyPush(url);
  }

  #historyPush(url: string) {
    if (this.historyIndex !== this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    this.history.push(url);
  }

  close(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (tabs().length === 1) {
      new Tab();
    }
    document
      .querySelector<HTMLDivElement>("#content")
      ?.removeChild(this.iframe);
    setTabStack(new Set(Array.from(tabStack()).filter((tab) => tab !== this)));
    setTabs(tabs().filter((tab) => tab !== this));
    Array.from(tabStack())[0].focus = true;
  }

  set focus(value: boolean) {
    if (value) {
      tabs().forEach((tab) => {
        tab.focus = false;
        tab.iframe.classList.add("hidden");
      });
      setTabStack(new Set([this, ...tabStack()]));
      this.iframe.classList.remove("hidden");
    }
    this.#focus[1](value);
  }

  get focus(): boolean {
    return this.#focus[0]();
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

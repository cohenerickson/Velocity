import { JSX, Setter, Accessor, createSignal, onMount } from "solid-js";
import { tabs, setTabs, tabStack, setTabStack } from "~/data/appState";
import keybinds from "~/util/keybinds";
import * as urlUtil from "~/util/url";
import handleClick from "~/util/clickHandler";

interface ProxyWindow extends Window {
  __uv$location: Location;
}

export default class Tab {
  element: JSX.Element;
  iframe: HTMLIFrameElement = document.createElement("iframe");
  id: number = Math.floor(Math.random() * 1000000000000000000);
  #pinned: [Accessor<boolean>, Setter<boolean>] = createSignal<boolean>(false);
  #small: [Accessor<boolean>, Setter<boolean>] = createSignal<boolean>(false);
  #title: [Accessor<string>, Setter<string>] = createSignal<string>("");
  #url: [Accessor<string>, Setter<string>] = createSignal<string>("");
  #search: [Accessor<string | boolean>, Setter<string | boolean>] =
    createSignal<string | boolean>(false);
  #icon: [Accessor<string>, Setter<string>] = createSignal<string>("");
  #focus: [Accessor<boolean>, Setter<boolean>] = createSignal<boolean>(false);
  #loading: [Accessor<boolean>, Setter<boolean>] = createSignal<boolean>(false);
  #scrollPos: number = 0;

  constructor(url?: string, isActive?: boolean) {
    // initialize iframe
    this.iframe.classList.add("w-full", "h-full", "border-0");
    document
      .querySelector<HTMLDivElement>("#content")
      ?.appendChild(this.iframe);
    this.navigate(url || "local:///newTab");
    requestAnimationFrame(this.#updateDetails.bind(this));

    // initialize tab element
    this.element = (
      <div
        ref={this.#dragHandle.bind(this)}
        class={`text-white h-full ${
          this.#focus[0]() ? "bg-[#52525E]" : "hover:bg-[#35343A]"
        } ${
          this.#pinned[0]() || this.#small[0]() ? "" : "w-48"
        } p-2 flex items-center gap-2 text-xs rounded shadow-inner-lg overflow-hidden transition-all`}
        onMouseDown={() => {
          this.focus = true;
        }}
      >
        <div
          class={`w-4 h-4 bg-cover bg-no-repeat ${
            this.#small[0]() && this.focus ? "hidden" : ""
          }`}
          style={`background-image: url("${this.#icon[0]()}")`}
        ></div>
        <div
          class={`flex-1 overflow-hidden ${
            this.#small[0]() || this.#pinned[0]() ? "hidden" : ""
          }`}
        >
          <p
            class="text-clip whitespace-nowrap w-full"
            style="-webkit-mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);"
          >
            {this.#title[0]()}
          </p>
        </div>
        <div
          class={`h-4 w-4 flex items-center justify-center hover:bg-neutral-500 opacity-50 transition-all rounded text-xs ${
            (this.#small[0]() && !this.focus) || this.#pinned[0]()
              ? "hidden"
              : ""
          }`}
          onClick={this.close.bind(this)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <i class="fa-regular fa-xmark text-xs mt-[2px]"></i>
        </div>
      </div>
    );

    // Add tab to stack
    setTabs([...tabs(), this]);
    if (isActive) {
      this.focus = true;
      setTabStack(new Set([this, ...tabStack()]));
    } else {
      setTabStack(new Set([...tabStack(), this]));
    }
  }

  goBack() {
    this.iframe.contentWindow?.history.back();
  }

  goForward() {
    this.iframe.contentWindow?.history.forward();
  }

  pin() {}

  reload() {
    this.iframe.contentWindow?.location.reload();
  }

  stop() {
    this.loading = false;
    this.iframe.contentWindow?.stop();
  }

  navigate(query: string) {
    let url = urlUtil.generateProxyUrl(query);

    // bind events & inject scripts
    this.iframe.onload = () => {
      this.loading = false;
      this.iframe.contentWindow?.addEventListener("keydown", keybinds);
      this.iframe.contentWindow?.addEventListener("click", handleClick);
      (this.iframe.contentWindow || ({} as { open: any })).open = (
        url: string
      ) => {
        new Tab(url, true);
      };
      this.iframe.contentWindow?.addEventListener("unload", () => {
        this.loading = true;
      });
      this.iframe.contentWindow?.addEventListener("wheel", () => {
        setTimeout(() => {
          this.#scrollPos =
            this.iframe.contentDocument?.documentElement.scrollTop || 0;
        }, 0);
      });
    };

    this.loading = true;
    this.iframe.src = url;
  }

  close(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (tabs().length === 1) {
      new Tab("local://newTab", true);
    }
    document
      .querySelector<HTMLDivElement>("#content")
      ?.removeChild(this.iframe);
    setTabStack(new Set(Array.from(tabStack()).filter((tab) => tab !== this)));
    setTabs(tabs().filter((tab) => tab !== this));
    Array.from(tabStack())[0].focus = true;
  }

  #dragHandle(element: HTMLDivElement): void {}

  #updateDetails(): void {
    this.#url[1](
      urlUtil.normalize(
        (this.iframe.contentWindow as ProxyWindow)?.__uv$location?.toString() ||
          this.iframe.src
      )
    );

    this.title = this.iframe.contentDocument?.title || this.#url[0]();

    let ico = this.iframe.contentDocument?.querySelector<HTMLLinkElement>(
      "link[rel='favicon'], link[rel='shortcut icon'], link[rel='icon']"
    )?.href;
    if (ico && /^data:/.test(ico)) {
      this.icon = ico;
    } else if (ico) {
      this.icon = urlUtil.generateProxyUrl(ico);
    } else {
      this.icon = urlUtil.generateProxyUrl(
        `https://icons.duckduckgo.com/ip3/${
          new URL(this.#url[0]() || this.iframe.src).host
        }.ico`
      );
    }

    this.#url[1](
      urlUtil.normalize(
        (this.iframe.contentWindow as ProxyWindow)?.__uv$location?.toString() ||
          this.iframe.src
      )
    );

    setTimeout(this.#updateDetails.bind(this), 100);
  }

  get url(): Accessor<string> {
    return this.#url[0];
  }

  set focus(value: boolean) {
    /*
      We also need to store the scroll position for each iframe because when they get hidden and then
      un-hidden the scroll position gets reset, this seems to be a bug with browsers and not a result
      of the code here.
    */
    if (value) {
      tabs().forEach((tab) => {
        tab.focus = false;
        tab.iframe.classList.add("hidden");
      });
      setTabStack(new Set([this, ...tabStack()]));
      this.iframe.classList.remove("hidden");
      (
        this.iframe.contentDocument || ({ documentElement: {} } as Document)
      ).documentElement.scrollTop = this.#scrollPos;
    }
    this.#focus[1](value);
  }

  get focus(): boolean {
    return this.#focus[0]();
  }

  get search(): Accessor<string | boolean> {
    return this.#search[0];
  }

  set search(value: string | boolean | Accessor<string | boolean>) {
    this.#search[1](value);
  }

  get pinned(): boolean {
    return this.#pinned[0]();
  }

  set pinned(value: boolean) {
    this.#pinned[1](value);
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

  get loading(): Accessor<boolean> {
    return this.#loading[0];
  }

  set loading(value: boolean | Accessor<boolean>) {
    this.#loading[1](value);
  }
}

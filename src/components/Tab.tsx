import { JSX, Setter, Accessor, createSignal, Show } from "solid-js";
import {
  tabs,
  setTabs,
  tabStack,
  setTabStack,
  bookmarks,
  setBookmarks
} from "~/data/appState";
import keybinds from "~/util/keybinds";
import * as urlUtil from "~/util/url";
import handleClick from "~/util/clickHandler";
import Favicon from "./Favicon";
import { BookmarkType } from "~/types/Bookmarks";

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
  #loading: [Accessor<boolean>, Setter<boolean>] = createSignal<boolean>(true);
  #playing: [Accessor<boolean>, Setter<boolean>] = createSignal<boolean>(false);
  #scrollPos: number = 0;

  constructor(url?: string, isActive?: boolean) {
    // initialize iframe
    this.iframe.classList.add("w-full", "h-full", "border-0");
    if (!isActive) this.iframe.classList.add("hidden");
    document
      .querySelector<HTMLDivElement>("#content")
      ?.appendChild(this.iframe);
    this.#injectScripts();
    this.navigate(url || "about:newTab");
    requestAnimationFrame(this.#updateDetails.bind(this));

    // initialize tab element
    this.element = (
      <div
        ref={this.#dragHandle.bind(this)}
        class={`text-[#FBFBFE] h-9 ${
          this.#focus[0]() ? "bg-[#42414D]" : "hover:bg-[#35343A]"
        } ${
          this.#pinned[0]() || this.#small[0]() ? "" : "w-48"
        } p-2 pr-1 flex items-center gap-[5px] text-sm rounded shadow-inner-lg overflow-hidden transition-all`}
        onMouseDown={() => {
          this.focus = true;
        }}
      >
        <div class="w-4 h-4">
          <Show when={this.loading()}>
            <div class="w-4 h-4 overflow-hidden">
              <div class="loading-animation w-[960px] h-4 bg-white"></div>
            </div>
          </Show>
          <Show when={!this.loading()}>
            <div
              class={`h-full w-full ${
                this.#small[0]() && this.#focus[0]() ? "hidden" : ""
              }`}
            >
              <Favicon src={this.#icon[0]} />
            </div>
          </Show>
        </div>
        <Show when={this.#playing[0]()}>
          <i class="text-[10px] fa-regular fa-volume mt-[2px]"></i>
        </Show>
        <div
          class={`flex-1 overflow-hidden ${
            this.#small[0]() || this.#pinned[0]() ? "hidden" : ""
          }`}
        >
          <p
            class="text-clip whitespace-nowrap w-full text-xs font-light"
            style="-webkit-mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);"
          >
            {this.#title[0]()}
          </p>
        </div>
        <div
          class={`h-6 w-6 flex items-center justify-center hover:bg-neutral-500 hover:bg-opacity-50 transition-all rounded ${
            (this.#small[0]() && !this.focus) || this.#pinned[0]()
              ? "hidden"
              : ""
          }`}
          onClick={this.close.bind(this)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <i class="fa-light fa-xmark text-[10px] mt-[2px] text-white"></i>
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
    };

    this.iframe.src = url;
  }

  close(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (tabs().length === 1) {
      new Tab("about:newTab", true);
    }
    document
      .querySelector<HTMLDivElement>("#content")
      ?.removeChild(this.iframe);
    setTabStack(new Set(Array.from(tabStack()).filter((tab) => tab !== this)));
    setTabs(tabs().filter((tab) => tab !== this));
    Array.from(tabStack())[0].focus = true;
  }

  bookmark() {
    const marks = Array.from(bookmarks()) as BookmarkType[];

    if (!marks.find((x) => x.url === this.#url[0]())) {
      marks.push({
        type: "bookmark",
        name: this.#title[0](),
        url: this.#url[0](),
        icon: this.#icon[0]()
      });

      setBookmarks(new Set(marks));
    }
  }

  #injectScripts() {
    this.iframe.contentWindow?.addEventListener("keydown", keybinds);
    this.iframe.contentWindow?.addEventListener("click", handleClick);
    (this.iframe.contentWindow || ({} as { open: any })).open = (
      url: string
    ) => {
      const tab = new Tab(url, true);
      return tab.iframe.contentWindow;
    };
    this.iframe.contentWindow?.addEventListener("unload", () => {
      setTimeout(() => {
        this.#injectScripts();
      });
      this.loading = true;
    });
    this.iframe.contentWindow?.addEventListener("wheel", () => {
      setTimeout(() => {
        this.#scrollPos =
          this.iframe.contentDocument?.documentElement.scrollTop || 0;
      });
    });
  }

  #dragHandle(element: HTMLDivElement): void {
    // Implement dragging
  }

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
      this.icon = ico;
    } else {
      this.icon = `https://icons.duckduckgo.com/ip3/${
        new URL(this.#url[0]() || this.iframe.src).host
      }.ico`;
    }

    this.#url[1](
      urlUtil.normalize(
        (this.iframe.contentWindow as ProxyWindow)?.__uv$location?.toString() ||
          this.iframe.src
      )
    );

    const media: (HTMLAudioElement | HTMLVideoElement)[] = Array.from(
      this.iframe.contentDocument?.querySelectorAll<
        HTMLAudioElement | HTMLVideoElement
      >("audio, video") ?? []
    );
    this.playing = media.some((x) => !x.paused && !x.muted);

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

  set playing(value: boolean | Accessor<boolean>) {
    this.#playing[1](value);
  }

  get small(): Accessor<boolean> {
    return this.#small[0];
  }
}

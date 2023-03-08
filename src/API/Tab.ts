import Bookmark from "./Bookmark";
import type ContextItem from "./ContextItem";
import { createSignal } from "solid-js";
import type { Accessor, Setter } from "solid-js";
import { bindIFrameMousemove } from "~/components/ContextMenu";
import { setTabStack, setTabs, tabStack, tabs } from "~/data/appState";
import handleClick from "~/util/clickHandler";
import generateContextButtons from "~/util/generateContextButtons";
import getManifest from "~/util/getManifest";
import keybinds from "~/util/keybindManager";
import * as urlUtil from "~/util/url";

interface ProxyWindow extends Window {
  __uv$location: Location;
}

export default class Tab {
  iframe: HTMLIFrameElement = document.createElement("iframe");
  id: number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  historyId: number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
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
    this.#cleanup();
    setTabStack(new Set(Array.from(tabStack()).filter((tab) => tab !== this)));
    setTabs(tabs().filter((tab) => tab !== this));
    Array.from(tabStack())[0].focus = true;
  }

  bookmark() {
    new Bookmark({
      name: this.#title[0](),
      url: this.#url[0](),
      icon: this.#icon[0]()
    });
  }

  executeScript(script: string): any {
    return this.iframe.contentWindow?.window.eval(script);
  }

  setDevTools(state?: boolean) {
    const iframeWindow = this.iframe.contentWindow as Window & { eruda: any };
    if (!iframeWindow.eruda) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/eruda";
      script.onload = () => {
        this.setDevTools(state);
      };
      this.iframe.contentDocument?.body.appendChild(script);
      return;
    }

    if (!iframeWindow.eruda._isInit) iframeWindow.eruda.init();

    const btnBk = iframeWindow.eruda._entryBtn._$el[0].cloneNode(true);
    btnBk.style.display = "none";
    iframeWindow.eruda._entryBtn._$el[0].parentElement.replaceChild(
      btnBk,
      iframeWindow.eruda._entryBtn._$el[0]
    );
    btnBk.onclick = () => {
      btnBk.style.display = "none";
      iframeWindow.eruda.hide();
    };
    iframeWindow.eruda._entryBtn._$el[0] = btnBk;

    if (state) {
      btnBk.style.display = "flex";
      iframeWindow.eruda.show();
    } else {
      if (
        state !== undefined ||
        iframeWindow.eruda._shadowRoot.querySelector(".eruda-dev-tools").style
          .display !== "none"
      ) {
        btnBk.style.display = "none";
        iframeWindow.eruda.hide();
      } else {
        btnBk.style.display = "flex";
        iframeWindow.eruda.show();
      }
    }
  }

  #cleanup() {
    document
      .querySelector<HTMLDivElement>("#content")
      ?.removeChild(this.iframe);
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
    (this.iframe.contentWindow || ({} as { close: any })).close = () => {
      this.close();
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
    this.iframe.contentWindow?.addEventListener(
      "contextmenu",
      (event: Event & { data?: ContextItem[] }) => {
        if (event.target)
          event.data = generateContextButtons(event.target as HTMLElement);
      }
    );
    this.iframe.contentWindow?.addEventListener("load", async () => {
      this.setDevTools(false);
      const history = await window.Velocity.history.get();
      if (
        !history.find((x) => {
          const id = x.id === this.historyId;
          const url = urlUtil.areEqual(x.url, this.url());
          return id && url;
        })
      )
        this.historyId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      window.Velocity.history.add(this);
      if (window.Velocity && window.Velocity.postManifest) {
        const manifest =
          this.iframe.contentDocument?.querySelector<HTMLLinkElement>(
            "link[rel='manifest']"
          )?.href;
        if (manifest) {
          getManifest(manifest, this.url());
        }
      }
    });
    bindIFrameMousemove(this.iframe);

    if (this.iframe.contentWindow) {
      const tab = this;
      this.iframe.contentWindow.history.pushState = new Proxy(
        this.iframe.contentWindow.history.pushState,
        {
          apply(target, thisArg, argArray) {
            setTimeout(() => {
              tab.historyId = Math.floor(
                Math.random() * Number.MAX_SAFE_INTEGER
              );
              window.Velocity.history.add(tab);
            });
            return Reflect.apply(target, thisArg, argArray);
          }
        }
      );

      this.iframe.contentWindow.history.replaceState = new Proxy(
        this.iframe.contentWindow.history.replaceState,
        {
          apply(target, thisArg, argArray) {
            setTimeout(() => {
              window.Velocity.history.add(tab);
            });
            return Reflect.apply(target, thisArg, argArray);
          }
        }
      );
    }
  }

  #updateDetails(): void {
    this.#url[1](
      urlUtil.normalize(
        (this.iframe.contentWindow as ProxyWindow)?.__uv$location?.toString() ||
          this.iframe.src
      )
    );

    this.title = this.iframe.contentDocument?.title || this.#url[0]();

    const icons =
      this.iframe.contentDocument?.head.querySelectorAll<HTMLLinkElement>(
        "link[rel='favicon'], link[rel='shortcut icon'], link[rel='icon']"
      );
    const ico = icons?.[icons.length - 1]?.href;

    if (ico && /^data:/.test(ico)) {
      this.icon = ico;
    } else if (ico) {
      this.icon = ico;
    } else {
      this.icon = "/icons/earth.svg";
    }

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

  set focus(value: boolean | Accessor<boolean>) {
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

  get focus(): Accessor<boolean> {
    return this.#focus[0];
  }

  get search(): Accessor<string | boolean> {
    return this.#search[0];
  }

  set search(value: string | boolean | Accessor<string | boolean>) {
    this.#search[1](value);
  }

  get pinned(): Accessor<boolean> {
    return this.#pinned[0];
  }

  set pinned(value: boolean | Accessor<boolean>) {
    this.#pinned[1](value);
  }

  get title(): Accessor<string> {
    return this.#title[0];
  }

  set title(title: string | Accessor<string>) {
    this.#title[1](title);
  }

  get icon(): Accessor<string> {
    return this.#icon[0];
  }

  set icon(icon: string | Accessor<string>) {
    this.#icon[1](icon);
  }

  get loading(): Accessor<boolean> {
    return this.#loading[0];
  }

  set loading(value: boolean | Accessor<boolean>) {
    this.#loading[1](value);
  }

  get playing(): Accessor<boolean> {
    return this.#playing[0];
  }

  set playing(value: boolean | Accessor<boolean>) {
    this.#playing[1](value);
  }

  get small(): Accessor<boolean> {
    return this.#small[0];
  }
}

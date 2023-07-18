import { registerTab } from "./runtimeManager";
import type ContextItem from "~/api/ContextItem";
import Tab from "~/api/Tab";
import { bindIFrameMousemove } from "~/components/ContextMenu";
import handleClick from "~/manager/clickManager";
import generateContextButtons from "~/manager/contextManager";
import keybind from "~/manager/keybindManager";
import xenosPostManifest from "~/manager/xenosManager";
import * as urlUtil from "~/util/url";

export function register(tab: Tab): void {
  registerEvents(tab);
  registerTab(tab);
}

function registerEvents(tab: Tab): void {
  tab.iframe.contentWindow?.addEventListener("keydown", keybind);
  tab.iframe.contentWindow?.addEventListener("click", handleClick);
  (tab.iframe.contentWindow || ({} as { open: any })).open = (url: string) => {
    const tab = new Tab(url, true);
    return tab.iframe.contentWindow;
  };
  (tab.iframe.contentWindow || ({} as { close: any })).close = () => {
    tab.close();
  };
  tab.iframe.contentWindow?.addEventListener("unload", () => {
    setTimeout(() => {
      registerEvents(tab);
      tab.updateStorage();
      tab.emit("document_start", normalizeURL(tab.url()));
    });
    tab.loading = true;
  });
  tab.iframe.contentWindow?.addEventListener("wheel", () => {
    setTimeout(() => {
      tab.scrollPos =
        tab.iframe.contentDocument?.documentElement.scrollTop || 0;
    });
  });
  tab.iframe.contentWindow?.addEventListener(
    "contextmenu",
    (event: Event & { data?: ContextItem[] }) => {
      if (event.target)
        event.data = generateContextButtons(event.target as HTMLElement);
    }
  );
  tab.iframe.contentWindow?.addEventListener("DOMContentLoaded", () => {
    injectHistory(tab);
    tab.emit("document_end", normalizeURL(tab.url()));
  });
  tab.iframe.contentWindow?.addEventListener("load", async () => {
    tab.setDevTools(false);
    tab.emit("document_idle", normalizeURL(tab.url()));
    if ("Velocity" in window) {
      const history = await window.Velocity.history.get();
      if (
        !history.find((x) => {
          const id = x.id === tab.historyId;
          const url = urlUtil.areEqual(x.url, tab.url());
          return id && url;
        })
      )
        tab.historyId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      window.Velocity.history.add(tab);
    }
    if ("xen" in window) {
      const manifest =
        tab.iframe.contentDocument?.querySelector<HTMLLinkElement>(
          "link[rel='manifest']"
        )?.href;
      if (manifest) {
        xenosPostManifest(manifest, tab.url());
      }
    }
  });

  (tab.iframe.contentWindow || ({} as { open: any })).open = (url: string) => {
    const tab = new Tab(url, true);
    return tab.iframe.contentWindow;
  };
  (tab.iframe.contentWindow || ({} as { close: any })).close = () => {
    tab.close();
  };

  bindIFrameMousemove(tab.iframe);
}

function injectHistory(tab: Tab): void {
  if (tab.iframe.contentWindow) {
    tab.iframe.contentWindow.history.pushState = new Proxy(
      tab.iframe.contentWindow.history.pushState,
      {
        apply(target, tabArg, argArray) {
          setTimeout(() => {
            tab.historyId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            window.Velocity.history.add(tab);
          });
          return Reflect.apply(target, tabArg, argArray);
        }
      }
    );
    tab.iframe.contentWindow.history.replaceState = new Proxy(
      tab.iframe.contentWindow.history.replaceState,
      {
        apply(target, tabArg, argArray) {
          setTimeout(() => {
            window.Velocity.history.add(tab);
          });
          return Reflect.apply(target, tabArg, argArray);
        }
      }
    );
  }
}

function normalizeURL(url: string): string {
  try {
    return new URL(url).toString();
  } catch {
    return url;
  }
}

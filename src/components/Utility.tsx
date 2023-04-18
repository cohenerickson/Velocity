import { JSX, Signal, createEffect, createSignal } from "solid-js";
import { KeybindQuery } from "~/API/Keybind";
import Tab from "~/API/Tab";
import Velocity from "~/API/index";
import { bookmarks, bookmarksShown, setBookmarksShown } from "~/data/appState";
import { engines, preferences } from "~/util/";
import { getActiveTab } from "~/util/";
import * as urlUtil from "~/util/url";

export default function Utility(): JSX.Element {
  function reload() {
    if (getActiveTab()?.loading()) {
      getActiveTab()?.stop();
    } else {
      getActiveTab().search = false;
      getActiveTab()?.reload();
    }
  }

  function forward() {
    getActiveTab().search = false;
    getActiveTab()?.goForward();
  }

  function back() {
    getActiveTab().search = false;
    getActiveTab()?.goBack();
  }

  function urlBar(element: HTMLInputElement) {
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (element.value) {
          getActiveTab()?.navigate(element.value);
          getActiveTab().search = false;
          element.blur();
        }
      } else if (event.key === "Escape") {
        getActiveTab().search = false;
        element.blur();
      } else {
        setTimeout(() => (getActiveTab().search = element.value), 0);
      }
    });
  }
  let menu = createSignal<keyof typeof menus | null>(null);
  let submenuStack: (keyof typeof menus)[] = [];

  let MenuItem = (
    enabled: boolean,
    left: JSX.Element,
    right: JSX.Element,
    onClick: ((event: MouseEvent) => any) | (() => any) = () => {}
  ) => (
    <div
      class={`w-full ${
        enabled
          ? "hover:bg-[#52525E] text-white"
          : "pointer-events-none text-neutral-500"
      } px-2 flex flex-row items-center h-8 cursor-default select-none rounded pt-[0.15rem]`}
      onClick={(e) => (!!(onClick(e) ?? true) ? closeMenu() : null)}
    >
      <div class="grow flex flex-row items-center">{left}</div>
      <div>{right}</div>
    </div>
  );

  let menus: {
    [k in [
      "main",
      "bookmarks",
      "history",
      "tools",
      "help"
    ][number]]: Signal<JSX.Element>;
  } = {
    main: createSignal<JSX.Element>(""),
    bookmarks: createSignal<JSX.Element>(""),
    history: createSignal<JSX.Element>(""),
    tools: createSignal<JSX.Element>(""),
    help: createSignal<JSX.Element>("")
  };

  let SubmenuMenuItem = (
    enabled: boolean,
    left: JSX.Element,
    target: keyof typeof menus
  ) =>
    MenuItem(enabled, left, <i class="fa-light fa-chevron-right"></i>, () => {
      submenuStack.push(target);
      menu[1](target);
      return false; // prevent menu from auto-closing
    });

  let KeybindMenuItem = (
    enabled: boolean,
    left: JSX.Element,
    query: KeybindQuery
  ) =>
    MenuItem(enabled, left, Velocity.getKeybind(query)?.toString(), () => {
      closeMenu();
      Velocity.getKeybind(query)?.callback();
    });

  let MenuSeparator = (title: JSX.Element = null) => (
    <>
      <hr class="border-neutral-500 my-1" />
      {title !== null ? (
        <div class="mt-1 mb-2 px-2 select-none text-xs text-neutral-500">
          {title}
        </div>
      ) : (
        <></>
      )}
    </>
  );

  let Menu = (id: keyof typeof menus, ...children: JSX.Element[]) => (
    <div
      class={`h-fit w-full grid row-start-1 col-start-1 ${
        menu[0]() === id ? "display" : "hidden"
      }`}
    >
      {...children}
    </div>
  );

  let SubmenuHeader = (title: JSX.Element) => (
    <>
      <div class="text-white relative bottom-0.5 flex flex-row items-center justify-center h-10 cursor-default select-none">
        <div class="absolute left-0 flex items-center h-full w-8">
          <div
            class="flex items-center justify-center hover:bg-[#52525E] rounded h-8 w-8"
            onClick={() => {
              submenuStack.pop();
              menu[1](submenuStack[submenuStack.length - 1]);
            }}
          >
            <i class="fa-light fa-chevron-left"></i>
          </div>
        </div>
        <div class="h-full flex flex-row items-center">
          <div class="h-full flex flex-row justify-center items-center font-bold">
            {title}
          </div>
        </div>{" "}
      </div>
      {MenuSeparator()}
    </>
  );

  function closeMenu() {
    menu[1](null);
    submenuStack = [];
  }

  createEffect(() => {
    menus.main[1](
      Menu(
        "main",
        KeybindMenuItem(true, "New tab", { alias: "new_tab" }),
        KeybindMenuItem(false, "New window", { alias: "new_window" }),

        MenuSeparator(),

        SubmenuMenuItem(true, "Bookmarks", "bookmarks"),
        SubmenuMenuItem(true, "History", "history"),

        KeybindMenuItem(false, "Downloads", { alias: "open_downloads" }),
        MenuItem(false, "Passwords", null, () => {}),
        KeybindMenuItem(false, "Add-ons and themes", { alias: "open_addons" }),

        MenuSeparator(),

        KeybindMenuItem(false, "Print...", { alias: "print_page" }),
        KeybindMenuItem(false, "Save page as...", { alias: "save_page" }),
        KeybindMenuItem(false, "Find in page...", { alias: "search_page" }),

        MenuItem(false, "Zoom", null, () => {}),

        MenuSeparator(),

        MenuItem(
          true,
          "Settings",
          null,
          () => new Tab("about:preferences", true)
        ),
        SubmenuMenuItem(true, "More tools", "tools"),
        SubmenuMenuItem(false, "Help", "help"),

        MenuSeparator(),

        MenuItem(false, "Quit", null, () => {})
      )
    );
  });

  createEffect(() => {
    menus.bookmarks[1](
      Menu(
        "bookmarks",
        SubmenuHeader("Bookmarks"),
        KeybindMenuItem(false, "Bookmark current tab", {
          alias: "bookmark_tab"
        }),
        MenuItem(false, "Search bookmarks", null, () => {}),
        MenuItem(
          true,
          <>
            {bookmarksShown()
              ? "Hide bookmarks toolbar"
              : "Show bookmarks toolbar"}
          </>,
          null,
          () => {
            setBookmarksShown(!bookmarksShown());
          }
        ),

        bookmarks().length > 0 ? (
          <>
            {MenuSeparator("Recent Bookmarks")}
            {...bookmarks().map((bookmark) =>
              MenuItem(
                true,
                <>
                  <div class="w-4 h-4 mb-0.5 mr-2 flex flex-row items-center">
                    <img src={bookmark.icon} />
                  </div>
                  <div>{bookmark.name}</div>
                </>,
                null,
                () => new window.parent.Velocity.Tab(bookmark.url, true)
              )
            )}
          </>
        ) : null,

        MenuSeparator(),

        MenuItem(
          true,
          "Manage Bookmarks",
          null,
          () => new Tab("about:bookmarks", true)
        )
      )
    );
  });

  let menuContainer: HTMLDivElement | undefined;
  return (
    <div class="flex items-center gap-2 w-full h-10 p-2" id="browser-toolbar">
      <div class="flex gap-1 items-center">
        <div
          class="toolbarbutton-1 h-8 w-8 rounded flex items-center justify-center"
          onClick={back}
        >
          <i class="fa-light fa-arrow-left mt-[2px]"></i>
        </div>
        <div
          class="toolbarbutton-1 h-8 w-8 rounded flex items-center justify-center"
          onClick={forward}
        >
          <i class="fa-light fa-arrow-right mt-[2px]"></i>
        </div>
        <div
          class="toolbarbutton-1 h-8 w-8 rounded flex items-center justify-center"
          onClick={reload}
        >
          <i
            class={`fa-light ${
              getActiveTab()?.loading() ? "fa-xmark" : "fa-rotate-right"
            } mt-[2px]`}
          ></i>
        </div>
      </div>
      <div
        class="flex items-center flex-1 h-[32px] text-sm rounded"
        id="urlbar"
      >
        <div class="flex h-8 w-8 rounded items-center justify-center mx-[2px]">
          <i class="fa-light fa-magnifying-glass mt-[2px]"></i>
        </div>
        <input
          ref={urlBar}
          id="url_bar"
          autocomplete="off"
          class="flex-1 flex items-center leading-8 h-full text-sm rounded bg-transparent focus:outline-none"
          value={
            getActiveTab()?.search() !== false
              ? (getActiveTab()?.search() as string)
              : urlUtil.normalize(getActiveTab()?.url() || "")
          }
          placeholder={`Search with ${
            engines[preferences()["search.defaults.searchEngine"] || "google"]
              .name
          } or enter address`}
        ></input>
      </div>
      <div class="flex gap-1 items-center">
        <a
          target="_blank"
          href="https://github.com/cohenerickson/Velocity"
          class="cursor-default"
        >
          <div class="toolbarbutton-1 h-8 w-8 rounded flex items-center justify-center">
            <i class="fa-brands fa-github mt-[2px] text-sm"></i>
          </div>
        </a>

        <div
          class="toolbarbutton-1 relative h-8 w-8 rounded flex items-center justify-center"
          onClick={(e) => {
            if (menuContainer?.contains(e.target as Node)) return;
            menu[1]((m) => (m === null ? "main" : null));
            submenuStack.push("main");
          }}
        >
          <i class="fa-light fa-bars mt-[2px] text-sm"></i>
          {menu[0]() !== null ? (
            <>
              <div
                class="fixed w-full h-full top-0 left-0"
                onPointerDown={() => closeMenu()}
              ></div>

              <div
                ref={menuContainer}
                class="top-9 right-0.5 display w-[22rem] text-[0.9rem] bg-[#222229] shadow-lg rounded-lg border border-[#161616] px-2 py-2 z-30 absolute grid grid-cols-[1fr]"
              >
                {...Object.values(menus).map((m) => m[0]())}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}


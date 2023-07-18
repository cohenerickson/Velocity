import createMenu from "./AppMenu";
import { JSX, createEffect, createSignal } from "solid-js";
import Tab from "~/api/Tab";
import Velocity from "~/api/index";
import { bookmarks, bookmarksShown, setBookmarksShown } from "~/data/appState";
import HistoryEntry from "~/types/HistoryEntry";
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
  let {
    element: menu,
    container: menuContainer,
    close: closeMenu,
    current: currentMenu,
    stack: submenuStack,
    submenus: submenus,
    Menu,
    MenuItem,
    KeybindMenuItem,
    SubmenuMenuItem,
    MenuSeparator,
    SubmenuHeader
  } = createMenu([
    "main",
    "bookmarks",
    "history",
    "tools",
    "help",
    "recentTabs",
    "recentWindows"
  ]);

  createEffect(() => {
    submenus.main[1](
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
    submenus.bookmarks[1](
      Menu(
        "bookmarks",
        SubmenuHeader("Bookmarks"),
        <div class="grow">
          <div class="h-full w-full">
            {KeybindMenuItem(true, "Bookmark current tab", {
              alias: "bookmark_tab"
            })}
            {MenuItem(false, "Search bookmarks", null, () => {})}
            {MenuItem(
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
            )}
            {MenuSeparator("Recent Bookmarks")}
            {bookmarks().length > 0
              ? bookmarks().map((bookmark) =>
                  MenuItem(
                    true,
                    <>
                      <div class="mb-0.5 mr-2 flex h-4 w-4 flex-row items-center">
                        <img src={bookmark.icon} />
                      </div>
                      <div>{bookmark.title}</div>
                    </>,
                    null,
                    () => new window.parent.Velocity.Tab(bookmark.url, true)
                  )
                )
              : MenuItem(
                  false,
                  "(Empty)",
                  null,
                  () => {},
                  "pointer-events-none"
                )}
          </div>
        </div>,

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

  const HISTORY_SUBMENU_RECENCY: number = 864e5; // 1 day
  const HISTORY_SUBMENU_MAX_ENTRIES: number = 10;
  let historyEntries = createSignal<HistoryEntry[]>([]);
  createEffect(() => {
    if (currentMenu[0]() === "history")
      Velocity.history.get().then((history) => {
        let timestamp = Date.now();
        historyEntries[1](
          history
            .filter(
              (entry) =>
                Math.abs(timestamp - entry.timestamp) <= HISTORY_SUBMENU_RECENCY
            )
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, HISTORY_SUBMENU_MAX_ENTRIES)
        );
      });
    submenus.history[1](
      Menu(
        "history",
        SubmenuHeader("History"),
        <div class="grow">
          <div class="h-full w-full">
            {SubmenuMenuItem(false, "Recently closed tabs", "recentTabs")}
            {SubmenuMenuItem(false, "Recently closed windows", "recentWindows")}
            {MenuItem(false, "Restore previous session", null, () => {})}
            {MenuSeparator()}
            {/* reenable this after a clear data popup with time constraints is implemented */}
            {MenuItem(false, "Clear Recent History", null, () => {})}

            {MenuSeparator("Recent History")}
            {historyEntries[0]().length > 0
              ? historyEntries[0]().map((entry) =>
                  MenuItem(
                    true,
                    <>
                      <div class="mb-0.5 mr-2 flex h-4 w-4 flex-row items-center">
                        <img src={entry.favicon} />
                      </div>
                      <div>{entry.title}</div>
                    </>,
                    null,
                    () => new window.parent.Velocity.Tab(entry.url, true)
                  )
                )
              : MenuItem(
                  false,
                  "(Empty)",
                  null,
                  () => {},
                  "pointer-events-none"
                )}
          </div>
        </div>,

        MenuSeparator(),

        MenuItem(
          true,
          "Manage History",
          null,
          () => new Tab("about:history", true)
        )
      )
    );
  });

  createEffect(() => {
    submenus.tools[1](
      Menu(
        "tools",
        SubmenuHeader("More Tools"),

        MenuItem(false, "Customize toolbar...", null, () => {}),

        MenuSeparator("Browser tools"),

        KeybindMenuItem(true, "Web Developer Tools", {
          alias: "open_devtools"
        }),
        MenuItem(false, "Task Manager", null, () => {}),
        MenuItem(false, "Remote Debugging", null, () => {}),
        MenuItem(false, "Browser Console", null, () => {}),
        MenuItem(false, "Responsive Debugging", null, () => {}),
        MenuItem(false, "Eyedropper", null, () => {}),
        KeybindMenuItem(true, "Page Source", {
          alias: "view_source"
        }),
        MenuItem(false, "Extensions for developers", null, () => {})
      )
    );
  });

  return (
    <div class="flex h-10 w-full items-center gap-2 p-2" id="browser-toolbar">
      <div class="flex items-center gap-1">
        <div
          class="toolbarbutton-1 flex h-8 w-8 items-center justify-center rounded"
          onClick={back}
        >
          <i class="fa-light fa-arrow-left mt-[2px]"></i>
        </div>
        <div
          class="toolbarbutton-1 flex h-8 w-8 items-center justify-center rounded"
          onClick={forward}
        >
          <i class="fa-light fa-arrow-right mt-[2px]"></i>
        </div>
        <div
          class="toolbarbutton-1 flex h-8 w-8 items-center justify-center rounded"
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
        class="flex h-[32px] flex-1 items-center rounded text-sm"
        id="urlbar"
      >
        <div class="mx-[2px] flex h-8 w-8 items-center justify-center rounded">
          <i class="fa-light fa-magnifying-glass mt-[2px]"></i>
        </div>
        <input
          ref={urlBar}
          id="url_bar"
          autocomplete="off"
          class="flex h-full flex-1 items-center rounded bg-transparent text-sm leading-8 focus:outline-none"
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
      <div class="flex items-center gap-1">
        <a
          target="_blank"
          aria-label="View source code on GitHub."
          href="https://github.com/cohenerickson/Velocity"
          class="cursor-default"
        >
          <div class="toolbarbutton-1 flex h-8 w-8 items-center justify-center rounded">
            <i class="fa-brands fa-github mt-[2px] text-sm"></i>
          </div>
        </a>

        <div
          class="toolbarbutton-1 relative flex h-8 w-8 items-center justify-center rounded"
          onClick={(e) => {
            if (menuContainer.contains(e.target as Node)) return;
            currentMenu[1]((m) => (m === null ? "main" : null));
            submenuStack.push("main");
          }}
        >
          <i class="fa-light fa-bars mt-[2px] text-sm"></i>
          {menu}
        </div>
      </div>
    </div>
  );
}

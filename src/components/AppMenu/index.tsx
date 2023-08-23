import { createSignal, JSX, Signal } from "solid-js";
import { KeybindQuery } from "~/api/Keybind";

export default function createMenu(this: any, names: string[]) {
  let current = createSignal<string | null>(null);
  let stack: string[] = [];

  let MenuItem = (
    enabled: boolean,
    left: JSX.Element,
    right: JSX.Element,
    onClick: ((event: MouseEvent) => any) | (() => any) = () => {},
    classes: string = ""
  ) => (
    <div
      class={`popup-button flex h-8 w-full cursor-default select-none flex-row items-center rounded px-2 pt-[0.15rem] text-[12px] ${classes}`}
      onClick={(e) => {
        if (enabled) {
          if (onClick(e) ?? true) {
            close();
          }
        }
      }}
      data-disabled={!enabled}
    >
      <div class="flex grow flex-row items-center">{left}</div>
      <div>{right}</div>
    </div>
  );

  let submenus: {
    [k: string]: Signal<JSX.Element>;
  } = Object.fromEntries(
    names.map((name) => [name, createSignal<JSX.Element>(null)])
  );

  let SubmenuMenuItem = (enabled: boolean, left: JSX.Element, target: string) =>
    MenuItem(enabled, left, <i class="fa-light fa-chevron-right"></i>, () => {
      stack.push(target);
      current[1](target);
      return false; // prevent menu from auto-closing
    });

  let KeybindMenuItem = (
    enabled: boolean,
    left: JSX.Element,
    query: KeybindQuery
  ) =>
    MenuItem(enabled, left, Velocity.getKeybind(query)?.toString(), () => {
      close();
      Velocity.getKeybind(query)?.callback();
    });

  let MenuSeparator = (title: JSX.Element = null) => (
    <>
      <hr class="my-1" />
      {title !== null ? (
        <div class="appmenu-separator-title my-1 select-none px-2 text-xs">
          {title}
        </div>
      ) : (
        <></>
      )}
    </>
  );

  let Menu = (id: string, ...children: JSX.Element[]) => (
    <div
      class={`col-start-1 row-start-1 flex h-full w-full flex-col ${
        current[0]() === id ? "" : "hidden"
      }`}
    >
      {...children}
    </div>
  );

  let SubmenuHeader = (title: JSX.Element) => (
    <>
      <div class="relative bottom-0.5 flex h-10 cursor-default select-none flex-row items-center justify-center">
        <div class="absolute left-0 flex h-full w-8 items-center">
          <div
            class="popup-button flex h-8 w-8 items-center justify-center rounded"
            onClick={() => {
              stack.pop();
              current[1](stack[stack.length - 1]);
            }}
          >
            <i class="fa-light fa-chevron-left"></i>
          </div>
        </div>
        <div class="flex h-full flex-row items-center">
          <div class="flex h-full flex-row items-center justify-center font-bold">
            {title}
          </div>
        </div>{" "}
      </div>
      {MenuSeparator()}
    </>
  );

  function close() {
    current[1](null);
    stack = ["main"];
  }
  let container: HTMLDivElement = (
    <div class="popup absolute right-0.5 top-9 z-30 grid w-72 grid-cols-[1fr] rounded-lg border px-2 py-2 text-[0.9rem]">
      {...Object.values(submenus).map((m) => m[0]())}
    </div>
  ) as HTMLDivElement;

  return {
    container,
    element: (
      <>
        {current[0]() !== null ? (
          <>
            <div
              class="fixed left-0 top-0 h-full w-full"
              onPointerDown={() => close()}
            ></div>

            {container}
          </>
        ) : null}
      </>
    ),
    close,
    current,
    stack,
    submenus,
    Menu,
    MenuItem,
    KeybindMenuItem,
    SubmenuMenuItem,
    MenuSeparator,
    SubmenuHeader
  };
}

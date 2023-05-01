import { createSignal, JSX, onMount, Signal } from "solid-js";
import { KeybindQuery } from "~/API/Keybind";

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
      class={`popup-button text-[12px] w-full px-2 flex flex-row items-center h-8 cursor-default select-none rounded pt-[0.15rem] ${classes}`}
      onClick={(e) => {
        if (enabled) {
          if (onClick(e) ?? true) {
            close();
          }
        }
      }}
      data-disabled={!enabled}
    >
      <div class="grow flex flex-row items-center">{left}</div>
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
        <div class="my-1 px-2 select-none text-xs appmenu-separator-title">
          {title}
        </div>
      ) : (
        <></>
      )}
    </>
  );

  let Menu = (id: string, ...children: JSX.Element[]) => (
    <div
      class={`h-full w-full flex flex-col row-start-1 col-start-1 ${
        current[0]() === id ? "" : "hidden"
      }`}
    >
      {...children}
    </div>
  );

  let SubmenuHeader = (title: JSX.Element) => (
    <>
      <div class="relative bottom-0.5 flex flex-row items-center justify-center h-10 cursor-default select-none">
        <div class="absolute left-0 flex items-center h-full w-8">
          <div
            class="popup-button flex items-center justify-center rounded h-8 w-8"
            onClick={() => {
              stack.pop();
              current[1](stack[stack.length - 1]);
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

  function close() {
    current[1](null);
    stack = ["main"];
  }
  let container: HTMLDivElement = (
    <div class="popup top-9 right-0.5 w-72 text-[0.9rem] shadow-lg rounded-lg border px-2 py-2 z-30 absolute grid grid-cols-[1fr]">
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
              class="fixed w-full h-full top-0 left-0"
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

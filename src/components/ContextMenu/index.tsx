import Button from "./Button";
import { For, createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js";
import type ContextItem from "~/api/ContextItem";

const [clientX, setClientX] = createSignal(0);
const [clientY, setClientY] = createSignal(0);
const [x, setX] = createSignal(0);
const [y, setY] = createSignal(0);
const [visible, setVisible] = createSignal(false);
const [buttons, setButtons] = createSignal<ContextItem[]>([]);

export function bindIFrameMousemove(scope: HTMLIFrameElement | Window) {
  const scopeWindow =
    scope instanceof HTMLIFrameElement
      ? (scope.contentWindow as Window)
      : scope;

  if (!scopeWindow) return;

  scopeWindow.addEventListener("visibilitychange", () => {
    setVisible(false);
  });

  scopeWindow.addEventListener("mousemove", (event) => {
    let offsetX = 0;
    let offsetY = 0;

    if (scope instanceof HTMLIFrameElement) {
      const clRect = scope.getBoundingClientRect();
      offsetX = clRect.left;
      offsetY = clRect.top;
    }

    setClientX(event.clientX + offsetX);
    setClientY(event.clientY + offsetY);
  });

  scopeWindow.addEventListener(
    "contextmenu",
    (event: MouseEvent & { data?: ContextItem[] }) => {
      event.preventDefault();
      if (event.data) {
        setVisible(true);
        setButtons(event.data);
        let width =
          document.querySelector<HTMLDivElement>("#context-menu")?.offsetWidth;
        let height =
          document.querySelector<HTMLDivElement>("#context-menu")?.offsetHeight;
        let x = clientX();
        let y = clientY();
        if (width && x > window.innerWidth - width) x -= width;
        if (height && y > window.innerHeight - height) y -= height;
        setX(x);
        setY(y);
      } else {
        setVisible(false);
      }
    }
  );

  scopeWindow.addEventListener("click", () => {
    setVisible(false);
  });

  scopeWindow.addEventListener("keydown", (event) => {
    setVisible(false);
  });
}

export default function ContextMenu(): JSX.Element {
  onMount(() => {
    bindIFrameMousemove(window);
  });

  function cancelEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div
      id="context-menu"
      class={`popup fixed z-[99999999] ${
        visible() ? "display" : "hidden"
      } w-48 rounded border py-1`}
      style={`left: ${x()}px; top: ${y()}px;`}
      onContextMenu={cancelEvent}
      onClick={cancelEvent}
    >
      <For each={buttons()}>
        {(button: ContextItem): JSX.Element => {
          if (button.separator) {
            return <hr class="mx-2 my-1" />;
          } else {
            return (
              <Button
                text={button.text as string}
                onClick={(e: MouseEvent) => {
                  setVisible(false);
                  button.onClick!(e);
                }}
              />
            );
          }
        }}
      </For>
    </div>
  );
}

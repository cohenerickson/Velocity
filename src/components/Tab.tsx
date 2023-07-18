import Favicon from "./Favicon";
import { Show } from "solid-js";
import type { JSX } from "solid-js";
import ContextItem from "~/api/ContextItem";
import TabData from "~/api/Tab";

interface TabProps {
  tab: TabData;
  sortable: any;
}

export default function Tab(props: TabProps): JSX.Element {
  const { sortable } = props;

  return (
    <div
      // @ts-ignore
      use:sortable
      id="tab-background"
      class={`h-9 ${
        props.tab.pinned() || props.tab.small() ? "" : "w-48"
      } shadow-inner-lg  flex items-center gap-[5px] overflow-hidden rounded p-2 pr-1 text-sm`}
      onMouseDown={(event) => {
        if (event.button === 0) props.tab.focus = true;
      }}
      oncontextmenu={(event: MouseEvent & { data?: ContextItem[] }): void => {
        event.data = [
          new ContextItem({
            text: "New tab",
            onClick: () => {
              new TabData("about:newTab", true);
            }
          }),
          new ContextItem({
            separator: true
          }),
          new ContextItem({
            text: "Reload",
            onClick: () => {
              props.tab.reload();
            }
          }),
          new ContextItem({
            text: "Duplicate",
            onClick: () => {
              new TabData(props.tab.url(), true);
            }
          }),
          new ContextItem({
            separator: true
          }),
          new ContextItem({
            text: "Close",
            onClick: () => {
              props.tab.close();
            }
          })
        ];
      }}
      data-active={props.tab.focus()}
    >
      <div class="h-4 w-4">
        <Show when={props.tab.loading()}>
          <div class="h-4 w-4 overflow-hidden">
            <div id="tab-throbber" class="h-4 w-[960px]"></div>
          </div>
        </Show>
        <Show when={!props.tab.loading()}>
          <div
            class={`h-full w-full ${
              props.tab.small() && props.tab.focus() ? "hidden" : ""
            }`}
          >
            <Favicon src={props.tab.icon} />
          </div>
        </Show>
      </div>
      <Show when={props.tab.playing()}>
        <i class="fa-regular fa-volume mt-[2px] text-[10px]"></i>
      </Show>
      <div
        class={`flex-1 overflow-hidden ${
          props.tab.small() || props.tab.pinned() ? "hidden" : ""
        }`}
      >
        <p
          class="w-full text-clip whitespace-nowrap text-xs font-light"
          style="-webkit-mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);"
        >
          {props.tab.title()}
        </p>
      </div>
      <div
        class={`close-icon flex h-6 w-6 items-center justify-center rounded hover:bg-opacity-50 ${
          (props.tab.small() && !props.tab.focus()) || props.tab.pinned()
            ? "hidden"
            : ""
        }`}
        onClick={props.tab.close.bind(props.tab)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <i class="fa-light fa-xmark mt-[2px] text-[10px]"></i>
      </div>
    </div>
  );
}

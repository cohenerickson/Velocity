import Favicon from "./Favicon";
import { Show } from "solid-js";
import type { JSX } from "solid-js";
import ContextItem from "~/API/ContextItem";
import TabData from "~/API/Tab";

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
      class={`text-white h-9 ${
        props.tab.focus() ? "bg-[#42414D]" : "hover:bg-[#35343A]"
      } ${
        props.tab.pinned() || props.tab.small() ? "" : "w-48"
      } p-2 pr-1 flex items-center gap-[5px] text-sm rounded shadow-inner-lg overflow-hidden`}
      onMouseDown={() => {
        props.tab.focus = true;
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
    >
      <div class="w-4 h-4">
        <Show when={props.tab.loading()}>
          <div class="w-4 h-4 overflow-hidden">
            <div class="loading-animation w-[960px] h-4 bg-white"></div>
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
        <i class="text-[10px] fa-regular fa-volume mt-[2px]"></i>
      </Show>
      <div
        class={`flex-1 overflow-hidden ${
          props.tab.small() || props.tab.pinned() ? "hidden" : ""
        }`}
      >
        <p
          class="text-clip whitespace-nowrap w-full text-xs font-light"
          style="-webkit-mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent);"
        >
          {props.tab.title()}
        </p>
      </div>
      <div
        class={`h-6 w-6 flex items-center justify-center hover:bg-neutral-500 hover:bg-opacity-50 transition-all rounded ${
          (props.tab.small() && !props.tab.focus()) || props.tab.pinned()
            ? "hidden"
            : ""
        }`}
        onClick={props.tab.close.bind(props.tab)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <i class="fa-light fa-xmark text-[10px] mt-[2px] text-white"></i>
      </div>
    </div>
  );
}

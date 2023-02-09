import { JSX, createSignal } from "solid-js";
import Tab from "~/data/Tab";
import { tabStack } from "~/data/appState";
import Favicon from "../Favicon";

interface BookmarkProps {
  name: string;
  url: string;
  icon: string;
}

export default function Bookmakr(props: BookmarkProps): JSX.Element {
  function handleClick(event: MouseEvent) {
    if (/^javascript:/.test(props.url)) {
      Array.from(tabStack())[0].executeScript(
        decodeURIComponent(props.url.replace(/^javascript:/, ""))
      );
    } else {
      if (event.ctrlKey) {
        new Tab(props.url, false);
      } else {
        Array.from(tabStack())[0].navigate(props.url);
      }
    }
  }

  return (
    <div
      onClick={handleClick}
      class="h-6 flex items-center gap-1 rounded hover:bg-[#60606e] cursor-default px-1 select-none"
    >
      <div class="w-[15px] h-[15px]">
        <Favicon src={createSignal<string>(props.icon)[0]}></Favicon>
      </div>
      {props.name}
    </div>
  );
}

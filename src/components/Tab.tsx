import * as tabsApi from "../api/tabs";
import { Tab } from "../api/tabs";
import { setActive } from "../scripts/tabManager";
import { Reorder } from "framer-motion";
import { JSX } from "preact/jsx-runtime";
import { FiX } from "react-icons/fi";

export function TabElement({ tab }: { tab: Tab }): JSX.Element {
  return (
    <Reorder.Item
      key={tab.id}
      value={tab}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1
      }}
      transition={{
        duration: 0.1
      }}
      exit={{ opacity: 0 }}
      class={`tab ${tab.active ? "active" : ""} mx-[2px] my-1 ${
        !tab.pinned ? "min-w-[76px] max-w-[225px]" : "justify-center"
      } flex flex-[100,100] items-center rounded px-2`}
      onMouseDown={async () => {
        await setActive(tab);
      }}
    >
      {(tab.pinned || !!tab.favIconUrl) && (
        <div
          class={`favicon ${tab.pinned ? "mx-[2px]" : "mr-[5.5px]"} h-4 w-4`}
          style={`background-image: url(${
            tab.favIconUrl || "./defaultFavicon.svg"
          });background-repeat:no-repeat;background-position:center;background-size:cover;`}
        ></div>
      )}

      {!tab.pinned && (
        <>
          <span class="flex-1 whitespace-nowrap text-xs">
            {tab.title ?? tab.url}
          </span>
          <div
            class="close ml-2 flex h-6 w-6 items-center justify-center rounded text-xs"
            onClick={async () => {
              await tabsApi.remove(tab.id);
            }}
          >
            <FiX />
          </div>
        </>
      )}
    </Reorder.Item>
  );
}

import { Tab } from "../api/tabs";
import * as tabsApi from "../api/tabs";
import { tabs } from "../scripts/tabManager";
import { TabElement } from "./Tab";
import { Reorder, AnimatePresence } from "framer-motion";
import { JSX } from "preact/jsx-runtime";
import { FiPlus } from "react-icons/fi";

export function TabsContainer(): JSX.Element {
  return (
    <>
      <Reorder.Group
        as="div"
        axis="x"
        onReorder={(newTabs: Tab[]) => {
          const pinned = newTabs.filter((tab) => tab.pinned);
          const unpinned = newTabs.filter((tab) => !tab.pinned);

          tabs.value = [...pinned, ...unpinned].map((tab, index) => {
            tab.index = index;
            return tab;
          });
        }}
        values={tabs.valueOf()}
        className="tabContainer flex h-11 flex-1"
      >
        <AnimatePresence>
          {tabs.value.map((tab) => (
            <TabElement key={tab.id} tab={tab} />
          ))}
        </AnimatePresence>
        <div
          class="newTabBtn mx-[2px] my-1 flex aspect-square items-center justify-center rounded"
          onClick={async () => {
            await tabsApi.create({
              pinned: true
            });
            await tabsApi.create({
              pinned: false
            });
          }}
        >
          <FiPlus />
        </div>
      </Reorder.Group>
    </>
  );
}

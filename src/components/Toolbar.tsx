import { NavBar } from "./NavBar";
import { TabsContainer } from "./Tabs";
import { JSX } from "preact/jsx-runtime";

export function Toolbar(): JSX.Element {
  return (
    <div class="toolbar overflow-hidden">
      <div class="tabToolbar flex">
        <TabsContainer />
      </div>
      <NavBar />
    </div>
  );
}

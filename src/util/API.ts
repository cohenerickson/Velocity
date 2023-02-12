import Tab from "~/data/Tab";
import Protocol from "~/data/Protocol";
import ContextItem from "~/data/ContextItem";
import { bindIFrameMousemove } from "~/components/ContextMenu";

const Velocity = {
  Tab,
  Protocol,
  ContextItem,
  bindIFrameMousemove
};

declare global {
  interface Window {
    Velocity: typeof Velocity;
  }
}

window.Velocity = Velocity;

export default Velocity;

import Tab from "~/API/Tab";
import Protocol from "~/API/Protocol";
import ContextItem from "~/API/ContextItem";
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

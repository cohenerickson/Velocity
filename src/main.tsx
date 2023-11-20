import { fs, sh } from "./api/util/fs";
import { Toolbar } from "./components/Toolbar";
import "./index.css";
import "./scripts/tabManager";
import { render } from "preact";

Object.assign(window, { fs, sh });

render(
  <>
    <Toolbar />
  </>,
  document.getElementById("app")!
);

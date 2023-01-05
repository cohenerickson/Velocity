import { JSX } from "solid-js";

export default function Header(): JSX.Element {
  return (
    <nav>
      <div id="tabs" class="w-full h-10 bg-black">
        <div class="h-full bg-white w-64 p-2 flex items-center gap-2 text-sm rounded-t-lg shadow">
          <div class="bg-green-500 h-5 w-5"></div>
          <span>Google</span>
        </div>
      </div>
    </nav>
  );
}

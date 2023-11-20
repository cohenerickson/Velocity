import { JSX } from "preact/jsx-runtime";
import { FiArrowLeft, FiArrowRight, FiRotateCw } from "react-icons/fi";

export function NavBar(): JSX.Element {
  return (
    <div class="navBar flex h-10 items-center px-[7px]">
      <div class="button mx-[1px] flex h-8 w-8 items-center justify-center rounded">
        <FiArrowLeft />
      </div>
      <div class="button mx-[1px] flex h-8 w-8 items-center justify-center rounded">
        <FiArrowRight />
      </div>
      <div class="button mx-[1px] flex h-8 w-8 items-center justify-center rounded">
        <FiRotateCw />
      </div>
      <input class="flex-1"></input>
    </div>
  );
}

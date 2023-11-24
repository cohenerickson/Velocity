import { extensions } from "../scripts/extensionManager";
import { JSX } from "preact/jsx-runtime";
import { FiArrowLeft, FiArrowRight, FiRotateCw, FiMenu } from "react-icons/fi";
import { IoExtensionPuzzleOutline } from "react-icons/io5";

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
      <input class="mx-2 flex-1"></input>
      <div class="button mx-[1px] flex h-8 w-8 items-center justify-center rounded">
        {/* Replace with Feather Icons when available */}
        <IoExtensionPuzzleOutline />
      </div>
      {extensions.value.map((extension) => (
        <div class="button mx-[1px] flex h-8 w-8 items-center justify-center rounded">
          <FiMenu />
        </div>
      ))}
      <div class="button mx-[1px] flex h-8 w-8 items-center justify-center rounded">
        <FiMenu />
      </div>
    </div>
  );
}

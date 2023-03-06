import type { JSX } from "solid-js";
import { Link, Title } from "solid-start";

export default function History(): JSX.Element {
  return (
    <main class="flex w-full h-full bg-[#1C1B22] text-white">
      <Title>History</Title>
      <Link rel="icon" href="/icons/clock.svg"></Link>
      {/*  */}
      <div class="w-[118px] sm:w-[240px] sm:items-end h-full flex flex-col items-center pt-[70px] text-2xl select-none"></div>
      <div class="flex-1">
        <div class="w-full h-[82px]">{/* Search box */}</div>
      </div>
    </main>
  );
}

import { JSX } from "solid-js";
import { Link, Title } from "solid-start";

export default function Bookmarks(): JSX.Element {
  return (
    <main class="flex h-full w-full bg-[#1C1B22] text-white">
      <Title>Bookmarks</Title>
      <Link rel="icon" href="/icons/star.svg"></Link>
      {/*  */}
    </main>
  );
}

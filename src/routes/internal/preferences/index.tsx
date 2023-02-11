import { JSX, createSignal } from "solid-js";
import { Title, Link } from "solid-start";
import NavButton from "./NavButton";

import General from "./General";
import Search from "./Search";

export default function Preferences(): JSX.Element {
  const [activeSection, setActiveSection] = createSignal<string>("general");

  return (
    <main class="flex w-full h-full bg-[#1C1B22] text-white">
      <Title>Settings</Title>
      <Link rel="icon" href="/icons/gear.svg"></Link>
      {/*  */}
      <div class="w-[118px] sm:w-[240px] sm:items-end h-full flex flex-col items-center pt-[70px] text-2xl select-none">
        <NavButton
          active={[activeSection, setActiveSection]}
          title="General"
          icon="gear"
        />
        <NavButton
          active={[activeSection, setActiveSection]}
          title="Home"
          icon="home"
        />
        <NavButton
          active={[activeSection, setActiveSection]}
          title="Search"
          icon="search"
        />
      </div>
      <div class="flex-1">
        <div class="w-full h-[82px]">{/* Search box */}</div>
        <General id="general" active={activeSection} />
        <Search id="search" active={activeSection} />
      </div>
    </main>
  );
}

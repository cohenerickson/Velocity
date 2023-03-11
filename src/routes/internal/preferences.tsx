import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { Link, Title } from "solid-start";
import Search from "~/components/internal/preferences//Search";
import General from "~/components/internal/preferences/General";
import Home from "~/components/internal/preferences/Home";
import Keybinds from "~/components/internal/preferences/Keybinds";
import NavButton from "~/components/internal/preferences/NavButton";

export default function Preferences(): JSX.Element {
  const [activeSection, setActiveSection] = createSignal<string>("general");

  return (
    <main class="flex w-full h-full text-white">
      <style>{`
        body {
          background: #1C1B22;
        }
      `}</style>
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
        <NavButton
          active={[activeSection, setActiveSection]}
          title="Keybinds"
          icon="keyboard"
        />
      </div>
      <div class="flex-1">
        <div class="w-full h-[82px]">{/* Search box */}</div>
        <General id="general" active={activeSection} />
        <Home id="home" active={activeSection} />
        <Search id="search" active={activeSection} />
        <Keybinds id="keybinds" active={activeSection} />
      </div>
    </main>
  );
}

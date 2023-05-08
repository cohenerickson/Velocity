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
    <main class="flex h-full w-full text-white">
      <style>{`
        body {
          background: #1C1B22;
        }
      `}</style>
      <Title>Settings</Title>
      <Link rel="icon" href="/icons/gear.svg"></Link>
      {/*  */}
      <div class="flex h-full w-[118px] select-none flex-col items-center pt-[70px] text-2xl sm:w-[240px] sm:items-end">
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
        <div class="h-[82px] w-full">{/* Search box */}</div>
        <General id="general" active={activeSection} />
        <Home id="home" active={activeSection} />
        <Search id="search" active={activeSection} />
        <Keybinds id="keybinds" active={activeSection} />
      </div>
    </main>
  );
}

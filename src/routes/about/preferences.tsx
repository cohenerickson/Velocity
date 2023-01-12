import { JSX, createSignal, createEffect, For } from "solid-js";
import { Title, Link } from "solid-start";

export default function NewTab(): JSX.Element {
  const preferences = JSON.parse(localStorage.getItem("preferences") || "{}");
  const [bareServers, setBareServers] = createSignal<Set<string>>(
    new Set(preferences.bareServers || ["/bare/"])
  );

  createEffect(() => {
    localStorage.setItem(
      "preferences",
      JSON.stringify({
        bareServers: Array.from(bareServers())
      })
    );
  });

  return (
    <main class="flex flex-col w-full h-full bg-[#2B2A33] text-white">
      <Title>Preferences</Title>
      <Link rel="icon" href="/firefox-logo.svg"></Link>

      <div class="m-5">
        <h1 class="text-2xl font-semibold">Preferences</h1>
      </div>
    </main>
  );
}

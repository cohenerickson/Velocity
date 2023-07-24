import { For, JSX, onMount } from "solid-js";
import { createSignal } from "solid-js";
import { Link, Title } from "solid-start";
import Favicon from "~/components/Favicon";
import type HistoryEntry from "~/types/HistoryEntry";

export default function History(): JSX.Element {
  const [historyEntries, setHistoryEntries] = createSignal<HistoryEntry[]>([]);

  onMount(async () => {
    await import("~/api");
    window.Velocity.history.on("ready", async () => {
      setHistoryEntries(await window.Velocity.history.get());
    });
  });

  return (
    <main class="flex h-full w-full bg-[#1C1B22] text-white">
      <Title>History</Title>
      <Link rel="icon" href="/icons/clock.svg"></Link>
      {/*  */}
      <div class="flex h-full w-[118px] select-none flex-col items-center pt-[70px] text-2xl sm:w-[240px] sm:items-end">
        <div
          class="flex h-12 w-12 cursor-pointer items-center justify-center gap-[9px] rounded px-[10px] transition-colors hover:bg-[#52525E] sm:w-[204px] sm:justify-start"
          onClick={async () => {
            await window.Velocity.history.clear();
            setHistoryEntries(await window.Velocity.history.get());
          }}
        >
          <i class="fa-light fa-trash h-6 w-6"></i>
          <span class="hidden text-base sm:block">Clear Browsing Data</span>
        </div>
      </div>
      <div class="mx-24 my-16 flex flex-1 flex-col">
        <h1 class="mb-5 text-2xl">History</h1>
        <For each={historyEntries()}>
          {(entry) => (
            <div class="flex items-center justify-between border-b border-white px-5 py-2">
              <div class="flex flex-1 gap-5">
                <i
                  class="fa-light fa-trash mt-[2px]"
                  onclick={async () => {
                    window.Velocity.history.delete(entry.id);
                    setHistoryEntries(await window.Velocity.history.get());
                  }}
                ></i>
                <span class="text-sm opacity-50">
                  {new Date(entry.timestamp).getHours() % 12}:
                  {new Date(entry.timestamp).getMinutes()}{" "}
                  {new Date(entry.timestamp).getHours() >= 12 ? "PM" : "AM"}
                </span>
                <a
                  href={entry.url}
                  onClick={(e) => {
                    e.preventDefault();
                    new window.parent.Velocity.Tab(entry.url, true);
                  }}
                  class="flex items-center gap-2"
                >
                  <div class="mt-[2px] h-4 w-4">
                    <Favicon src={createSignal(entry.favicon)[0]} />
                  </div>
                  <span class="text-sm">{entry.title}</span>
                </a>
              </div>
              <div class="hidden flex-1 justify-end lg:flex">
                <span class="text-sm opacity-50">
                  {entry.url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")}
                </span>
              </div>
            </div>
          )}
        </For>
      </div>
    </main>
  );
}

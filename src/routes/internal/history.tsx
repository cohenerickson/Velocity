import { For, JSX, onMount } from "solid-js";
import { createSignal } from "solid-js";
import { Link, Title } from "solid-start";
import Tab from "~/api/Tab";
import Favicon from "~/components/Favicon";
import type HistoryEntry from "~/types/HistoryEntry";

export default function History(): JSX.Element {
  const [historyEntries, setHistoryEntries] = createSignal<HistoryEntry[]>([]);

  onMount(async () => {
    await import("~/API");
    window.Velocity.history.on("ready", async () => {
      setHistoryEntries(await window.Velocity.history.get());
    });
  });

  return (
    <main class="flex w-full h-full bg-[#1C1B22] text-white">
      <Title>History</Title>
      <Link rel="icon" href="/icons/clock.svg"></Link>
      {/*  */}
      <div class="w-[118px] sm:w-[240px] sm:items-end h-full flex flex-col items-center pt-[70px] text-2xl select-none">
        <div
          class="cursor-pointer h-12 w-12 sm:w-[204px] px-[10px] rounded flex items-center justify-center sm:justify-start gap-[9px] hover:bg-[#52525E] transition-colors"
          onClick={async () => {
            await window.Velocity.history.clear();
            setHistoryEntries(await window.Velocity.history.get());
          }}
        >
          <i class="w-6 h-6 fa-light fa-trash"></i>
          <span class="hidden sm:block text-base">Clear Browsing Data</span>
        </div>
      </div>
      <div class="flex-1 flex flex-col mx-24 my-16">
        <h1 class="text-2xl mb-5">History</h1>
        <For each={historyEntries()}>
          {(entry) => (
            <div class="flex items-center border-b border-white justify-between px-5 py-2">
              <div class="flex flex-1 gap-5">
                <i
                  class="fa-light fa-trash mt-[2px]"
                  onclick={async () => {
                    window.Velocity.history.delete(entry.id);
                    setHistoryEntries(await window.Velocity.history.get());
                  }}
                ></i>
                {() => {
                  const date = new Date(entry.timestamp);
                  return (
                    <span class="text-sm text-neutral-500">
                      {date.getHours() % 12}:{date.getMinutes()}{" "}
                      {date.getHours() >= 12 ? "PM" : "AM"}
                    </span>
                  );
                }}
                <a
                  href={entry.url}
                  onClick={(e) => {
                    e.preventDefault();
                    new window.parent.Velocity.Tab(entry.url, true);
                  }}
                  class="flex gap-2 items-center"
                >
                  <div class="h-4 w-4 mt-[2px]">
                    <Favicon src={createSignal(entry.favicon)[0]} />
                  </div>
                  <span class="text-sm">{entry.title}</span>
                </a>
              </div>
              <div class="hidden flex-1 justify-end lg:flex">
                <span class="text-sm text-neutral-500">
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

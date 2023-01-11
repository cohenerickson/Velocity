import { JSX, createSignal, createEffect, For } from "solid-js";
import { Title, Link } from "solid-start";
import { generateProxyUrl } from "~/util/url";

export default function NewTab(): JSX.Element {
  const settings = JSON.parse(localStorage.getItem("settings") || "{}");
  const [bareServers, setBareServers] = createSignal<Set<string>>(
    new Set(settings.bareServers || ["/bare/"])
  );
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      const element = event.target as HTMLInputElement;
      const query = element.value;
      location.href = generateProxyUrl(query);
    }
  }

  createEffect(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        bareServers: Array.from(bareServers())
      })
    );
  });

  return (
    <main class="flex flex-col w-full h-full bg-[#1C1B22] text-white">
      <Title>Settings</Title>
      <Link rel="icon" href="/firefox-logo.svg"></Link>

      <div class="m-5">
        <h1 class="text-4xl font-semibold">Settings</h1>

        <div class="m-5">
          <h2 class="text-2xl font-semibold">Bare Servers</h2>
          <div class="flex flex-col gap-2 my-2">
            <For each={Array.from(bareServers())}>
              {(server) => (
                <div>
                  <span
                    class="hover:line-through cursor-pointer"
                    onClick={() => {
                      setBareServers(
                        new Set(
                          Array.from(bareServers()).filter((x) => x !== server)
                        )
                      );
                    }}
                  >
                    {server}
                  </span>
                </div>
              )}
            </For>
            
          </div>
          <input
            class="bg-[#52525E] rounded px-2 py-1 shadow-lg focus:ring-0 focus:outline-none"
            placeholder="Add new Bare server."
            onKeyDown={(event) => {
              let target = event.target as HTMLInputElement;
              if (event.key === "Enter") {
                if (target.value) {
                  setBareServers(
                    new Set([...Array.from(bareServers()), target.value])
                  );
                  target.value = "";
                }
              }
            }}
            type="text"
          />
        </div>
      </div>
    </main>
  );
}

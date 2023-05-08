import BareClient from "@tomphttp/bare-client";
import "prism-themes/themes/prism-one-dark.css";
import Prism from "prismjs";
import type { JSX } from "solid-js";
import { Link, Title } from "solid-start";
import { bareClient, setBareClient } from "~/data/appState";

export default function ViewSource(): JSX.Element {
  if (!bareClient()) {
    const server =
      typeof window.__uv$config.bare === "string"
        ? window.__uv$config.bare
        : window.__uv$config.bare[
            Math.floor(Math.random() * window.__uv$config.bare.length)
          ];
    setBareClient(new BareClient(new URL(server, location.toString())));
  }

  const query = new URLSearchParams(location.search).get("q") ?? "";

  bareClient()
    ?.fetch(query)
    .then((response) => {
      response.text().then((text) => {
        document.getElementById("code")!.innerHTML = Prism.highlight(
          text,
          Prism.languages.html,
          "html"
        );
      });
    })
    .catch(() => {
      window.close();
    });

  return (
    <main class="line-numbers h-full w-full text-sm text-white">
      <style>
        {`
          * {
            background: #282C34;
          }
        `}
      </style>
      <Title>view-source:{query}</Title>
      <Link rel="icon" href="/icons/earth.svg"></Link>
      {/* */}
      <pre>
        <code
          class="language-html"
          id="code"
          style="white-space:hard-wrap;"
        ></code>
      </pre>
    </main>
  );
}

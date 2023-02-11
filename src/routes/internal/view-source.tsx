import { JSX } from "solid-js";
import { Title, Link } from "solid-start";
import { bareClient, setBareClient } from "~/data/appState";
import BareClient from "@tomphttp/bare-client";
import Prism from "prismjs";
import "prism-themes/themes/prism-one-dark.css";

export default function ViewSource(): JSX.Element {
  if (!bareClient()) {
    setBareClient(
      new BareClient(new URL(window.__uv$config.bare, location.toString()))
    );
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
    <main class="w-full h-full bg-[#282C34] text-white text-sm line-numbers">
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

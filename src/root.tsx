// @refresh reload
import Bookmark from "./API/Bookmark";
import SEO from "./components/SEO";
import "./root.css";
import { Suspense, createEffect, onMount } from "solid-js";
import type { JSX } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Routes,
  Scripts
} from "solid-start";
import {
  bookmarks,
  bookmarksShown,
  setBookmarks,
  setBookmarksShown,
  tabs
} from "~/data/appState";
import preferences from "~/util/preferences";

export default function Root(): JSX.Element {
  onMount(async () => {
    await import("~/util/registerSW");
    await import("~/scripts/registerProtocols");
    await import("~/scripts/registerKeybinds");
    await import("~/API");

    setBookmarks(
      JSON.parse(localStorage.getItem("bookmarks") || "[]").map(
        (x: any) => new Bookmark(x)
      )
    );

    setBookmarksShown((preferences()["bookmarks.shown"] as boolean) ?? true);
  });

  createEffect(() => {
    localStorage.setItem(
      "tabs",
      JSON.stringify(Array.from(tabs()).map((x) => x.url()))
    );
    localStorage.setItem(
      "activeTab",
      Array.from(tabs())
        .findIndex((x) => x.focus())
        .toString()
    );

    localStorage.setItem("bookmarks", JSON.stringify(Array.from(bookmarks())));
    localStorage.setItem(
      "preferences",
      JSON.stringify(
        Object.assign(preferences(), {
          ["bookmarks.shown"]: bookmarksShown()
        })
      )
    );
  });

  return (
    <Html lang="en">
      <Head>
        <script src="/pro.fontawesome.js" defer></script>
        <script src="/uv/uv.bundle.js"></script>
        <script src="/uv/uv.config.js"></script>
        <SEO />
      </Head>
      <Body class="h-screen">
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}

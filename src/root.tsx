// @refresh reload
import { Suspense, createEffect, onMount } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Routes,
  Scripts
} from "solid-start";
import "./root.css";
import SEO from "./components/SEO";

import {
  tabs,
  bookmarks,
  setBookmarks,
  setBookmarksShown,
  bookmarksShown
} from "~/data/appState";
import preferences from "~/util/preferences";
import Bookmark from "./API/Bookmark";

export default function Root() {
  onMount(() => {
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

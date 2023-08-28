// @refresh reload
import { BookmarkTreeNode, getChildren } from "./addon/api/bookmarks";
import "./browser.css";
import SEO from "./components/SEO";
import { globalBindingUtil } from "./manager/addonWorkerManager";
import { fs, sh } from "./util/fs";
import { Suspense, onMount } from "solid-js";
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
import { setBookmarks, setBookmarksShown } from "~/data/appState";
import { defaultTheme, updateCssVariables } from "~/manager/themeManager";
import { preferences } from "~/util/";

export default function Root(): JSX.Element {
  function headRef(head: HTMLHeadElement) {
    const fontawesome = document.createElement("script");
    fontawesome.src = "/pro.fontawesome.js";
    head.appendChild(fontawesome);

    const bundle = document.createElement("script");
    bundle.charset = "UTF-8";
    bundle.src = "/uv/uv.bundle.js";

    bundle.onload = () => {
      const config = document.createElement("script");
      config.src = "/uv/uv.config.js";
      head.appendChild(config);

      config.onload = () => {
        import("~/util/registerSW");
      };
    };

    head.appendChild(bundle);
  }

  onMount(async () => {
    await updateTheme(localStorage.getItem("theme")!);

    window.addEventListener("storage", async (event: StorageEvent) => {
      if (event.key === "theme") await updateTheme(event.newValue!);
    });

    setBookmarks(await getChildren("root________"));

    globalBindingUtil.on("bookmarks.reload", async () => {
      setBookmarks(await getChildren("root________"));
    });

    setBookmarksShown((preferences()["bookmarks.shown"] as boolean) ?? true);

    async function updateTheme(value: string) {
      try {
        const theme = JSON.parse(value || JSON.stringify(defaultTheme));
        theme ? await updateCssVariables(theme) : undefined;
      } catch {}
    }
  });

  return (
    <Html lang="en">
      <Head ref={headRef}>
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

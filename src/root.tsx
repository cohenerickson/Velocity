// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts
} from "solid-start";
import "./root.css";
import SEO from "./components/SEO";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <SEO />
        <script src="/pro.fontawesome.js" defer></script>
        <script src="/uv/uv.bundle.js" defer></script>
        <script src="/uv/uv.config.js" defer></script>
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

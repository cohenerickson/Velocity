// @refresh reload
import { Suspense } from "solid-js";
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

export default function Root() {
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

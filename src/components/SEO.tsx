import type { JSX } from "solid-js";
import { Link, Meta, Title } from "solid-start";

export default function SEO(): JSX.Element {
  return (
    <>
      <Meta charset="utf-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta name="theme-color" content="#1c1b22" />

      <Title>Velocity</Title>
      <Meta property="og:title" content="Velocity" />

      <Link rel="icon" href="/favicon.ico" />
      <Link rel="apple-touch-icon" href="/icons/touch.png" />
      <Link rel="manifest" href="/webmanifest.json" />

      <Meta name="robots" content="index, follow" />
      <Meta name="revisit-after" content="7 days" />

      <Meta
        name="description"
        content="A highly customizable tabbed proxy for evading internet censorship."
      />
      <Meta
        property="og:description"
        content="A highly customizable tabbed proxy for evading internet censorship."
      />
      <Meta name="keywords" content="proxy,velocity,tabbed,proxy,unblocker" />
    </>
  );
}

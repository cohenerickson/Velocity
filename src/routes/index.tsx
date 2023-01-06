import Tabs from "~/components/Tabs";
import Utility from "~/components/Utility";

export default function Home() {
  return (
    <main class="h-full flex flex-col">
      <Tabs />
      <Utility />
      <main id="content" class="w-full bg-[#2B2A33] flex-1"></main>
    </main>
  );
}

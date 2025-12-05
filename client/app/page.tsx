import Image from "next/image";
import HomePage from "./home/page";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black dark:text-white">
      <main className="flex min-h-screen w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black text-black dark:text-white sm:items-start">
        <HomePage/>
      </main>
    </div>
  );
}

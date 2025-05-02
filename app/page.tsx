"use client";

import Link from "next/link";
import { menuItems } from "./constants";

export default function Home() {
  return (
    <div className="flex flex-col flex-wrap md:flex-row items-center justify-center h-screen w-full gap-6">
      {menuItems.map(
        (item) =>
          item.id !== 0 && (
            <Link
              key={item.id}
              href={item.url}
              className="bg-white text-black px-12 py-4 rounded-sm hover:scale-110 w-1/2 md:w-auto text-center"
            >
              {item.name}
            </Link>
          )
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { menuItems } from "./constants";
import { useCredentialModal } from "./context/credential-context";

export default function Home() {
  const {
    modalConfig: { visible: modalVisible },
    hideModal,
  } = useCredentialModal();

  useEffect(() => {
    if (modalVisible) {
      hideModal();
    }
  }, [hideModal, modalVisible]);

  return (
    <>
      <h1 className="text-gray-500 text-xl md:text-2xl text-center font-extrabold">
        A collection of AI Utilities
      </h1>
      <div className="flex flex-col flex-wrap items-center justify-start h-screen w-full gap-6 px-4 mt-10">
        {menuItems.map(
          (item) =>
            item.id !== 0 && (
              <Link
                key={item.id}
                href={item.url}
                className="bg-white text-black px-12 py-4 rounded-sm hover:scale-110 w-full md:w-1/4 text-center"
              >
                {item.emoji} &nbsp;
                {item.name}
              </Link>
            )
        )}
      </div>
    </>
  );
}

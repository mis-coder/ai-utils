"use client";

import { usePathname } from "next/navigation";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { menuItems } from "../constants";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const pathname = usePathname();
  const isRootPage = pathname === "/";

  console.log({ pathname });

  if (isRootPage) return null;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const onItemClick = () => {
    toggleSidebar();
  };

  const getActivePageName = () => {
    return menuItems.find(item => item.url === pathname)?.name ?? "";
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="font-bold text-xl text-gray-800">AI Utils / <span className="text-[18px] text-gray-500 font-normal">{getActivePageName()}</span></div>

            {/* Menu Icon */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 cursor-pointer"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </button>
          </div>
        </div>
      </header>
      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600/75 transition-opacity z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-30 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col py-6 px-4 overflow-y-auto">
          {/* Sidebar Header with Close Button */}
          <div className="flex items-center justify-end mb-6 px-2">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 cursor-pointer"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>

          {/* Sidebar Content */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    onClick={onItemClick}
                    className="flex items-center px-2 py-3 text-base font-medium rounded-md text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;

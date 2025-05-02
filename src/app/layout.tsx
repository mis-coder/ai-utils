import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "./components/header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Utils",
  description: "A collection of basic use cases of AI and LLM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="flex min-h-screen flex-col items-center justify-between px-24 py-5">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

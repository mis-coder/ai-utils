import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <div className="bg-gray-100">
          <Header />
          <main className="pt-16 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "./components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NHL",
  description: "NHL Games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="bg-gray-800">
        <Nav />
      </nav>
      {children}
    </>
  );
}

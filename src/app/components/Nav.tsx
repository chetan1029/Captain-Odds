"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import Image from "next/image";

export default function Nav() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const toggleSubmenu = () => {
    setSubmenuOpen((prevState) => !prevState);
  };

  const menuRef = useRef<HTMLDivElement>(null); // Specify the type of the ref

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Add type for event parameter
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Use type assertion
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between border-b border-slate-700">
          <div className="flex items-center">
            <div className="mr-2 flex md:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                data-drawer-target="drawer-navigation"
                data-drawer-show="drawer-navigation"
                aria-controls="drawer-navigation"
                onClick={toggleMenu}
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                {/* Menu closed */}
                <svg
                  className={menuOpen ? "hidden h-6 w-6" : "block h-6 w-6"}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-shrink-0">
              <Image
                className="w-38"
                src="/publicbets-logo.png"
                alt="PublicBets"
                width={150}
                height={40}
              />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === "/"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  aria-current="page"
                >
                  <span className="flex items-center w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                      <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                    </svg>
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                      Home
                    </span>
                  </span>
                </Link>
                <Link
                  href="/nhl"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pathname?.startsWith("/nhl")
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="flex items-center w-full">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 30 30"
                    >
                      <g transform="translate(0.000000,30.000000) scale(0.100000,-0.100000)">
                        <path d="M227 203 c-10 -38 -22 -75 -27 -82 -6 -10 -34 -17 -87 -20 l-78 -6 0 -30 0 -30 67 1 c94 1 109 13 137 116 12 45 24 91 27 101 3 10 0 17 -8 17 -8 0 -20 -26 -31 -67z" />
                        <path d="M42 208 c-35 -35 13 -81 66 -62 30 11 40 37 22 59 -15 18 -71 20 -88 3z m68 -18 c0 -5 -11 -10 -25 -10 -14 0 -25 5 -25 10 0 6 11 10 25 10 14 0 25 -4 25 -10z" />
                      </g>
                    </svg>

                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                      NHL
                    </span>
                  </span>
                </Link>
                <Link
                  href="/wnba"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pathname?.startsWith("/wnba")
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="flex items-center w-full">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 30 30"
                    >
                      <g transform="translate(0.000000,30.000000) scale(0.100000,-0.100000)">
                        <path d="M227 203 c-10 -38 -22 -75 -27 -82 -6 -10 -34 -17 -87 -20 l-78 -6 0 -30 0 -30 67 1 c94 1 109 13 137 116 12 45 24 91 27 101 3 10 0 17 -8 17 -8 0 -20 -26 -31 -67z" />
                        <path d="M42 208 c-35 -35 13 -81 66 -62 30 11 40 37 22 59 -15 18 -71 20 -88 3z m68 -18 c0 -5 -11 -10 -25 -10 -14 0 -25 5 -25 10 0 6 11 10 25 10 14 0 25 -4 25 -10z" />
                      </g>
                    </svg>

                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                      WNBA
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileNav
        menuRef={menuRef}
        menuOpen={menuOpen}
        submenuOpen={submenuOpen}
        toggleMenu={toggleMenu}
        toggleSubmenu={toggleSubmenu}
      />
    </>
  );
}

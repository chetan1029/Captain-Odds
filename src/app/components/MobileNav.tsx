"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  menuRef: any;
  menuOpen: boolean;
  submenuOpen: boolean;
  toggleMenu: any;
  toggleSubmenu: any;
}
const MobileNav: React.FC<MobileNavProps> = ({
  menuRef,
  menuOpen,
  submenuOpen,
  toggleMenu,
  toggleSubmenu,
}) => {
  return (
    <>
      {/* Mobile menu */}
      <div
        ref={menuRef}
        id="drawer-navigation"
        className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white w-64 dark:bg-gray-800`}
        aria-labelledby="drawer-navigation-label"
      >
        <h5
          id="drawer-navigation-label"
          className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          Menu
        </h5>
        <button
          type="button"
          data-drawer-hide="drawer-navigation"
          aria-controls="drawer-navigation"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={toggleMenu}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={toggleMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                  <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
                <span className="ms-3">Home</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                aria-controls="dropdown-example"
                data-collapse-toggle="dropdown-example"
                onClick={toggleSubmenu}
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
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
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="dropdown-example"
                className={`${submenuOpen ? "block" : "hidden"} py-2 space-y-2`}
              >
                <li>
                  <Link
                    href="/wnba"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wnba/matchup"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={toggleMenu}
                  >
                    Scores & Matchups
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wnba/teams"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={toggleMenu}
                  >
                    Teams
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileNav;

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function SubNav() {
  const pathname = usePathname();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 hidden md:block">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 border-r pr-10">
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
                WNBA 2023-2024
              </span>
            </span>
          </div>
          <div className="">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/wnba"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === "/wnba"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                aria-current="page"
              >
                Home
              </Link>
              <Link
                href="/wnba/matchup"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  pathname?.startsWith("/wnba/matchup") ||
                  pathname?.startsWith("/wnba/boxscore")
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Scores & Matchups
              </Link>
              <Link
                href="/wnba/teams"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  pathname?.startsWith("/wnba/teams")
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Teams
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import TeamSchedule from "../../components/TeamSchedule";
import useSWR from "swr";
import { fetcher } from "@/app/utils/swrFetcher";
import Image from "next/image";

export default function TeamBySlug({ params }: { params: { slug: string } }) {
  // Use SWR to fetch data, with auto-revalidation
  const { data: team, error } = useSWR(
    "/api/teamBySlug?teamSlug=" + params?.slug,
    fetcher,
    {
      refreshInterval: 600000, // Auto-revalidate every 600 seconds (every 10 mins)
    }
  );

  if (!team) {
    return (
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 mt-4">
          <p>Team not found</p>
        </div>
      </main>
    );
  }

  const breadcrumbs = [
    { name: "WNBA", href: "/wnba" },
    { name: "Teams", href: "/wnba/teams" },
    { name: team.name, href: "" },
  ];

  return (
    <main className="flex-grow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 mt-4">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="mx-auto max-w-7xl py-6 px-6 lg:px-8 bg-white rounded-lg border border-gray-100 text-gray-900">
          <div className="md:flex flex-row md:gap-x-2 md:gap-y-4">
            <div className="basis-2/5 flex min-w-0 gap-x-4 gap-y-2">
              <Image
                className="h-20 w-20 flex-none"
                src={
                  "https://assets.b365api.com/images/team/l/" +
                    team.logo +
                    ".png" || "/placeholder-logo.png"
                }
                alt={team.name}
                height={30}
                width={30}
              />
              <div className="min-w-0 flex flex-col justify-center">
                <div>
                  <p className="text-lg font-semibold leading-6 text-gray-900">
                    {team.name}
                  </p>
                </div>
                <div>
                  <p className="truncate text-sm leading-5 text-gray-500">
                    {team.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ul className="flex text-sm font-medium text-center text-gray-500 rounded-lg shadow mt-3">
            <li className="w-full">
              <a
                href="#"
                className="inline-block w-full p-4 text-white bg-gray-100 border-r border-gray-700 rounded-s-lg focus:ring-1 focus:ring-gray-800 active focus:outline-none bg-gray-700 focus:text-white"
                aria-current="page"
              >
                Schedule
              </a>
            </li>
            <li className="w-full">
              <a
                href="#"
                className="inline-block w-full p-4 border-r border-gray-700 focus:ring-1 focus:ring-gray-800 focus:outline-none focus:text-white hover:text-white bg-gray-800 hover:bg-gray-700"
              >
                Stats
              </a>
            </li>
            <li className="w-full">
              <a
                href="#"
                className="inline-block w-full p-4 border-r rounded-e-lg border-gray-700 focus:ring-1 focus:ring-gray-800 focus:outline-none focus:text-white hover:text-white bg-gray-800 hover:bg-gray-700"
              >
                Odds
              </a>
            </li>
          </ul>

          {/* Pass the fetched team data to the TeamSchedule component */}
          <TeamSchedule team={team} />
        </div>
      </div>
    </main>
  );
}

"use client";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/app/utils/swrFetcher";
import Breadcrumbs from "@/app/components/Breadcrumbs";

// Define the Team interface to match Prisma schema
interface Team {
  id: number;
  name: string;
  city: string;
  conference: string;
  logo: string;
  externalId: string;
  slug: string;
}

// Define the structure for grouped teams by city
interface GroupedTeams {
  [conference: string]: Team[];
}

export default function Teams() {
  // Use SWR to fetch data, with auto-revalidation
  const { data, error } = useSWR("/api/teams", fetcher, {
    refreshInterval: 600000, // Auto-revalidate every 600 seconds (every 10 mins)
  });

  // Handle loading and error states
  if (error) return <div>Failed to load teams</div>;
  if (!data) return <div>Loading...</div>;

  const teams: Team[] = data;
  // Group teams by city
  const groupedTeams: GroupedTeams = teams.reduce(
    (acc: GroupedTeams, team: Team) => {
      acc[team.conference || "Unknown Conference"] = [
        ...(acc[team.conference || "Unknown Conference"] || []),
        team,
      ];
      return acc;
    },
    {}
  );

  const breadcrumbs = [
    { name: "WNBA", href: "/wnba" },
    { name: "Teams", href: "" },
  ];

  return (
    <main className="flex-grow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 mt-4">
        {/* Breadcrumbs component */}
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="mx-auto max-w-7xl py-6 px-6 lg:px-8 bg-white rounded-lg border border-gray-100 text-gray-900">
          <h2 className="text-long pb-3 font-semibold">WNBA Teams</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(groupedTeams).map(([conference, teams]) => (
              <div key={conference}>
                <h3 className="border-b pb-3 font-semibold my-4">
                  {conference} Conference
                </h3>
                <ul className="space-y-4">
                  {teams.map((team) => (
                    <li key={team.id}>
                      <Link href={`/wnba/teams/${team.slug}`}>
                        <div className="flex min-w-0 gap-x-4 gap-y-2">
                          <Image
                            className="h-12 w-12 flex-none rounded-full bg-gray-50"
                            src={
                              "https://assets.b365api.com/images/team/m/" +
                                team.logo +
                                ".png" || "/placeholder-logo.png"
                            } // Fallback if no logo
                            alt={team.name}
                            height={30}
                            width={30}
                          />
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                              {team.name}
                            </p>
                            <p className="truncate text-xs leading-5 text-gray-500">
                              {team.city || ""}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

import Breadcrumbs from "@/app/components/Breadcrumbs";
import DateNav from "../../components/DateNav";
import Matchupblock from "../../components/MatchupBlock";
import { formatDate } from "@/app/utils/formatDate";

export default function Matchup({ params }: { params: { slug: string } }) {
  const breadcrumbs = [
    { name: "WNBA", href: "/wnba" },
    { name: "Scores & Matchups", href: "/wnba/matchup" },
    { name: params.slug, href: "" },
  ];
  return (
    <main className="flex-grow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 mt-4">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <DateNav todayDate={params.slug} />
        <Matchupblock todayDate={params.slug} />
      </div>
    </main>
  );
}

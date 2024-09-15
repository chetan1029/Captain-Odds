import Breadcrumbs from "@/app/components/Breadcrumbs";
import DateNav from "../components/DateNav";
import Matchupblock from "../components/MatchupBlock";
import { formatDateUTC, getTodayDate } from "@/app/utils/formatDate";

export default function MatchupDashboard() {
  const breadcrumbs = [
    { name: "WNBA", href: "/wnba" },
    { name: "Scores & Matchups", href: "" },
  ];
  const todayDate = getTodayDate();
  return (
    <main className="flex-grow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 pt-4">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <DateNav todayDate={todayDate} />
        <Matchupblock todayDate={todayDate} />
      </div>
    </main>
  );
}

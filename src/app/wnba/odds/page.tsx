import Breadcrumbs from "@/app/components/Breadcrumbs";
import DateNav from "../components/DateNav";
import Matchupblock from "../components/MatchupBlock";
import { formatDateUTC, getTodayDate } from "@/app/utils/formatDate";
import Oddsblock from "../components/OddsBlock";

export default function MatchupDashboard() {
  const breadcrumbs = [
    { name: "WNBA", href: "/wnba" },
    { name: "Odds", href: "" },
  ];
  const todayDate = getTodayDate();
  return (
    <main className="flex-grow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 pt-4">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Oddsblock todayDate={todayDate} />
      </div>
    </main>
  );
}

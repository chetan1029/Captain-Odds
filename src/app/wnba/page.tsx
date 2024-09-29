import Breadcrumbs from "../components/Breadcrumbs";
import { getTodayDate } from "../utils/formatDate";
import Matchupblock from "./components/MatchupBlock";

export default function Dashboard() {
  const breadcrumbs = [{ name: "WNBA", href: "" }];
  const todayDate = getTodayDate();
  return (
    <main className="flex-grow">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 mb-20 pt-4">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Matchupblock todayDate={todayDate} />
      </div>
    </main>
  );
}

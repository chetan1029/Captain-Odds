import { formatSecondsToMinutes, formatStatType } from "@/app/utils/common";
import { stringToSlug } from "@/app/utils/toSlug";
import Link from "next/link";

interface TeamStatisticsProps {
  game: any;
}

const TeamStatistics: React.FC<TeamStatisticsProps> = ({ game }) => {
  // Use the correct game object structure for team names and stats
  const homeTeamName = game.homeTeam.name;
  const awayTeamName = game.awayTeam.name;

  // Extract stats to display
  const stats = game.stats;

  // Function to render stats rows
  const renderStatsRows = () => {
    return stats.map((stat: any) => {
      const statType = formatStatType(stat.statType);
      let homeValue = stat.homeValue;
      let awayValue = stat.awayValue;
      if (statType === "Timespent Inlead") {
        homeValue = formatSecondsToMinutes(homeValue);
        awayValue = formatSecondsToMinutes(awayValue);
      }
      if (statType === "Free Throws Rate" || statType === "Possession") {
        homeValue = homeValue + "%";
        awayValue = awayValue + "%";
      }
      return (
        <tr key={stat.id}>
          <td className="px-3 py-2 text-left">{formatStatType(statType)}</td>
          <td className="px-3 py-2 text-center">{homeValue}</td>
          <td className="px-3 py-2 text-center">{awayValue}</td>
        </tr>
      );
    });
  };

  return (
    <table className="table-fixed mr-5 w-full">
      <thead>
        <tr className="text-sm">
          <th className="px-3 py-2 text-left">Stat Type</th>
          <th className="px-3 py-2 text-center">
            <Link href={`/wnba/teams/${game.homeTeam.slug}`}>
              {homeTeamName}
            </Link>
          </th>
          <th className="px-3 py-2 text-center">
            <Link href={`/wnba/teams/${game.awayTeam.slug}`}>
              {awayTeamName}
            </Link>
          </th>
        </tr>
      </thead>
      <tbody>{renderStatsRows()}</tbody>
    </table>
  );
};

export default TeamStatistics;

import { convertWinsToPlayers, getRankings } from "@/database/api";
import { Ranking } from "@/database/types";
import { BackButton } from "@/components/back-button";

import ScoresRanking from "./scoresRanking";
import GeneralasServidasRanking from "./generalasServidasRanking";
import WinsByYearRanking from "./winsByYearRanking";
import YearlyTopWinners from "./yearlyTopWinners";

export default async function Rankings() {
  const rankings: Ranking = await getRankings();
  const totalsPlayers = convertWinsToPlayers(rankings.wins?.general ?? {});

  const currentYear = new Date().getFullYear();
  const availableYearNumbers = Object.keys(rankings.wins || {})
    .filter((key) => key !== "general")
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n) && n >= 2025);
  const initialYear = availableYearNumbers.includes(currentYear)
    ? currentYear
    : Math.max(
        2025,
        ...(availableYearNumbers.length ? availableYearNumbers : [2025])
      );
  const initialYearPlayers = convertWinsToPlayers(
    rankings.wins?.[String(initialYear)] ?? {}
  );
  return (
    <div className="container mx-auto p-4">
      <BackButton />
      <h1 className="text-4xl font-bold my-4">Rankings</h1>
      <div className="space-y-4">
        <WinsByYearRanking
          initialYear={initialYear}
          initialPlayers={initialYearPlayers}
          totalsPlayers={totalsPlayers}
        />
        <ScoresRanking players={rankings.scores} />
        <YearlyTopWinners winsByKey={rankings.wins} />
        <GeneralasServidasRanking
          generalasServidas={rankings.generalasServidas}
        />
      </div>
    </div>
  );
}

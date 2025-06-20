import { getRankings } from "@/database/api";
import { Ranking } from "@/database/types";
import { BackButton } from "@/components/back-button";

import WinsRanking from "./winsRanking";
import ScoresRanking from "./scoresRanking";
import GeneralasServidasRanking from "./generalasServidasRanking";

export default async function Rankings() {
  const rankings: Ranking = await getRankings();
  return (
    <div className="container mx-auto p-4">
      <BackButton />
      <h1 className="text-4xl font-bold my-4">Rankings</h1>
      <div className="space-y-4">
        <WinsRanking players={rankings.wins} />
        <ScoresRanking players={rankings.scores} />
        <GeneralasServidasRanking generalasServidas={rankings.generalasServidas} />
      </div>
    </div>
  );
}
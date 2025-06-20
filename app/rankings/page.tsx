import { getRankings } from "@/database/api";
import { Ranking } from "@/database/types";
import WinsRanking from "./winsRanking";
import ScoresRanking from "./scoresRanking";

export default async function Rankings() {
  const rankings: Ranking = await getRankings();
  return (
    <div>
      <h1>Rankings</h1>
      <WinsRanking players={rankings.wins} />
      <ScoresRanking players={rankings.scores} />
    </div>
  );
}
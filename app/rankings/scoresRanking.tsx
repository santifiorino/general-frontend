import { Player } from "@/database/types";

interface ScoresRankingProps {
    players: Player[]
}

export default function ScoresRanking({ players }: ScoresRankingProps) {
    return (
        <div>
            <h2>Scores Ranking</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>{player.name} - {player.maxScore}</li>
                ))}
            </ul>
        </div>
    )
}
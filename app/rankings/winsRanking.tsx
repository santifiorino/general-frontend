import { Player } from "@/database/types";

interface WinsRankingProps {
    players: Player[]
}

export default function WinsRanking({ players }: WinsRankingProps) {
    return (
        <div>
            <h2>Wins Ranking</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>{player.name}: {player.wins}</li>
                ))}
            </ul>
        </div>
    )
}
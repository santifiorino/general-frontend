import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Player } from "@/database/types";
import { cn } from "@/lib/utils";

interface ScoresRankingProps {
  players: Player[];
}

const top3Styles = [
  "text-yellow-500 text-2xl font-bold", // Gold
  "text-gray-500 text-xl font-semibold", // Silver
  "text-orange-500 text-lg font-medium", // Bronze
];

export default function ScoresRanking({ players }: ScoresRankingProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Puntaje Máximo</h2>
      </div>
      <div className="p-6 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Pos.</TableHead>
              <TableHead>Jugador</TableHead>
              <TableHead className="text-right">Puntaje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player, index) => (
              <TableRow
                key={player.id}
                className={cn(index < 3 && top3Styles[index])}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell className="text-right">{player.maxScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
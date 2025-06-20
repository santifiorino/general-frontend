import { Player } from "@/database/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const scoreCategories: (keyof Player)[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "Escalera",
  "Full",
  "Poker",
  "Generala",
  "Generala Doble",
];

export function ScoreTable({ players }: { players: Player[] }) {
  const totals = players.map((player) => {
    return scoreCategories.reduce((acc, category) => {
      const score = player[category];
      return acc + (typeof score === "number" ? score : 0);
    }, 0);
  });
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Jugada</TableHead>
          {players.map((player) => (
            <TableHead key={player.id} className="text-center">
              {player.name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {scoreCategories.map((category) => (
          <TableRow key={category}>
            <TableCell>{category}</TableCell>
            {players.map((player) => (
              <TableCell key={player.id} className="text-center">
                {player[category] ?? "-"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          {totals.map((total, index) => (
            <TableCell key={players[index].id} className="text-center">
              {total}
            </TableCell>
          ))}
        </TableRow>
      </TableFooter>
    </Table>
  );
}

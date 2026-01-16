import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertWinsToPlayers } from "@/database/api";
import { Ranking } from "@/database/types";

interface YearlyTopWinnersProps {
  winsByKey: Ranking["wins"];
}

export default function YearlyTopWinners({ winsByKey }: YearlyTopWinnersProps) {
  const current = new Date().getFullYear();
  const start = 2025;
  const years: number[] = [];
  for (let y = current - 1; y >= start; y--) {
    years.push(y);
  }

  const rows = years.map((year) => {
    const data = convertWinsToPlayers(winsByKey?.[String(year)] ?? {});
    const top = data[0];
    return {
      year,
      name: top?.name ?? "—",
      wins: top?.wins ?? 0,
    };
  });

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Ganadores por año</h2>
      </div>
      <div className="p-6 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Año</TableHead>
              <TableHead>Jugador</TableHead>
              <TableHead className="text-right">Victorias</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.year}>
                <TableCell className="font-medium">{row.year}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell className="text-right">{row.wins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

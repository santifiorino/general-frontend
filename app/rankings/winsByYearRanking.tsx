"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Player } from "@/database/types";
import { getRankingsByYear } from "@/database/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WinsByYearRankingProps {
  initialYear: number;
  initialPlayers: Player[];
  totalsPlayers: Player[];
}

const top3Styles = [
  "text-yellow-500 text-2xl font-bold", // Gold
  "text-gray-500 text-xl font-semibold", // Silver
  "text-orange-500 text-lg font-medium", // Bronze
];

export default function WinsByYearRanking({
  initialYear,
  initialPlayers,
  totalsPlayers,
}: WinsByYearRankingProps) {
  const [selected, setSelected] = useState<number | "totales">(initialYear);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [loading, setLoading] = useState<boolean>(false);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const start = 2025;
    const list: number[] = [];
    for (let y = current; y >= start; y--) {
      list.push(y);
    }
    return list;
  }, []);

  useEffect(() => {
    if (selected === "totales") {
      setPlayers(totalsPlayers);
      return;
    }
    if (selected === initialYear) {
      setPlayers(initialPlayers);
      return;
    }
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const ranking = await getRankingsByYear(selected as number);
        if (!cancelled) setPlayers(ranking.wins);
      } catch {
        // Keep last successful data on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [selected, initialYear, initialPlayers, totalsPlayers]);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Victorias
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className={cn(
                  "px-2 py-0 h-auto font-bold text-2xl leading-none",
                  "hover:bg-transparent hover:underline underline-offset-4 align-baseline"
                )}
              >
                {selected === "totales" ? "Totales" : selected}
                <ChevronDown className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onSelect={() => setSelected("totales")}
                className={cn(selected === "totales" && "font-semibold")}
              >
                Totales
              </DropdownMenuItem>
              {years.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onSelect={() => setSelected(year)}
                  className={cn(year === selected && "font-semibold")}
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </h2>
      </div>
      <div className="p-6 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Pos.</TableHead>
              <TableHead>Jugador</TableHead>
              <TableHead className="text-right">Victorias</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player, index) => (
              <TableRow
                key={`${player.id}-${selected}`}
                className={cn(index < 3 && top3Styles[index])}
                aria-busy={loading}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell className="text-right">{player.wins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && (
          <div className="mt-2 text-sm text-muted-foreground">Cargando…</div>
        )}
      </div>
    </div>
  );
}

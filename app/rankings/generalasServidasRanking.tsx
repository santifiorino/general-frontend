import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GeneralaServidaLog } from "@/database/types";

interface GeneralsServidasRankingProps {
  generalasServidas: GeneralaServidaLog[];
}

export default function GeneralasServidasRanking({
  generalasServidas,
}: GeneralsServidasRankingProps) {
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("es-ES", { month: "long" });
    const year = date.getFullYear();
    return `${day} de ${
      month.charAt(0).toUpperCase() + month.slice(1)
    } del ${year}`;
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Generalas Servidas</h2>
      </div>
      <div className="p-6 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jugador</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generalasServidas.map((generalaServida) => (
              <TableRow key={generalaServida.id}>
                <TableCell>{generalaServida.winnerName}</TableCell>
                <TableCell className="text-right">
                  {formatDate(new Date(generalaServida.createdAt))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

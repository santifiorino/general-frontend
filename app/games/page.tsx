import { BackButton } from "@/components/back-button";
import { getGames } from "@/database/api";
import { Game } from "@/database/types";
import { Award, Trophy, BadgeCheck, BadgeX, CircleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default async function GamesPage() {
  const games: Game[] = await getGames();

  const totalGames = games.length;
  const rankedGames = games.filter((game) => game.players.length > 4).length;

  const formatDateTime = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("es-ES", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    return `${day} de ${capitalizedMonth} del ${year}, ${hours}:${minutes}`;
  };

  return (
    <div className="container mx-auto p-4">
      <BackButton />
      <h1 className="text-4xl font-bold mt-4 mb-4">Games</h1>
      <div className="text-muted-foreground text-sm mb-2">
        <p>Total: {totalGames + 29}</p>
        <p>Ranked: {rankedGames + 29}</p>
      </div>
      <div className="space-y-4">
        {games.map((game) => (
          <Link
            href={`/games/${game.id}`}
            key={game.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {formatDateTime(new Date(game.createdAt))}
              </h2>
              <div className="flex flex-wrap gap-2">
                {game.players.length > 4 && (
                  <Badge
                    variant={"outline"}
                    className="text-sm font-mono text-green-500"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    RANKED
                  </Badge>
                )}
                {game.players.length < 5 && (
                  <Badge
                    variant={"outline"}
                    className="text-sm font-mono text-muted-foreground"
                  >
                    <BadgeX className="h-4 w-4" />
                    UNRANKED
                  </Badge>
                )}
                {game.generalaServida && (
                  <Badge
                    variant={"outline"}
                    className="text-sm font-mono text-yellow-500"
                  >
                    <Trophy className="h-4 w-4" />
                    GENERALA SERVIDA
                  </Badge>
                )}
                {game.winnerId == null && (
                  <Badge
                    variant={"outline"}
                    className="text-sm font-mono text-red-500"
                  >
                    <CircleAlert className="h-4 w-4" />
                    SIN FINALIZAR
                  </Badge>
                )}
              </div>
              <Separator className="my-3" />
              <div className="flex flex-wrap gap-2 mt-2">
                {game.players.map((player) => (
                  <Badge
                    key={player.id}
                    variant={game.winnerId === player.id ? "gold" : "outline"}
                  >
                    {game.winnerId === player.id && (
                      <Award className="h-4 w-4" />
                    )}
                    {player.name}
                  </Badge>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-4 text-muted-foreground text-sm">
        El registro oficial de partidas comenzó el 20 de Junio de 2025. Las 29
        partidas anteriores están incluidas en el
        ranking.
      </div>
    </div>
  );
}

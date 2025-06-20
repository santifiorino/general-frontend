import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { getGames } from "@/database/api";
import { Game } from "@/database/types";
import { Dices } from "lucide-react";
import Link from "next/link";

export default async function GamesPage() {
  const games: Game[] = await getGames();

  return (
    <div className="container mx-auto p-4">
      <BackButton />
      <h1 className="text-4xl font-bold my-4">TO-DO</h1>
    </div>
  );
}
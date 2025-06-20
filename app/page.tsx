"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/user-picker";
import { fetchUsers, startGame } from "@/database/api";
import { Player } from "@/database/types";
import { useRouter } from "next/navigation";

export default function Home() {
  const [users, setUsers] = useState<Player[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const handleStartGame = async (selectedPlayers: Player[]) => {
    const result = await startGame(selectedPlayers);
    router.push(`/games/${result.gameId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nueva Partida</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Selecciona y ordena los jugadores que participarán en la partida.
      </p>
      <DataTable data={users} onStartGame={handleStartGame} />
    </div>
  );
}

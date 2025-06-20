import { Player, Game, Score } from "./types";

import { loadEnvConfig } from "@next/env";
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

// Helper function to get headers with authorization
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (API_TOKEN) {
    headers["Authorization"] = `Bearer ${API_TOKEN}`;
  }

  return headers;
}

export async function fetchUsers(): Promise<Player[]> {
  const response = await fetch(`${API_URL}/players`, {
    headers: getHeaders(),
  });
  return response.json();
}

export async function startGame(
  players: Player[],
): Promise<{ gameId: string }> {
  const res = await fetch(`${API_URL}/games`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      players: players.map(({ id, name }) => ({ id, name })),
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to start game");
  }
  const { id } = await res.json();
  return { gameId: id };
}

export async function getGame(gameId: string): Promise<Game> {
  const res = await fetch(`${API_URL}/games/${gameId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch game");
  }
  const {
    winner_id,
    generala_servida,
    created_at,
    players,
    scores,
    ...gameData
  } = await res.json();

  const sortedPlayers = players.sort(
    (a: Player, b: Player) => (a.order || 0) - (b.order || 0),
  );

  return {
    ...gameData,
    players: sortedPlayers,
    winnerId: winner_id,
    generalaServida: generala_servida,
    createdAt: new Date(created_at),
    scores: scores || [],
  };
}

export async function setScore(
  gameId: string,
  score: { playerId: string; scoreCategory: string; score: number },
): Promise<{ winnerId: string | null; score: Score }> {
  const res = await fetch(
    `${API_URL}/games/${gameId}/players/${score.playerId}/scores`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        category: score.scoreCategory,
        score: score.score,
      }),
    },
  );
  if (!res.ok) {
    throw new Error("Failed to set score");
  }
  const { winner_id, ...scoreData } = await res.json();
  return { winnerId: winner_id, score: scoreData as Score };
}

export async function deleteScore(
  gameId: string,
  playerId: string,
  category: string,
): Promise<void> {
  const res = await fetch(
    `${API_URL}/games/${gameId}/players/${playerId}/scores/${category}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    },
  );
  if (!res.ok) {
    throw new Error("Failed to delete score");
  }
}

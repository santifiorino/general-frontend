import { Player, Game, Score, Ranking } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

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

export async function startGame(players: Player[]): Promise<{ id: string }> {
  const res = await fetch(`${API_URL}/games`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      players: players.map(({ id, name, isGuest }) => ({
        id: isGuest ? null : id,
        name,
        isGuest: !!isGuest,
      })),
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to start game");
  }
  return res.json();
}

export async function getGame(gameId: string): Promise<Game> {
  const res = await fetch(`${API_URL}/games/${gameId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch game");
  }
  const game = await res.json();

  return {
    ...game,
    createdAt: new Date(game.createdAt),
  };
}

export async function setScore(
  gameId: string,
  score: { playerId: string; scoreCategory: string; score: number }
): Promise<{ winnerId: string[]; score: Score }> {
  const res = await fetch(
    `${API_URL}/games/${gameId}/players/${score.playerId}/scores`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        category: score.scoreCategory,
        score: score.score,
      }),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to set score");
  }
  const { winnerId, ...scoreData } = await res.json();
  return { winnerId, score: scoreData as Score };
}

export async function deleteScore(
  gameId: string,
  playerId: string,
  category: string
): Promise<void> {
  const res = await fetch(
    `${API_URL}/games/${gameId}/players/${playerId}/scores/${category}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to delete score");
  }
}

export async function setWinner(
  gameId: string,
  winnerId: string
): Promise<void> {
  const res = await fetch(`${API_URL}/games/${gameId}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ winnerId }),
  });

  if (!res.ok) {
    throw new Error("Failed to set winner");
  }
}

export async function getRankings(): Promise<Ranking> {
  const res = await fetch(`${API_URL}/rankings`, {
    headers: getHeaders(),
    cache: "no-store",
  });
  return res.json();
}

export function convertWinsToPlayers(winsInput: unknown): Player[] {
  if (Array.isArray(winsInput)) {
    const arr = winsInput as Array<Partial<Player>>;
    const normalized = arr.map((p, idx) => ({
      id: String(p?.id ?? p?.name ?? idx),
      name: String(p?.name ?? p?.id ?? `Jugador ${idx + 1}`),
      wins: typeof p?.wins === "number" ? p.wins : 0,
    }));
    normalized.sort((a, b) => (b.wins ?? 0) - (a.wins ?? 0));
    return normalized;
  }

  if (winsInput && typeof winsInput === "object") {
    const entries = Object.entries(winsInput as Record<string, unknown>);
    const players: Player[] = entries.map(([key, value], idx) => {
      if (typeof value === "number") {
        return { id: key, name: key, wins: value };
      }
      if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        const winsVal =
          typeof obj.wins === "number"
            ? (obj.wins as number)
            : typeof (obj as Player).wins === "number"
              ? ((obj as Player).wins as number)
              : 0;
        const nameVal =
          typeof obj.name === "string" ? (obj.name as string) : key;
        const idVal =
          typeof obj.id === "string"
            ? (obj.id as string)
            : String(obj.id ?? nameVal ?? key ?? idx);
        return { id: idVal, name: nameVal, wins: winsVal };
      }
      return { id: key, name: key, wins: 0 };
    });
    players.sort((a, b) => (b.wins ?? 0) - (a.wins ?? 0));
    return players;
  }

  return [];
}

export async function getRankingsByYear(
  year: number
): Promise<{ wins: Player[] }> {
  // Fetch the full rankings and extract the requested year locally to avoid
  // depending on backend query params support.
  const rankings = await getRankings();
  const yearKey = String(year);
  const yearWinsMap =
    (rankings.wins && rankings.wins[yearKey]) !== undefined
      ? rankings.wins[yearKey]
      : {};
  return { wins: convertWinsToPlayers(yearWinsMap ?? {}) };
}

export async function getGames(): Promise<Game[]> {
  const res = await fetch(`${API_URL}/games`, {
    headers: getHeaders(),
    cache: "no-store",
  });
  const games = await res.json();
  return games.map((game: Game) => ({
    ...game,
    createdAt: new Date(game.createdAt),
  }));
}

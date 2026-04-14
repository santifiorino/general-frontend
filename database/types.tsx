export type Player = {
  id: string;
  name: string;
  isGuest?: boolean;
  order?: number;
  wins?: number;
  maxScore?: number;
  "1"?: number | null;
  "2"?: number | null;
  "3"?: number | null;
  "4"?: number | null;
  "5"?: number | null;
  "6"?: number | null;
  Escalera?: number | null;
  Full?: number | null;
  Poker?: number | null;
  Generala?: number | null;
  "Generala Doble"?: number | null;
};

export type Game = {
  id: string;
  players: Player[];
  turn: number;
  winnerId: string | null;
  generalaServida: boolean;
  createdAt: Date;
  scores: Score[];
};

export type Score = {
  id: number;
  category: string;
  score: number;
  playerId: number;
  createdAt: string;
};

export const scores: Record<string, number[]> = {
  "1": [0, 1, 2, 3, 4, 5],
  "2": [0, 2, 4, 6, 8, 10],
  "3": [0, 3, 6, 9, 12, 15],
  "4": [0, 4, 8, 12, 16, 20],
  "5": [0, 5, 10, 15, 20, 25],
  "6": [0, 6, 12, 18, 24, 30],
  Escalera: [0, 20, 25],
  Full: [0, 30, 35],
  Poker: [0, 40, 45],
  Generala: [0, 50],
  "Generala Doble": [0, 100],
  "Generala Servida": [],
};

export type GeneralaServidaLog = {
  id: number;
  winnerName: string;
  createdAt: Date;
};

export type Ranking = {
  wins: Record<string, Record<string, number>>;
  scores: Player[];
  generalasServidas: GeneralaServidaLog[];
};

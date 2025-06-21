"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Player } from "@/database/types";
import {
  getGame,
  setScore,
  deleteScore,
  setWinner as apiSetWinner,
} from "@/database/api";
import { ScoreTable } from "./scoreTable";
import { ControlPage } from "./controlPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/back-button";
import { TieBreakDialog } from "@/components/tieBreakDialog";

import { Score, scores } from "@/database/types";

export default function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const backTo = searchParams.get("back_to");
  const [turn, setTurn] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [history, setHistory] = useState<Score[]>([]);
  const [generalaServida, setGeneralaServida] = useState<boolean>(false);
  const [tiedPlayers, setTiedPlayers] = useState<Player[]>([]);

  useEffect(() => {
    getGame(id).then((game) => {
      const gamePlayers = game.players.sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      );
      setPlayers(gamePlayers);
      setTurn(game.turn);
      setHistory(game.scores);
      setGeneralaServida(game.generalaServida);

      if (game.winnerId) {
        const winnerPlayer = game.players.find((p) => p.id === game.winnerId);
        setWinner(winnerPlayer || null);
      } else {
        setWinner(null);
      }
    });
  }, [id]);

  const handleSetWinner = useCallback(
    async (winnerId: string) => {
      await apiSetWinner(id, winnerId);
      const winnerPlayer = players.find((p) => p.id === winnerId);
      if (winnerPlayer) {
        setWinner(winnerPlayer);
      }
      setTiedPlayers([]);
    },
    [id, players],
  );

  useEffect(() => {
    if (
      players.length > 0 &&
      turn >= players.length * (Object.keys(scores).length - 1) &&
      !winner
    ) {
      const scoreCategories = Object.keys(scores).filter(
        (c) => c !== "Generala Servida",
      );

      const calculateTotalScore = (player: Player) => {
        return scoreCategories.reduce((total, category) => {
          const key = category as keyof Player;
          return total + (Number(player[key]) || 0);
        }, 0);
      };

      const playerScores = players.map((p) => ({
        player: p,
        totalScore: calculateTotalScore(p),
      }));

      if (playerScores.length > 0) {
        const maxScore = Math.max(...playerScores.map((ps) => ps.totalScore));
        const winners = playerScores
          .filter((ps) => ps.totalScore === maxScore)
          .map((ps) => ps.player);

        if (winners.length > 1) {
          if (tiedPlayers.length === 0) {
            setTiedPlayers(winners);
          }
        } else if (winners.length === 1) {
          handleSetWinner(winners[0].id);
        }
      }
    }
  }, [turn, players, winner, tiedPlayers, handleSetWinner]);

  const handleScoreSelect = async (value: number, category: string) => {
    const scoreData = {
      playerId: players[turn % players.length].id,
      score: value,
      scoreCategory: category,
    };

    setPlayers(
      players.map((player, index) => {
        if (index === turn % players.length) {
          return { ...player, [category]: value };
        }
        return player;
      }),
    );

    setTurn(turn + 1);

    const result = await setScore(id, scoreData);

    const newScore: Score = {
      ...result.score,
      category: category,
      score: value,
    };

    setHistory([...history, newScore]);

    if (result && result.winnerId.length == 1) {
      const winnerPlayer = players.find((p) => p.id === result.winnerId[0]);
      if (winnerPlayer) {
        setWinner(winnerPlayer);
      }
    }

    if (result && result.winnerId.length > 1) {
      const tied = players.filter((p) => result.winnerId.includes(p.id));
      setTiedPlayers(tied);
    }

    if (category === "Generala Servida") {
      setGeneralaServida(true);
    }
  };

  const handleUndo = async () => {
    const lastScore = history[history.length - 1];
    if (!lastScore) return;

    const lastPlayer = players[(turn - 1) % players.length];

    await deleteScore(id, lastPlayer.id, lastScore.category);

    setHistory(history.slice(0, -1));
    setPlayers(
      players.map((player) => {
        if (player.id === lastPlayer.id) {
          return { ...player, [lastScore.category]: null };
        }
        return player;
      }),
    );
    setTurn(turn - 1);
    setWinner(null);
  };

  const lastScore = history.length > 0 ? history[history.length - 1] : null;
  const lastPlayer =
    lastScore && players.length > 0
      ? players[(turn - 1) % players.length]
      : null;

  let undoText = "";
  if (lastScore && lastPlayer) {
    const { category, score } = lastScore;
    const playerName = lastPlayer.name;
    const isNumberCategory = ["1", "2", "3", "4", "5", "6"].includes(category);

    if (score === 0) {
      const article = ["Escalera", "Generala", "Generala Doble"].includes(
        category,
      )
        ? "la"
        : "el";
      undoText = `${playerName} tachó ${article} ${category}`;
    } else if (isNumberCategory) {
      undoText = `${playerName} anotó ${score} al ${category}`;
    } else {
      if (score % 10 === 5) {
        // Servido
        const letter = ["Escalera", "Generala", "Generala Doble"].includes(
          category,
        )
          ? "a"
          : "o";
        const servidoText = "Servid" + letter;
        undoText = `${playerName} anotó ${category} ${servidoText}`;
      } else {
        // No servido
        undoText = `${playerName} anotó ${category}`;
      }
    }
  }

  if (winner) {
    return (
      <div className="container mx-auto p-4">
        <BackButton href={backTo || "/"} />
        <h1 className="text-center font-mono">GANADOR:</h1>
        <h2 className="text-center text-4xl font-extrabold">{winner.name}</h2>
        {generalaServida && (
          <p className="text-center font-mono text-yellow-500 text-lg">
            GENERALA SERVIDA
          </p>
        )}

        <ScoreTable players={players} />
      </div>
    );
  } else {
    if (players.length === 0) {
      return (
        <div className="container mx-auto p-4">
          <h1>Cargando...</h1>
        </div>
      );
    }
  }

  return (
    <div className="flex justify-center">
      <Tabs defaultValue="control" className="w-[400px] mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="control">Control</TabsTrigger>
          <TabsTrigger value="scoreTable">Tabla</TabsTrigger>
        </TabsList>
        <TabsContent value="control">
          <ControlPage
            players={players}
            turn={turn}
            handleScoreSelect={handleScoreSelect}
            handleUndo={handleUndo}
            undoDisabled={history.length === 0}
            undoText={undoText}
          />
        </TabsContent>
        <TabsContent value="scoreTable">
          <div className="container">
            <h1 className="text-center font-mono my-4">TABLA DE PUNTOS</h1>
            <ScoreTable players={players} />
          </div>
        </TabsContent>
      </Tabs>
      <TieBreakDialog
        open={tiedPlayers.length > 0}
        players={tiedPlayers}
        onSelectWinner={handleSetWinner}
      />
    </div>
  );
}

"use client";

import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Player, scores } from "@/database/types";
import { ScoreDialog } from "./scoreDialog";
import { GeneralaServidaDialog } from "./generalaServidaDialog";
import React, { useState } from "react";

function StringButton({
  value,
  onClick,
  disabled,
}: {
  value: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="secondary"
      className="aspect-square w-full max-w-48 rounded-md h-auto"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-xl sm:text-xl font-bold leading-tight text-center whitespace-normal select-none">
        {value}
      </span>
    </Button>
  );
}

function IconButton({
  icon,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="secondary"
      className="aspect-square w-full max-w-48 rounded-md h-auto"
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </Button>
  );
}

interface ControlPageProps {
  players: Player[];
  turn: number;
  handleScoreSelect: (value: number, category: string) => void;
  handleUndo: () => void;
  undoDisabled: boolean;
  undoText?: string;
}

export function ControlPage({
  players,
  turn,
  handleScoreSelect,
  handleUndo,
  undoDisabled,
  undoText,
}: ControlPageProps) {
  const [selectedScoreCategory, setSelectedScoreCategory] = useState<
    string | null
  >(null);
  const [showGeneralaServidaDialog, setShowGeneralaServidaDialog] = useState(false);

  const handleCloseDialog = () => {
    setSelectedScoreCategory(null);
  };

  const handleCloseGeneralaServidaDialog = () => {
    setShowGeneralaServidaDialog(false);
  };

  const onScoreSelect = (value: number) => {
    if (selectedScoreCategory) {
      handleScoreSelect(value, selectedScoreCategory);
      setSelectedScoreCategory(null);
    }
  };

  const onGeneralaServidaConfirm = () => {
    handleScoreSelect(0, "Generala Servida");
    setShowGeneralaServidaDialog(false);
  };

  
  let dialogOptions: number[] = [];
  if (selectedScoreCategory) {
    const currentPlayer = players[turn % players.length];
    const baseOptions = scores[selectedScoreCategory] || [];
    if (
      selectedScoreCategory === "Generala" &&
      currentPlayer["Generala Doble"] === null
    ) { // Can't score 0 in generala if Generala Doble is not on 0 yet
      dialogOptions = baseOptions.filter((option) => option !== 0);
    } else if (
      selectedScoreCategory === "Generala Doble" &&
      currentPlayer["Generala"] !== 50
    ) { // Can't score 100 in generala doble if Generala is not on 50 yet
      dialogOptions = baseOptions.filter((option) => option !== 100);
    } else {
      dialogOptions = baseOptions;
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center font-mono">TURNO DE</h1>
      <h2 className="text-center text-4xl font-extrabold">
        {players[turn % players.length].name}
      </h2>

      {selectedScoreCategory && (
        <ScoreDialog
          options={dialogOptions}
          onClose={handleCloseDialog}
          onSelectScore={onScoreSelect}
        />
      )}

      {showGeneralaServidaDialog && (
        <GeneralaServidaDialog
          playerName={players[turn % players.length].name}
          onClose={handleCloseGeneralaServidaDialog}
          onConfirm={onGeneralaServidaConfirm}
        />
      )}

      <div className="grid grid-rows-4 gap-2 max-w-md w-full mx-auto mt-4">
        <div className="grid grid-cols-3 gap-2">
          <IconButton
            icon={<Dice1 className="size-20 sm:size-24" />}
            onClick={() => {
              setSelectedScoreCategory("1");
            }}
            disabled={players[turn % players.length]["1"] !== null}
          />
          <IconButton
            icon={<Dice2 className="size-20 sm:size-24" />}
            onClick={() => setSelectedScoreCategory("2")}
            disabled={players[turn % players.length]["2"] !== null}
          />
          <IconButton
            icon={<Dice3 className="size-20 sm:size-24" />}
            onClick={() => setSelectedScoreCategory("3")}
            disabled={players[turn % players.length]["3"] !== null}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <IconButton
            icon={<Dice4 className="size-20 sm:size-24" />}
            onClick={() => setSelectedScoreCategory("4")}
            disabled={players[turn % players.length]["4"] !== null}
          />
          <IconButton
            icon={<Dice5 className="size-20 sm:size-24" />}
            onClick={() => setSelectedScoreCategory("5")}
            disabled={players[turn % players.length]["5"] !== null}
          />
          <IconButton
            icon={<Dice6 className="size-20 sm:size-24" />}
            onClick={() => setSelectedScoreCategory("6")}
            disabled={players[turn % players.length]["6"] !== null}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StringButton
            value="Escalera"
            onClick={() => setSelectedScoreCategory("Escalera")}
            disabled={players[turn % players.length]["Escalera"] !== null}
          />
          <StringButton
            value="Full"
            onClick={() => setSelectedScoreCategory("Full")}
            disabled={players[turn % players.length]["Full"] !== null}
          />
          <StringButton
            value="Poker"
            onClick={() => setSelectedScoreCategory("Poker")}
            disabled={players[turn % players.length]["Poker"] !== null}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StringButton
            value="Generala"
            onClick={() => setSelectedScoreCategory("Generala")}
            disabled={players[turn % players.length]["Generala"] !== null}
          />
          <StringButton
            value="Generala Doble"
            onClick={() => setSelectedScoreCategory("Generala Doble")}
            disabled={
              players[turn % players.length]["Generala Doble"] !== null
            }
          />
          <StringButton
            value="Generala Servida"
            onClick={() => setShowGeneralaServidaDialog(true)}
            disabled={false}
          />
        </div>
      </div>
      <Button
        variant="default"
        className="w-full mt-4 h-auto"
        onClick={handleUndo}
        disabled={undoDisabled}
      >
        <div className="flex flex-col">
          <span className="font-bold">Deshacer</span>
          {!undoDisabled && undoText && (
            <span className="text-xs font-thin normal-case">({undoText})</span>
          )}
        </div>
      </Button>
    </div>
  );
}

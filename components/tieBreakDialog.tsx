"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Player } from "@/database/types";

interface TieBreakDialogProps {
  open: boolean;
  players: Player[];
  onSelectWinner: (playerId: string) => void;
}

export function TieBreakDialog({
  open,
  players,
  onSelectWinner,
}: TieBreakDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Empate</AlertDialogTitle>
          <AlertDialogDescription>
            Hubo un empate entre dos o más jugadores. Desempaten y seleccionen
            el ganador:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid grid-cols-1 gap-4 py-2">
          {players.map((player) => (
            <Button
              key={player.id}
              onClick={() => onSelectWinner(player.id)}
              variant="outline"
            >
              {player.name}
            </Button>
          ))}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

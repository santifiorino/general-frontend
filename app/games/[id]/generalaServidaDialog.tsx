import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface GeneralaServidaDialogProps {
  playerName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function GeneralaServidaDialog({
  playerName,
  onClose,
  onConfirm,
}: GeneralaServidaDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Confirmar</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-lg">
            Confirmar que <span className="font-bold">{playerName}</span> obtuvo una generala servida. Esto terminará la partida inmediatamente y le dará 2 victorias (en caso de ser una partida de 5 jugadores o más).
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={onConfirm}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
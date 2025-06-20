import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface ScoreDialogProps {
  options: number[];
  onClose: () => void;
  onSelectScore: (score: number) => void;
}

export function ScoreDialog({
  options,
  onClose,
  onSelectScore,
}: ScoreDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Puntaje</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <Button
              key={option}
              className="text-xl p-8"
              onClick={() => onSelectScore(option)}
            >
              {option === 0 ? "Tachar" : option}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

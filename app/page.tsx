import { Button } from "@/components/ui/button";
import { Dices, Trophy, List } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold"> Generala </h1>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <Link href="/games/new-game" passHref>
          <Button className="w-full" size="lg">
            <Dices />
            Nueva Partida
          </Button>
        </Link>
        <Link href="/rankings" passHref>
          <Button className="w-full" size="lg" variant="secondary">
            <Trophy />
            Rankings
          </Button>
        </Link>
        <Link href="/games" passHref>
          <Button className="w-full" size="lg" variant="secondary">
            <List />
            Historial
          </Button>
        </Link>
      </div>
    </div>
  );
}

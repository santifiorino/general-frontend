"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function BackButton({ href }: { href?: string }) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="aspect-square w-12 h-12 p-0"
      onClick={() => router.push(href || "/")}
    >
      <ChevronLeft className="size-6" />
    </Button>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;
    if (!apiToken) {
      setError(
        "La variable de entorno NEXT_PUBLIC_API_TOKEN no está configurada.",
      );
      return;
    }

    if (btoa(password) === apiToken) {
      localStorage.setItem("api_token", apiToken);
      router.push("/");
    } else {
      setError("Contraseña incorrecta.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-xs space-y-4">
        <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error: {error}</AlertTitle>
          </Alert>
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Contraseña"
          className="w-full px-3 py-2 border rounded-md"
        />
        <Button onClick={handleLogin} className="w-full">
          Entrar
        </Button>
      </div>
    </div>
  );
}

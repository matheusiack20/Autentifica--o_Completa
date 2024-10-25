"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LayoutAdmin({ children }) {
  const router = useRouter();
  const { status, error } = useSession();

  useEffect(() => {
    // Redireciona para a página de login se o usuário estiver não autenticado
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  if (error) {
    console.error("Erro ao verificar a sessão:", error);
    return <div>Erro ao carregar sessão. Por favor, tente novamente.</div>;
  }

  if (status === "authenticated") {
    return <div className="min-h-screen">{children}</div>;
  }

  return null;
}

// src\components\LayoutAdmin.jsx

"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LayoutAdmin({ children }) {
  const router = useRouter();
  const { status, error } = useSession();

  useEffect(() => {
    const checkSession = async () => {
      if (status === "unauthenticated") {
        router.push("/login");
      }
    };
  
    checkSession();
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

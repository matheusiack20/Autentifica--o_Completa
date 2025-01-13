"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    if (!token || !newPassword || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "/api/user/reset-pass",
        { token, newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setMessage("Senha redefinida com sucesso. Redirecionando para login...");
        setTimeout(() => {
          router?.push("/login");
        }, 3000);
      } else {
        setError(response.data.message || "Erro ao redefinir a senha.");
      }
    } catch (err) {
      console.error("Erro ao redefinir a senha:", err);
      setError("Erro ao redefinir a senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-[#2C2C2C] border border-[#d4ef00] rounded-lg w-full max-w-md text-center"
      >
        <h2 className="text-[#d4ef00] text-2xl mb-4">Redefinir Senha</h2>
        <p className="text-[#B3B3B3] mb-6">
          Insira o token enviado por e-mail, sua nova senha e confirme-a.
        </p>

        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          placeholder="Token"
          className="bg-[#3a3a3a] text-white p-2 rounded-md border border-[#d4ef00] w-full mb-4"
        />

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          placeholder="Nova Senha"
          className="bg-[#3a3a3a] text-white p-2 rounded-md border border-[#d4ef00] w-full mb-4"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirme a Nova Senha"
          className="bg-[#3a3a3a] text-white p-2 rounded-md border border-[#d4ef00] w-full mb-4"
        />

        <button
          type="submit"
          className={`p-2 bg-[#DAFD00] text-[#2a2a2a] rounded-md w-full rounded-md w-full ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Redefinindo..." : "Redefinir Senha"}
        </button>

        {message && <div className="text-green-500 mt-4">{message}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </form>
    </div>
  );
}

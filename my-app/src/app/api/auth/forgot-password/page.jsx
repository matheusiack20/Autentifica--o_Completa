// src/app/api/auth/forgot-password/page.jsx

"use client";

import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  // Declaração de estados para gerenciar o formulário e mensagens de feedback
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Função de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      console.log("Enviando solicitação de recuperação de senha para o e-mail:", email);

      // Validação simples para garantir que o e-mail foi fornecido
      if (!email) {
        console.log("Erro: Nenhum e-mail foi fornecido no formulário.");
        setError("Por favor, insira um e-mail válido.");
        setIsLoading(false);
        return;
      }

      // Requisição para a API de recuperação de senha
      const response = await axios.post(
        "/api/user/forgot-pass",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Resposta completa da API:", response);

      // Verificação do sucesso na resposta da API
      if (response.data.success) {
        console.log("Resposta da API: Sucesso - E-mail de recuperação enviado.");
        setMessage("Verifique seu e-mail para as instruções de redefinição de senha.");
      } else {
        console.log("Erro na resposta da API:", response.data.message);
        setError(response.data.message || "Erro ao enviar o e-mail de recuperação.");
      }
    } catch (err) {
      console.error("Erro ao enviar o e-mail de recuperação:", err);

      // Exibe uma mensagem de erro detalhada caso a API retorne um erro específico
      if (err.response && err.response.data && err.response.data.message) {
        console.log("Erro da API:", err.response.data.message);
        setError(`Erro: ${err.response.data.message}`);
      } else {
        setError("Erro ao enviar o e-mail de recuperação. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
      console.log("Finalizado o processo de recuperação de senha.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-[#2C2C2C] border border-[#d4ef00] rounded-lg w-full max-w-md text-center"
      >
        <h2 className="text-[#d4ef00] text-2xl mb-4">Esqueceu a Senha?</h2>
        <p className="text-[#B3B3B3] mb-6">
          Insira seu e-mail para receber instruções de redefinição de senha.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Digite seu e-mail"
          className="bg-[#3a3a3a] text-white p-2 rounded-md border border-[#d4ef00] w-full mb-4"
        />

        <button
          type="submit"
          className={`p-2 bg-[#DAFD00] text-[#2a2a2a] rounded-md w-full ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Enviar Instruções"}
        </button>

        {/* Exibe mensagens de sucesso ou erro, se existirem */}
        {message && <div className="text-green-500 mt-4">{message}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </form>
    </div>
  );
}

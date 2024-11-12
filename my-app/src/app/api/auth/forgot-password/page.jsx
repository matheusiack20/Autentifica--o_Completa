"use client";

import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      console.log("Enviando solicitação de recuperação de senha para o e-mail:", email);

      if (!email) {
        console.log("Erro: Nenhum e-mail foi fornecido no formulário.");
        setError("Por favor, insira um e-mail válido.");
        setIsLoading(false);
        return;
      }
      
      const response = await axios.post(
        "/api/user/forgot-pass", // Caminho da API ajustado
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      
      console.log("Resposta completa da API:", response);

      if (response.data.success) {
        console.log("Resposta da API: Sucesso - E-mail de recuperação enviado.");
        setMessage("Verifique seu e-mail para as instruções de redefinição de senha.");
      } else {
        console.log("Erro na resposta da API:", response.data.message);
        setError(response.data.message || "Erro ao enviar o e-mail de recuperação.");
      }
    } catch (err) {
      console.error("Erro ao enviar o e-mail de recuperação:", err);

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
          className={`p-2 bg-gradient-to-r from-[#1d1d1f] via-[#DAFD00] to-[#1d1d1f] text-[#2a2a2a] rounded-md w-full ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Enviar Instruções"}
        </button>

        {message && <div className="text-green-500 mt-4">{message}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </form>
    </div>
  );
}

"use client";

import LayoutAdmin from "../../components/LayoutAdmin";
import { useState } from "react";
import React from "react";
import Image from "next/image";
import faleconosco from "/public/Faleconosco.png"; // Corrigido o caminho da imagem

export default function Contato() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário enviados:", formData);

    // Simulação de envio bem-sucedido
    setFormStatus("success");
    setFormData({ name: '', email: '', message: '' });

    // Remover a mensagem de sucesso após alguns segundos
    setTimeout(() => setFormStatus(null), 3000);
  };

  return (
    <LayoutAdmin>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex items-center mb-4">
          <h1 className="text-[40px] text-[#DAFD00] font-bold mr-4">Fale Conosco</h1>
          <Image className="w-10 h-8" src={faleconosco} alt="Foto MAP" />
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 border border-[#DAFD00]"
        >
          <div className="mb-4">
            <label className="block text-[#DAFD00] font-semibold mb-2" htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-required="true"
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#DAFD00]"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-[#DAFD00] font-semibold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-required="true"
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#DAFD00]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#DAFD00] font-semibold mb-2" htmlFor="message">Mensagem</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              aria-required="true"
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#DAFD00]"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#DAFD00] text-gray-900 font-bold py-2 rounded hover:bg-yellow-500 transition duration-200"
          >
            Enviar Mensagem
          </button>

          {/* Feedback de sucesso */}
          {formStatus === "success" && (
            <p className="mt-4 text-green-500 text-center">Mensagem enviada com sucesso!</p>
          )}
        </form>
      </main>
    </LayoutAdmin>
  );
}

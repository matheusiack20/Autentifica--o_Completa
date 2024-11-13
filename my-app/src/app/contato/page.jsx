"use client";

import { useState } from "react";
import React from "react";
import Image from "next/image";
import faleconosco from "/public/Faleconosco.png";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await sendContactForm(formData);
      setFormStatus({ type: "success", message: "Mensagem enviada com sucesso!" });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setFormStatus({ type: "error", message: error.message || "Falha ao enviar a mensagem. Tente novamente." });
    }

    setTimeout(() => setFormStatus(null), 5000);
  };

  async function sendContactForm(formData) {
    try {
      const response = await fetch('/api/user/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Verifica se a resposta é JSON
      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text(); // Lê como texto se não for JSON
      }

      if (!response.ok) {
        throw new Error(responseData.message || `Erro na solicitação: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('Erro ao enviar o formulário de contato:', error);
      throw error;
    }
  }

  return (
    <main>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex items-center mb-4">
          <h1 className="text-[40px] text-[#DAFD00] font-bold mr-4">Fale Conosco</h1>
          <Image className="w-10 h-8" src={faleconosco} alt="Imagem de contato" />
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
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#DAFD00]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#DAFD00] text-gray-900 font-bold py-2 rounded hover:bg-yellow-500 transition duration-200"
          >
            Enviar Mensagem
          </button>

          {formStatus?.type === "success" && (
            <p className="mt-4 text-green-500 text-center">{formStatus.message}</p>
          )}
          {formStatus?.type === "error" && (
            <p className="mt-4 text-red-500 text-center">{formStatus.message}</p>
          )}
        </form>
      </main>
    </main>
  );
}

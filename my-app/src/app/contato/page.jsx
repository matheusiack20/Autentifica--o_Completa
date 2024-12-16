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
      await sendContactForm(formData);
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

      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
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
    <main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 lg:px-16 bg-black">
      <div className="flex items-center mb-6 flex-wrap justify-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#DAFD00] font-bold mr-4 mb-4 sm:mb-0 text-center">
          Fale Conosco
        </h1>
        <Image
          className="w-10 h-8 sm:w-12 sm:h-10"
          src={faleconosco}
          alt="Imagem de contato"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#2C2C2C] p-6 rounded-lg shadow-lg w-full max-w-md lg:max-w-lg border border-[#DAFD00] transition-all duration-300"
      >
        <div className="mb-4">
          <label className="block text-[#DAFD00] font-semibold mb-2" htmlFor="name">
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[white] text-black border border-gray-700 focus:outline-none focus:border-[#DAFD00]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#DAFD00] font-semibold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[white] text-black border border-gray-700 focus:outline-none focus:border-[#DAFD00]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#DAFD00] font-semibold mb-2" htmlFor="message">
            Mensagem
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-2 rounded bg-[white] text-black border border-gray-700 focus:outline-none focus:border-[#DAFD00]"
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
  );
}

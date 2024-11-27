'use client'
import React, { useState } from "react";

const Planos = () => {
  const [planType, setPlanType] = useState("anual");

  const handlePlanTypeChange = (type) => {
    setPlanType(type);
  };

  const plans = {
    anual: [
      {
        id: 1,
        title: "Plano Anual Olist",
        price: "R$ 1.900",
        originalPrice: "R$ 2.400",
        description: "Economize até R$ 500 com a oferta",
        features: [
          "Acesso ilimitado",
          "Suporte 24 hrs",
          "Funcionalidades premium",
        ],
      },
      {
        id: 2,
        title: "Plano Anual Bling",
        price: "R$ 1.900",
        originalPrice: "R$ 2.400",
        description: "Economize até R$ 500 com a oferta",
        features: [
          "Acesso ilimitado",
          "Suporte 24 hrs",
          "Funcionalidades premium",
        ],
      },
    ],
    mensal: [
      {
        id: 1,
        title: "Plano Mensal Olist",
        price: "R$ 190",
        originalPrice: "R$ 220",
        description: "Economize até R$ 30 com a oferta",
        features: [
          "Acesso ilimitado",
          "Suporte 24 hrs",
          "Funcionalidades premium",
        ],
      },
      {
        id: 2,
        title: "Plano Mensal Bling",
        price: "R$ 190",
        originalPrice: "R$ 220",
        description: "Economize até R$ 30 com a oferta",
        features: [
          "Acesso ilimitado",
          "Suporte 24 hrs",
          "Funcionalidades premium",
        ],
      },
    ],
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-6 py-12">
        {/* Título */}
        <div className="text-center">
          <h1 className="text-4xl text-[#DAFD00] font-bold mb-4">
            Escolha o melhor plano para você
          </h1>
          <br />
        </div>

        {/* Botão de Alternância */}
        <div className="flex justify-center mb-8">
          <div className="relative flex bg-gray-300 rounded-full overflow-hidden w-72 h-12 border-2 border-[#DAFD00]">
            <button
              className={`flex-1 text-center text-lg font-semibold py-2 transition-all duration-300 ${
                planType === "anual"
                  ? "bg-[#DAFD00] text-black shadow-md"
                  : "bg-transparent text-gray-800"
              }`}
              onClick={() => handlePlanTypeChange("anual")}
            >
              Anual
            </button>
            <button
              className={`flex-1 text-center text-lg font-semibold py-2 transition-all duration-300 ${
                planType === "mensal"
                  ? "bg-[#DAFD00] text-black shadow-md"
                  : "bg-transparent text-gray-800"
              }`}
              onClick={() => handlePlanTypeChange("mensal")}
            >
              Mensal
            </button>
          </div>
        </div>

        {/* Cards de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans[planType].map((plan) => (
            <div
              key={plan.id}
              className="bg-white text-black rounded-lg shadow-lg p-6 border-4 border-[#DAFD00]"
            >
              <center>
              <h2 className="text-xl font-bold mb-4">{plan.title}</h2>
              <p className="text-gray-500 line-through">{plan.originalPrice}</p>
              <p className="text-3xl font-bold text-black">{plan.price}</p>
              <p className="text-green-600 font-medium">{plan.description}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full bg-black text-white py-2 rounded-md hover:bg-[#333]">
                Assinar Agora
              </button>
              </center> 
            </div>
          ))}
        </div>
      </div>
      
      {/* Rodapé */}
      <footer className="text-center mt-12">
      </footer>
    </div>
  );
};

export default Planos;
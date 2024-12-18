'use client';
import React, { useState } from 'react';
import PlansPriceBoard from "../plansBoard"
import "../style.css"

const Planos = () => {
  const [planType] = useState('anual');
  const [loading, setLoading] = useState(false);

  const plans = {
    anual: [
      {
        id: 1,
        title: 'Plano Anual Olist',
        price: 1900,
        originalPrice: 'R$ 2.400',
        description: 'Economize até R$ 500 com a oferta',
        features: ['Acesso ilimitado', 'Suporte 24 hrs', 'Funcionalidades premium'],
      },
      {
        id: 2,
        title: 'Plano Anual Bling',
        price: 1900,
        originalPrice: 'R$ 2.400',
        description: 'Economize até R$ 500 com a oferta',
        features: ['Acesso ilimitado', 'Suporte 24 hrs', 'Funcionalidades premium'],
      },
    ],
    mensal: [
      {
        id: 3,
        title: 'Plano Mensal Olist',
        price: 190,
        originalPrice: 'R$ 220',
        description: 'Economize até R$ 30 com a oferta',
        features: ['Acesso ilimitado', 'Suporte 24 hrs', 'Funcionalidades premium'],
      },
      {
        id: 4,
        title: 'Plano Mensal Bling',
        price: 190,
        originalPrice: 'R$ 220',
        description: 'Economize até R$ 30 com a oferta',
        features: ['Acesso ilimitado', 'Suporte 24 hrs', 'Funcionalidades premium'],
      },
    ],
  };

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      console.log("Iniciando pagamento para o plano:", plan);
  
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: plan.title,
          amount: plan.price, // O preço enviado em reais
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        window.location.href = data.init_point;
      } else {
        console.error("Erro no backend:", data.error);
        alert("Erro ao iniciar pagamento. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao iniciar pagamento:", error);
      alert("Erro ao iniciar pagamento. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto py-12">
        <div className="text-center mb-8">
          <h1 id='titlecon'>
            Escolha o melhor plano para você
          </h1>

          {/* Seção de planos com flexbox */}
          <div className="flex justify-center gap-8">
            <PlansPriceBoard plans={plans[planType]} />
          </div>
        </div>

        {loading && <div className="text-center text-xl text-gray-300">Carregando...</div>}

      </div>
    </div>
  );
};

export default Planos;

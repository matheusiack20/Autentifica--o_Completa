'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import "./pagepublic.css";

export default function PublicPage() {
  const [planType, setPlanType] = useState("anual");
  const planSectionRef = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handlePlanTypeChange = (selectedPlanType) => {
    setPlanType(selectedPlanType);
  };

  const handleSubscriptionClick = async (selectedPlanType, productType, setButtonLoading) => {
    if (!session) {
      router.push("/login"); // Redireciona para a página de login se o usuário não estiver autenticado
      return;
    }

    setButtonLoading(true);

    try {
      const response = await fetch("/api/user/createcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: selectedPlanType,
          productType: productType.toLowerCase(), // Envia o tipo de produto em minúsculas
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url; // Redireciona para o gateway de pagamento
      } else {
        const errorResponse = await response.json();
        console.error("Erro:", errorResponse.error);
        alert(`Erro: ${errorResponse.error}`);
      }
    } catch (error) {
      console.error("Erro ao processar a assinatura:", error.message);
      alert("Erro inesperado. Tente novamente mais tarde.");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white">
      <h2 ref={planSectionRef} className="text-4xl font-bold text-center mb-8 text-[#DAFD00]">
        Escolha o melhor plano para você
      </h2>
      <div className="flex justify-center mb-8">
        <div className="flex border-2 border-gray-400 rounded-full overflow-hidden">
          <button
            className={`px-10 py-3 ${planType === "anual" ? "bg-[#DAFD00] text-black font-semibold" : "bg-gray-300 text-gray-800"} transition-all duration-300`}
            onClick={() => handlePlanTypeChange("anual")}
          >
            Anual
          </button>
          <button
            className={`px-10 py-3 ${planType === "mensal" ? "bg-[#DAFD00] text-black font-semibold" : "bg-gray-300 text-gray-800"} transition-all duration-300`}
            onClick={() => handlePlanTypeChange("mensal")}
          >
            Mensal
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-screen-lg">
        {planType === "mensal" ? (
          <>
            <PlanCard 
              title="Plano Mensal Olist" 
              originalPrice="R$ 220" 
              discountedPrice="R$ 190" 
              duration="por 1 ano" 
              discount="Economize até R$ 30 com a oferta"
              onSubscribeClick={(setButtonLoading) => handleSubscriptionClick("mensal", "Olist", setButtonLoading)}
            />
            <PlanCard 
              title="Plano Mensal Bling" 
              originalPrice="R$ 220" 
              discountedPrice="R$ 190" 
              duration="por 1 ano" 
              discount="Economize até R$ 30 com a oferta"
              onSubscribeClick={(setButtonLoading) => handleSubscriptionClick("mensal", "Bling", setButtonLoading)}
            />
          </>
        ) : (
          <>
            <PlanCard 
              title="Plano Anual Olist" 
              originalPrice="R$ 2.400" 
              discountedPrice="R$ 1.900" 
              duration="por 1 ano" 
              discount="Economize até R$ 500 com a oferta"
              onSubscribeClick={(setButtonLoading) => handleSubscriptionClick("anual", "Olist", setButtonLoading)}
            />
            <PlanCard 
              title="Plano Anual Bling" 
              originalPrice="R$ 2.400" 
              discountedPrice="R$ 1.900" 
              duration="por 1 ano" 
              discount="Economize até R$ 500 com a oferta"
              onSubscribeClick={(setButtonLoading) => handleSubscriptionClick("anual", "Bling", setButtonLoading)}
            />
          </>
        )}
      </div>
    </main>
  );
}

function PlanCard({ title, originalPrice, discountedPrice, duration, discount, onSubscribeClick }) {
  const [buttonLoading, setButtonLoading] = useState(false);

  return (
    <div className="w-80 p-6 rounded-lg border-4 border-[#DAFD00] bg-white text-center shadow-lg">
      <h3 className="text-xl font-semibold mb-2 text-black">{title}</h3>
      <p className="text-gray-500 line-through">{originalPrice}</p>
      <p className="text-3xl font-bold text-black">{discountedPrice}</p>
      <p className="text-gray-500 mb-4">{duration}</p>
      <p className="text-green-800 mb-4">{discount}</p>
      <button
        className="px-6 py-2 bg-black text-white border border-black rounded-lg hover:bg-[#DAFD00] hover:text-black transition-all duration-300"
        onClick={() => onSubscribeClick(setButtonLoading)}
        disabled={buttonLoading}
      >
        {buttonLoading ? "Processando..." : "Assinar Agora"}
      </button>
      <ul className="text-left mt-4 text-green-700 space-y-1">
        <li>✓ Acesso ilimitado</li>
        <li>✓ Suporte 24 hrs</li>
        <li>✓ Funcionalidades premium</li>
      </ul>
    </div>
  );
}

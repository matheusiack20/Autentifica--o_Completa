'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import './globals.css';
import './style.css';
import './sobre/pagepublic.css';
import './ToggleSwitch.css';
import PlansPriceBoard from "../app/plansBoard"


import imageminteligenciaesq from '../../public/Inteligenciaartificialfoto1.png';
import Anuncia from '../../public/anuncIAlogo[1].png';

export default function Home() {
  const [planType, setPlanType] = useState('anual');
  const [loading, setLoading] = useState(false);
  const planSectionRef = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();

  // Define o valor para os planos
  const planPrices = {
    mensal: {
      Olist: 19000, // R$ 190,00
      Bling: 19000, // R$ 190,00
    },
    anual: {
      Olist: 190000, // R$ 1.900,00
      Bling: 190000, // R$ 1.900,00
    },
  };

  const handlePlanTypeChange = (selectedPlanType) => setPlanType(selectedPlanType);

  const scrollToPlans = () => {
    if (planSectionRef.current) {
      planSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubscriptionClick = async (planType, planName) => {
    const amount = planPrices[planType][planName];
    const title = `${planName} - Assinatura ${planType.charAt(0).toUpperCase() + planType.slice(1)}`;
    const email = session?.user?.email || 'usuario@exemplo.com';

    setLoading(true);

    try {
      const response = await fetch('/api/user/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, amount, email, planType }),
      });

      if (!response.ok) throw new Error('Erro ao processar a assinatura.');

      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point; // Redireciona para o link do Mercado Pago
      } else {
        throw new Error('Erro ao gerar o link de pagamento.');
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Seção Inicial */}
      <center>
        <div className="containerhome">
          <Image
            src={imageminteligenciaesq}
            alt="Inteligência Artificial à esquerda"
            className="imagem-left"
          />
          <div className="boxinit_center">
            <center>
              <Image src={Anuncia} alt="Logo AnuncIA" priority />
            </center>
            <h2>Economize tempo e crie anúncios de qualidade em um clique</h2>
            <button id="buttoninit" onClick={scrollToPlans}>
              Experimente Agora
            </button>
          </div>
          <hr />
        </div>
      </center>

      {/* Sobre o Produto */}
      <section className="containerpublic">
        <br />
        <h1 id="titlecon">Sobre o Produto</h1>
        <h2 id="subtitle">
          Transforme seu produto em uma estrela: títulos e descrições que vendem!
        </h2>
        <p id="textop">
          Apresentamos o AnuncIA, a solução inovadora que transforma a forma como você apresenta seus produtos.
          Com nossa plataforma, basta inserir o título e a descrição do seu produto, e, utilizando a poderosa API
          do ChatGPT, geramos títulos e descrições irresistíveis que capturam a atenção do seu público-alvo.
          Aumente suas vendas e destaque-se da concorrência com AnuncIA – onde a criatividade se encontra com a eficácia!
        </p>
        <br />
        <div className="dpage">
          <video autoPlay muted loop>
            <source src="/video_teste.mp4" type="video/mp4" />
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        </div>
        <br />
        <button id="saibamaispersona" onClick={scrollToPlans}>
          Experimentar Agora
        </button>
      </section>
      <br />

      {/* Seção de Planos */}
      <section>
        <h2 id="titlecon" ref={planSectionRef}>
          Escolha o melhor plano para você
        </h2>
        <br />
        <PlansPriceBoard />


      <br />
      </section>
    </main>
  );
}

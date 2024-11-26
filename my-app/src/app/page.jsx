'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import './globals.css';
import './style.css';
import './sobre/pagepublic.css';
import './ToggleSwitch.css';

import imageminteligenciaesq from '../../public/Inteligenciaartificialfoto1.png';
import Anuncia from '../../public/anuncIAlogo[1].png';

export default function Home() {
  const [planType, setPlanType] = useState('anual');
  const [loading, setLoading] = useState(false);
  const planSectionRef = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handlePlanTypeChange = (selectedPlanType) => {
    setPlanType(selectedPlanType);
  };

  const scrollToPlans = () => {
    if (planSectionRef.current) {
      planSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleSubscriptionClick = async (selectedPlanType, productType) => {
    if (!session) {
      router.push('/login'); // Direciona para a página de login se não estiver logado
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/createcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: selectedPlanType,
          productType: productType.toLowerCase(), // Garantir que o tipo do produto esteja em minúsculas
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url; // Redireciona para o gateway de pagamento
      } else {
        const errorResponse = await response.json();
        console.error('Erro:', errorResponse.error);
        alert(`Erro: ${errorResponse.error}`);
      }
    } catch (error) {
      console.error('Erro ao processar a assinatura:', error.message);
      alert('Erro inesperado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
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

      <section className="containerpublic">
        <br />
        <h1 id="titlecon">Sobre o Produto</h1>

        <h2 id="subtitle">
          Transforme seu produto em uma estrela: títulos e descrições que
          vendem!
        </h2>

        <p id="textop">
          Apresentamos o AnuncIA, a solução inovadora que transforma a forma
          como você apresenta seus produtos. Com nossa plataforma, basta inserir
          o título e a descrição do seu produto, e, utilizando a poderosa API do
          ChatGPT, geramos títulos e descrições irresistíveis que capturam a
          atenção do seu público-alvo. Aumente suas vendas e destaque-se da
          concorrência com AnuncIA – onde a criatividade se encontra com a
          eficácia!
        </p>

        <br />
        <br />

        <div className="dpage">
          <video autoPlay muted loop>
            <source src="/video_teste.mp4" type="video/mp4" />
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        </div>

        <br />
        <br />
        <br />
        
        <button id="saibamaispersona" onClick={scrollToPlans}>
          Experimentar
        </button>
      </section>

      <br />

      <section>
        <h2 id="titlecon" ref={planSectionRef}>
          Escolha o melhor plano para você
        </h2>
        <center>
          <div className="toggle-container">
            <div
              className={`toggle-switch ${planType === 'mensal' ? 'mensal-active' : 'anual-active'}`}
            >
              <div
                className={`toggle-option ${planType === 'anual' ? 'selected' : ''}`}
                onClick={() => handlePlanTypeChange('anual')}
              >
                Anual
              </div>
              <div
                className={`toggle-option ${planType === 'mensal' ? 'selected' : ''}`}
                onClick={() => handlePlanTypeChange('mensal')}
              >
                Mensal
              </div>
            </div>
          </div>

          <div className="plan-container">
            {planType === 'mensal' ? (
              <>
                <PlanCard
                  title="Plano Mensal Olist"
                  originalPrice="R$ 220"
                  discountedPrice="R$ 190"
                  duration="por 1 ano"
                  discount="Economize até R$ 30 com a oferta"
                  onSubscribeClick={() =>
                    handleSubscriptionClick('mensal', 'Olist')
                  }
                  loading={loading}
                />

                <PlanCard
                  title="Plano Mensal Bling"
                  originalPrice="R$ 220"
                  discountedPrice="R$ 190"
                  duration="por 1 ano"
                  discount="Economize até R$ 30 com a oferta"
                  onSubscribeClick={() =>
                    handleSubscriptionClick('mensal', 'Bling')
                  }
                  loading={loading}
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
                  onSubscribeClick={() =>
                    handleSubscriptionClick('anual', 'Olist')
                  }
                  loading={loading}
                />

                <PlanCard
                  title="Plano Anual Bling"
                  originalPrice="R$ 2.400"
                  discountedPrice="R$ 1.900"
                  duration="por 1 ano"
                  discount="Economize até R$ 500 com a oferta"
                  onSubscribeClick={() =>
                    handleSubscriptionClick('anual', 'Bling')
                  }
                  loading={loading}
                />
              </>
            )}
          </div>
          {loading && <div className="loading-indicator">Processando...</div>}
        </center>
        <br />
      </section>
    </main>
  );
}

function PlanCard({
  title,
  originalPrice,
  discountedPrice,
  duration,
  discount,
  onSubscribeClick,
  loading,
}) {
  return (
    <div className={`plan-card ${loading ? 'disabled' : ''}`}>
      <h3 className="plan-title">{title}</h3>
      <div className="plan-price">
        <span className="price-strikethrough">{originalPrice}</span>
        <span className="price-final">{discountedPrice}</span>
      </div>
      <p className="plan-duration">{duration}</p>
      <p className="plan-discount">{discount}</p>
      <button
        className="subscribe-btn"
        onClick={onSubscribeClick}
        disabled={loading}
      >
        {loading ? 'Processando...' : 'Assinar Agora'}
      </button>
      <div className="features">
        <p>✔ Acesso ilimitado</p>
        <p>✔ Suporte 24 hrs</p>
        <p>✔ Funcionalidades premium</p>
      </div>
    </div>
  );
}

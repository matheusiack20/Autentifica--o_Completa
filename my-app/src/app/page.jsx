'use client';
import { useRef } from 'react';
import Image from 'next/image';
import './globals.css';
import './style.css';
import './sobre/pagepublic.css';
import './ToggleSwitch.css';
import PlansPriceBoard from "../app/plansBoard";

import imageminteligenciaesq from '../../public/Inteligenciaartificialfoto1.png';
import Anuncia from '../../public/anuncIAlogo[1].png';

export default function Home() {
  const planSectionRef = useRef(null);

  const scrollToPlans = () => {
    if (planSectionRef.current) {
      planSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
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
      <div className="text-center mb-8">
        <h2 id="titlecon" ref={planSectionRef} className="mb-4">
          Escolha o melhor plano para você
          <br />
        </h2>
        <br />
        <PlansPriceBoard />
      </div>

    </main>
  );
}

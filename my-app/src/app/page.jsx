"use client";

import { useState, useRef } from "react";
import "./globals.css";
import "./style.css";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header/Header"; // Certifique-se de que este componente está sendo utilizado, caso contrário, pode ser removido.
import "./sobre/pagepublic.css";
import "./ToggleSwitch.css";

import imageminteligenciaesq from "../../public/Inteligenciaartificialfoto1.png";
import Anuncia from "../../public/anuncIA logo[1].png";
import im1 from "../../public/Pagina_inicial.png";
import im2 from "../../public/Foto1.png";
import im3 from "../../public/Foto2.png";

export default function Home() {
  const [planType, setPlanType] = useState("anual");
  const planSectionRef = useRef(null);

  const handlePlanTypeChange = (selectedPlanType) => {
    setPlanType(selectedPlanType);
  };

  const scrollToPlans = () => {
    planSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <div className="containerhome">
        <Image
          src={imageminteligenciaesq}
          alt="Inteligência Artificial à esquerda"
          className="imagem-left"
          priority
        />
        <div className="boxinit center">
          <center>
            <Image src={Anuncia} alt="AnuncIA" priority />
          </center>
          <h2>Economize tempo e crie anúncios de qualidade em um clique</h2>
          <button id="buttoninit" onClick={scrollToPlans}>
            Experimente Agora
          </button>
        </div>
        <hr />
      </div>

      <main>
        <div className="containerpublic">
          <h1 id="titlecon">Sobre o Produto</h1>
          <div className="dpage">
            <Image src={im2} alt="Foto cria produto 1" priority />
            <Image id="fotopaginit" src={im1} alt="Foto da Pagina Inicial" priority />
            <Image src={im3} alt="Foto cria produto 2" priority />
          </div>
          <h2 id="subtitle">
            Transforme seu produto em uma estrela: títulos e descrições que vendem!
          </h2>
          <p id="textop">
            Apresentamos o AnuncIA, a solução inovadora que transforma a forma como
            você apresenta seus produtos. Com nossa plataforma, basta inserir o título
            e a descrição do seu produto, e, utilizando a poderosa API do ChatGPT,
            geramos títulos e descrições irresistíveis que capturam a atenção do seu
            público-alvo. Aumente suas vendas e destaque-se da concorrência com AnuncIA
            – onde a criatividade se encontra com a eficácia!
          </p>
          <button id="saibamaispersona" onClick={scrollToPlans}>
            Experimentar
          </button>
        </div>

        <h2 id="titlecon" ref={planSectionRef}>Escolha o melhor plano para você</h2>
        <center>
          <div className="toggle-container">
            <div className={`toggle-switch ${planType === "mensal" ? "mensal-active" : "anual-active"}`}>
              <div
                className={`toggle-option ${planType === "anual" ? "selected" : ""}`}
                onClick={() => handlePlanTypeChange("anual")}
              >
                Anual
              </div>
              <div
                className={`toggle-option ${planType === "mensal" ? "selected" : ""}`}
                onClick={() => handlePlanTypeChange("mensal")}
              >
                Mensal
              </div>
            </div>
          </div>

          <div className="plan-container">
            {planType === "mensal" ? (
              <>
                <PlanCard 
                  title="Plano Mensal Olist" 
                  originalPrice="R$ 220" 
                  discountedPrice="R$ 190" 
                  duration="por 1 ano" 
                  discount="Economize até R$ 30 com a oferta"
                />
                <PlanCard 
                  title="Plano Mensal Bling" 
                  originalPrice="R$ 220" 
                  discountedPrice="R$ 190" 
                  duration="por 1 ano" 
                  discount="Economize até R$ 30 com a oferta"
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
                />
                <PlanCard 
                  title="Plano Anual Bling" 
                  originalPrice="R$ 2.400" 
                  discountedPrice="R$ 1.900" 
                  duration="por 1 ano" 
                  discount="Economize até R$ 500 com a oferta"
                />
              </>
            )}
          </div>
        </center>
      </main>
    </main>
  );
}

function PlanCard({ title, originalPrice, discountedPrice, duration, discount }) {
  return (
    <div className="plan-card">
      <h3 className="plan-title">{title}</h3>
      <div className="plan-price">
        <span className="price-strikethrough">{originalPrice}</span>
        <span className="price-final">{discountedPrice}</span>
      </div>
      <p className="plan-duration">{duration}</p>
      <p className="plan-discount">{discount}</p>
      <button className="subscribe-btn">Assinar Agora</button>
      <div className="features">
        <p>✔ Acesso ilimitado</p>
        <p>✔ Suporte 24 hrs</p>
        <p>✔ Funcionalidades premium</p>
      </div>
    </div>
  );
}

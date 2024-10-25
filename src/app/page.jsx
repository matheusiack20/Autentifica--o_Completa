"use client";

import { useState } from "react";
import "./globals.css";
import "./style.css";
import LayoutAdmin from "../components/LayoutAdmin";
import Image from "next/image";
import imageminteligenciaesq from "../app/public/Inteligenciaartificialfoto1.png";
import Anuncia from "../app/public/anuncIA logo[1].png";
import Link from "next/link";

import im1 from "./public/Pagina_inicial.png";
import im2 from "./public/Foto1.png";
import im3 from "./public/Foto2.png";
import "../app/sobre/pagepublic.css";
import "./ToggleSwitch.css"; // Arquivo de estilo adicional para o botão de alternância

export default function Home() {
  const [planType, setPlanType] = useState("mensal");

  const handlePlanTypeChange = (selectedPlanType) => {
    setPlanType(selectedPlanType);
  };

  return (
    <LayoutAdmin>
      <div className="containerhome">
        <Image
          src={imageminteligenciaesq}
          alt="Inteligência Artificial à esquerda"
          className="imagem-left"
        />
        <div className="boxinit center">
          <center>
            <Image src={Anuncia} alt="AnuncIA" />
          </center>
          <br />
          <h2>Economize tempo e crie anúncios de qualidade em um clique</h2>
          <button id="buttoninit">
            <Link href="/sobre">Experimente Agora</Link>
          </button>
        </div>
        <hr />
      </div>

      <main>
        <div className="containerpublic">
          <h1 id="titlecon">Sobre o Produto</h1>
          <div className="dpage">
            <Image src={im2} alt="Foto cria produto 1" />
            <Image id="fotopaginit" src={im1} alt="Foto da Pagina Inicial" />
            <Image src={im3} alt="Foto cria produto 2" />
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

          <button id="saibamaispersona">Saiba Mais</button>
        </div>

        <h2 id="titlecon">Escolha o melhor plano para você</h2>
        <br />
        <center>
          {/* Alternância de plano */}
          <div className="toggle-container">
            <div
              className={`toggle-switch ${planType === "mensal" ? "mensal-active" : "anual-active"}`}
            >
              <div
                className={`toggle-option ${planType === "anual" ? "selected" : ""}`}
                onClick={() => handlePlanTypeChange("anual")} // Corrigido aqui
              >
                Anual
              </div>
              <div
                className={`toggle-option ${planType === "mensal" ? "selected" : ""}`}
                onClick={() => handlePlanTypeChange("mensal")} // Corrigido aqui
              >
                Mensal
              </div>
            </div>
          </div>

          {/* Conteúdo condicional - Planos Mensal e Anual para Olist e Bling */}
          {planType === "mensal" ? (
            <div className="plan-container">
              <div className="plan-card">
                <h3 className="plan-title">Plano Mensal Olist</h3>
                <div className="plan-price">
                  <span className="price-strikethrough">R$ 220</span>
                  <span className="price-final">R$ 190</span>
                </div>
                <p className="plan-duration">por 1 ano</p>
                <p className="plan-discount">Economize até R$ 30 com a oferta</p>
                <button className="subscribe-btn">Assinar Agora</button>
                <div className="features">
                  <p>✔ Acesso ilimitado</p>
                  <p>✔ Suporte 24 hrs</p>
                  <p>✔ Funcionalidades premium</p>
                </div>
              </div>

              <div className="plan-card">
                <h3 className="plan-title">Plano Mensal Bling</h3>
                <div className="plan-price">
                  <span className="price-strikethrough">R$ 220</span>
                  <span className="price-final">R$ 190</span>
                </div>
                <p className="plan-duration">por 1 ano</p>
                <p className="plan-discount">Economize até R$ 30 com a oferta</p>
                <button className="subscribe-btn">Assinar Agora</button>
                <div className="features">
                  <p>✔ Acesso ilimitado</p>
                  <p>✔ Suporte 24 hrs</p>
                  <p>✔ Funcionalidades premium</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="plan-container">
              <div className="plan-card">
                <h3 className="plan-title">Plano Anual Olist</h3>
                <div className="plan-price">
                  <span className="price-strikethrough">R$ 2.400</span>
                  <span className="price-final">R$ 1.900</span>
                </div>
                <p className="plan-duration">por 1 ano</p>
                <p className="plan-discount">Economize até R$ 500 com a oferta</p>
                <button className="subscribe-btn">Assinar Agora</button>
                <div className="features">
                  <p>✔ Acesso ilimitado</p>
                  <p>✔ Suporte 24 hrs</p>
                  <p>✔ Funcionalidades premium</p>
                </div>
              </div>

              <div className="plan-card">
                <h3 className="plan-title">Plano Anual Bling</h3>
                <div className="plan-price">
                  <span className="price-strikethrough">R$ 2.400</span>
                  <span className="price-final">R$ 1.900</span>
                </div>
                <p className="plan-duration">por 1 ano</p>
                <p className="plan-discount">Economize até R$ 500 com a oferta</p>
                <button className="subscribe-btn">Assinar Agora</button>
                <div className="features">
                  <p>✔ Acesso ilimitado</p>
                  <p>✔ Suporte 24 hrs</p>
                  <p>✔ Funcionalidades premium</p>
                </div>
              </div>
            </div>
          )}
        </center>
      </main>
    </LayoutAdmin>
  );
}

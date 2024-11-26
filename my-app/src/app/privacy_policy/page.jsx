import React from 'react';
import Image from "next/image";
import imageteste from "/public/anuncIAlogo[1].png"

export default function PoliticaDePrivacidade() {
  return (
    <main
      style={{
        marginTop: '0', // Espaço para evitar sobreposição com o header
        padding: '20px',
        color: 'black',
        textAlign: 'center',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 80px)', // Altura reduzida para compensar o espaço do header
      }}
    >
      <br />
      <h1><b>Política de Privacidade</b></h1>
      <p>Sua privacidade é importante para nós. Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações.</p>
      <div
        style={{
          maxWidth: '1000px',
        }}
      >
        <br />

      <h2><b>1. Informações que Coletamos</b></h2>
      <p>Podemos coletar informações pessoais, como seu nome, e-mail e dados de uso quando você interage com nosso site.</p>
      
      <br/>

      <h2><b>2. Como Usamos Suas Informações</b></h2>
      <p>Usamos essas informações para fornecer e melhorar nossos serviços, nos comunicarmos com você e garantir a segurança da sua experiência.</p>
      
      <br/>

      <h2><b>3. Segurança</b></h2>
      <p>Implementamos diversas medidas de segurança para proteger seus dados. No entanto, nenhum método de transmissão pela internet é completamente seguro.</p>
      
      <br/>

      <h2><b>4. Fale Conosco</b></h2>
      <p>Se você tiver alguma dúvida sobre nossa Política de Privacidade, entre em contato conosco em [email@example.com].</p>
      <br/>

      </div>
      <Image
          src={imageteste}
          alt="Logo MAP"
      />
    </main>
  );
}
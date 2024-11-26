import React from 'react';
import Image from "next/image";

import imageteste from "/public/anuncIAlogo[1].png"

export default function About() {
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
      <h1>Sobre Nós</h1>
      <div
        style={{
          maxWidth: '1000px',
        }}
      >
        <br/>
        <br />
        <p>Bem-vindo à [Nome do Site]! Somos dedicados a fornecer o melhor serviço para [propósito do site].</p>
        <p>Nossa missão é [missão ou objetivo da empresa/projeto]. Acreditamos em [valores fundamentais ou princípios do site].</p>
        <p>Obrigado por visitar nosso site e fazer parte da nossa comunidade.</p>
      </div>
      <Image
          src={imageteste}
          alt="Logo MAP"
      />
    </main>
  );
}

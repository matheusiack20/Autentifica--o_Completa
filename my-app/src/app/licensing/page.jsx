import React from 'react';
import Image from "next/image";
import imageteste from "/public/anuncIAlogo[1].png"


export default function Licenciamento() {
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
      <h1><b>Licenciamento</b></h1>
      <p>Este site e seu conteúdo são protegidos por direitos autorais e leis de licenciamento aplicáveis.</p>
      <div
        style={{
          maxWidth: '1000px',
        }}
      >
        <br/>
        <br />

        <h2><b>1. Licença de Conteúdo</b></h2>
      <p>A menos que declarado o contrário, o conteúdo deste site pertence à MAP Marketplacer e é fornecido sob a licença [tipo de licença, ex: Creative Commons Atribuição 4.0].</p>
      
      <br />

      <h2><b>2. Restrições</b></h2>
      <p>É proibido o uso não autorizado do nosso conteúdo. Por favor, respeite os termos da licença.</p>
      
      <br />

      <h2><b>3. Contato para Solicitações de Licenciamento</b></h2>
      <p>Se desejar utilizar nosso conteúdo de maneiras não cobertas pela licença, entre em contato conosco em [email@example.com].</p>

      </div>
      <Image
          src={imageteste}
          alt="Logo MAP"
      />
    </main>
  );
}
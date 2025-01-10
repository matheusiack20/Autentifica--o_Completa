'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation'; // Hook para pegar a rota atual
import './ChatWhatsApp.css'; // Arquivo de estilos separado
import Image from 'next/image';
import whats from '../../../public/whatsapp.png';
import logo from '../../../public/Faleconosco.png';

const ChatWhatsApp = () => {
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);
  const [timestamp, setTimestamp] = useState('');
  const pathname = usePathname(); // Pega a rota atual

  // Verifica se está na página de login ou cadastro
  const isAuthPage = pathname === '/login' || pathname === '/register';

  const toggleChatBox = () => {
    setIsChatBoxVisible(!isChatBoxVisible);

    if (!isChatBoxVisible) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimestamp(`${hours}:${minutes}`);
    }
  };

  // Não renderiza o componente se estiver em uma página de login ou cadastro
  if (isAuthPage) {
    return null;
  }

  return (
    <>
      {/* Ícone do WhatsApp */}
      <div id="whatsapp-icon" onClick={toggleChatBox}>
        <Image src={whats} alt="Imagem_Whats" id="whatsapp-icon" />
      </div>

      {/* Caixa de chat */}
      {isChatBoxVisible && (
        <div className="chat-box">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image src={logo} alt="logo_map" />
              <span>MAP Marketplaces</span>
            </div>
            <span className="close-btn" onClick={toggleChatBox}>
              ×
            </span>
          </div>
          <div className="chat-body">
            <div className="chat-message">
              <strong>MAP Marketplaces</strong>
              <p style={{ color: 'black' }}>
                Olá, ficou com dúvida sobre o AnuncIA? Clique aqui embaixo e fale
                com o Suporte!
              </p>
            </div>
            <div className="timestamp">{timestamp}</div>
          </div>
          <div className="chat-footer">
            <a
              href="https://wa.me/5522992739203"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <center>
                <button>Falar com o Suporte</button>
              </center>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWhatsApp;

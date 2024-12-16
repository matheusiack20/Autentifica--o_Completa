import { useState, useEffect } from 'react';

export default function Confirmacao() {
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function buscarConfirmacao() {
      try {
        const resposta = await fetch('/api/confirmacao');
        const dados = await resposta.json();
        setMensagem(`Resposta recebida: ${JSON.stringify(dados)}`);
      } catch {
        setMensagem('Erro ao buscar dados.');
      }
    }
    buscarConfirmacao();
  }, []);

  return <div>{mensagem}</div>;
}

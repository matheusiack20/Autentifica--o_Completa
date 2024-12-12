// Importando as dependências
const express = require('express');
const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Rota para confirmação de assinaturas
app.post('/confirmacao', (req, res) => {
  try {
    const data = req.body; // Dados enviados pelo Mercado Pago

    console.log('Dados recebidos:', data);

    // Verifique e processe os dados recebidos
    if (data && data.type === 'preapproval') {
      console.log('Confirmação de assinatura recebida:', data);

      // Faça algo com as informações, como atualizar o status no banco de dados
      // Por exemplo: salvar o ID da assinatura ou o status do pagamento
    } else {
      console.log('Tipo de notificação desconhecido:', data.type);
    }

    // Retornar uma resposta ao Mercado Pago
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro ao processar a confirmação:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
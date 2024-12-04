import fetch from 'node-fetch'; // Certifique-se de ter instalado node-fetch

const ACCESS_TOKEN = 'TEST-577420924520030-120211-fb88f79d501908621dd4dc5b3f2035cb-2085012964'; // Substitua pelo seu token de acesso

async function testPreApproval() {
  const url = 'https://api.mercadopago.com/preapproval'; // Endpoint correto para pré-aprovação
  
  const body = {
    reason: 'Assinatura de serviço',
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      transaction_amount: 10.0, // valor do pagamento
      currency_id: 'BRL',
    },
    payer_email: 'email@exemplo.com',
    back_url: 'https://www.seusite.com/sucesso', // URL de redirecionamento após pagamento
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`, // Passando o token
      },
      body: JSON.stringify(body), // Envia os dados da pré-aprovação
    });

    // Verificando se a resposta foi bem-sucedida
    if (response.ok) {
      const data = await response.json();
      console.log('Pré-aprovação criada com sucesso:', data);
    } else {
      const errorData = await response.json();
      console.log('Erro na criação da pré-aprovação:', errorData);
    }
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
  }
}

// Executar a função de teste
testPreApproval();

// Backend: src/pages/api/user/mercadopago.js
import mercadopago from 'mercadopago';

// Configuração com o access token
mercadopago.configurations.setAccessToken(process.env.MERCADO_PAGO_ACCESS_TOKEN);

// Função para criar a assinatura com o token do cartão
async function createSubscriptionWithToken(token, email, name, planName, planPrice, frequency) {
  try {
    const subscription = await mercadopago.preapproval.create({
      payer_email: email,
      back_url: 'http://localhost:3000/success', // Substitua pelo URL do seu site
      reason: planName,
      auto_recurring: {
        frequency,
        frequency_type: 'months',
        transaction_amount: planPrice,
        currency_id: 'BRL',
        payment_method_id: 'credit_card',
        card_token_id: token,
      },
    });

    return subscription.response.init_point;
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    throw new Error('Erro ao criar assinatura');
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token, email, name, selectedPlan, planPrice, frequency } = req.body;

    try {
      const init_point = await createSubscriptionWithToken(token, email, name, selectedPlan, planPrice, frequency);
      res.status(200).json({ init_point });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
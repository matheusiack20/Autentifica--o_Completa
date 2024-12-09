import mercadopago from 'mercadopago';
import { getSession } from 'next-auth/react';

// Configuração do Mercado Pago com o access_token
mercadopago.configurations.setAccessToken(process.env.MERCADO_PAGO_ACCESS_TOKEN);

// Função para criar a preferência de pagamento
async function createSubscriptionPreference(email, name, planName, planPrice, frequency) {
  try {
    console.log('Criando preferência de pagamento para:', { email, name, planName, planPrice, frequency });

    const items = [
      {
        title: planName,
        quantity: 1,
        unit_price: planPrice,
      },
    ];

    const preference = await mercadopago.preferences.create({
      items,
      payer: {
        email,
      },
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure',
        pending: 'http://localhost:3000/pending',
      },
      auto_return: 'approved',
      notification_url: 'http://www.your-site.com/webhooks', // Alterar para o seu webhook real
      recurrence: {
        frequency, // Usando o valor de frequência passado para 1 ou 12 meses
        frequency_type: 'months',
        transaction_amount: planPrice,
        end_date: '2025-12-31T23:59:59',
      },
    });

    console.log('Preferência de pagamento criada com sucesso:', preference.body);

    return preference.body.init_point;
  } catch (error) {
    console.error('Erro ao criar a preferência de pagamento:', error.message);
    throw new Error('Erro ao criar a assinatura');
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { selectedPlan, planPrice, frequency } = req.body;

    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { email, name } = session.user;

    try {
      console.log('Dados do usuário:', { email, name });

      const init_point = await createSubscriptionPreference(email, name, selectedPlan, planPrice, frequency);

      console.log('Link de pagamento gerado:', init_point);

      res.status(200).json({ init_point });
    } catch (error) {
      console.error('Erro ao criar a assinatura:', error.message);
      res.status(500).json({ error: error.message || 'Erro ao criar a assinatura' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}

// src/pages/api/payment.js
import mercadopago from 'mercadopago';

mercadopago.configurations.setAccessToken(process.env.MERCADO_PAGO_ACCESS_TOKEN);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      token,
      payment_method_id,
      issuer_id,
      transaction_amount,
      installments,
      description,
      payer,
    } = req.body;

    try {
      // Cria o pagamento no Mercado Pago
      const paymentData = {
        transaction_amount,
        token,
        description,
        payment_method_id,
        payer,
        installments,
        issuer_id,
      };

      const payment = await mercadopago.payment.create(paymentData);

      if (payment.body.status === 'approved') {
        return res.status(200).json({ status: 'approved', data: payment.body });
      } else {
        return res.status(400).json({ status: 'rejected', data: payment.body });
      }
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      return res.status(500).json({ error: 'Erro ao processar o pagamento' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}

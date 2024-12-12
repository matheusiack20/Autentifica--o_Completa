import mercadopago from '../../../utils/mercadopago';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, planType, planName, cardToken } = req.body;

        const planDetails = {
            free: { monthly: 0, annual: 0 },
            bronze: { monthly: 49.00, annual: 490.00 },
            prata: { monthly: 90.00, annual: 900.00 },
            ouro: { monthly: 159.00, annual: 1590.00 },
        };

        const transactionAmount = planDetails[planName][planType];

        try {
            const preapproval = await mercadopago.preapproval.create({
                back_url: 'https://www.google.com',
                reason: `Assinatura ${planName.charAt(0).toUpperCase() + planName.slice(1)}`,
                auto_recurring: {
                    frequency: 1,
                    frequency_type: planType === 'annual' ? 'years' : 'months',
                    start_date: new Date().toISOString(),
                    end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
                    transaction_amount: transactionAmount,
                    currency_id: 'BRL',
                },
                payer_email: email,
                card_token_id: cardToken,
                status: 'authorized',
            });

            res.status(200).json({ init_point: preapproval.init_point });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar assinatura' });
        }
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
}

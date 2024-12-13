import mercadopago from '../../../utils/mercadopago';

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, planType, planName, cardToken } = req.body;

        if (!email || !planType || !planName || !cardToken) {
            return res.status(400).json({ error: 'Parâmetros inválidos' });
        }

        const planDetails = {
            free: { monthly: 0, annual: 0 },
            bronze: { monthly: 49.00, annual: 490.00 },
            prata: { monthly: 90.00, annual: 900.00 },
            ouro: { monthly: 159.00, annual: 1590.00 },
        };

        const transactionAmount = planDetails[planName]?.[planType];

        if (transactionAmount === undefined) {
            return res.status(400).json({ error: 'Plano ou tipo de plano inválido' });
        }

        try {
            const preapproval = await mercadopago.preapproval.create({
                back_url: 'http://localhost:3000/',
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
                card_token_id: MERCADO_PAGO_ACCESS_TOKEN,
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

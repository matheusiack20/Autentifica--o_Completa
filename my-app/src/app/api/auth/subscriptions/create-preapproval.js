import mercadopago from '../../../utils/mercadopago';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, plan_id } = req.body;

        try {
            const preapproval = await mercadopago.preapproval.create({
                payer_email: email,
                back_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
                reason: 'Assinatura Mensal',
                external_reference: 'USER_ID_123', // Substitua pelo ID do usuário ou outro identificador
                auto_recurring: {
                    frequency: 1,
                    frequency_type: 'months',
                    transaction_amount: 100.0,
                    currency_id: 'BRL',
                },
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

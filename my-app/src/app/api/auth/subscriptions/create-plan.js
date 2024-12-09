import mercadopago from '../../../utils/mercadopago';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const plan = await mercadopago.preapproval_plan.create({
                reason: 'Assinatura Mensal - Plano Básico',
                auto_recurring: {
                    frequency: 1,
                    frequency_type: 'months',
                    transaction_amount: 100.0,
                    currency_id: 'BRL',
                },
            });

            res.status(200).json({ plan_id: plan.id, message: 'Plano criado com sucesso!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar plano de assinatura' });
        }
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
}

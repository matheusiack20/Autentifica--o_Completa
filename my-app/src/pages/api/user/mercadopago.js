import mercadopago from 'mercadopago';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { title, unit_price, quantity } = req.body;

        try {
            // Inicializa o Mercado Pago com o access_token
            mercadopago.configurations.setAccessToken(process.env.MERCADO_PAGO_ACCESS_TOKEN);

            // Criar a preferência de pagamento
            const preference = await mercadopago.preferences.create({
                items: [
                    {
                        title,
                        quantity,
                        unit_price,
                    },
                ],
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_URL}/success`,
                    failure: `${process.env.NEXT_PUBLIC_URL}/failure`,
                    pending: `${process.env.NEXT_PUBLIC_URL}/pending`,
                },
                auto_return: 'approved',
            });

            // Retornar o link de pagamento
            res.status(200).json({
                init_point: preference.body.init_point, // Link gerado pela API do Mercado Pago
            });
        } catch (error) {
            // Depuração do erro
            console.error('Erro ao criar pagamento no Mercado Pago:', error.message);
            res.status(500).json({ error: error.message || 'Erro ao processar pagamento' });
        }
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
}

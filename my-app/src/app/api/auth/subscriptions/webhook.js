export default async function handler(req, res) {
    if (req.method === 'POST') {
        const notification = req.body;

        console.log('Webhook recebido:', notification);

        // Processar a notificação
        if (notification.type === 'preapproval') {
            console.log(`Atualização de assinatura: ${notification.data.id}`);
        }

        res.status(200).json({ message: 'Webhook recebido com sucesso' });
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
}

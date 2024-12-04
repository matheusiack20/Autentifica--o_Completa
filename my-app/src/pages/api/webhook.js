export default async function webhook(req, res) {
    if (req.method === 'POST') {
      const notification = req.body;
  
      // Processar a notificação recebida
      console.log('Notificação recebida:', notification);
  
      res.status(200).send('OK');
    } else {
      res.status(405).send('Method Not Allowed');
    }
  }
  
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    if (!process.env.RECIPIENT_EMAIL) {
      console.error("Erro: Variável RECIPIENT_EMAIL não definida.");
      return res.status(500).json({ message: "Erro interno: RECIPIENT_EMAIL não está definida." });
    }

    // Configuração do Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.RECIPIENT_EMAIL,
      subject: `Nova mensagem de ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\nMensagem: ${message}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
      console.error("Erro ao enviar o e-mail:", error);
      res.status(500).json({ message: 'Falha ao enviar o email.' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido.' });
  }
}

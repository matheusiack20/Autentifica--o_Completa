import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../../../../../models/User";

dotenv.config();

// Configuração do transportador de e-mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Função do manipulador da API
export default async function handler(req, res) {
  console.log("API forgot-password acessada:", req.method, req.body);

  if (req.method === "POST") {
    const { email } = req.body;

    // Verificação se o e-mail foi fornecido
    if (!email) {
      console.log("Erro: E-mail não fornecido.");
      return res.status(400).json({ success: false, message: "E-mail é obrigatório." });
    }

    try {
      console.log("Procurando usuário com e-mail:", email);
      const user = await User.findOne({ email });
      if (!user) {
        console.log("Erro: Usuário não encontrado.");
        return res.status(404).json({ success: false, message: "Usuário não encontrado." });
      }

      // Geração do token de redefinição
      const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
      user.resetToken = resetToken;
      user.resetTokenExpires = Date.now() + 3600000; // Expira em 1 hora
      await user.save();
      console.log("Token de redefinição gerado e salvo no usuário:", resetToken);

      // Configuração das opções do e-mail
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Recuperação de Senha",
        text: `Você solicitou a recuperação da sua senha. Use o seguinte token para redefinir sua senha: ${resetToken}`,
        // Consider adding an HTML version as well, if needed
      };

      // Envio do e-mail
      await transporter.sendMail(mailOptions);
      console.log("E-mail enviado com sucesso para:", email);

      // Resposta de sucesso
      return res.status(200).json({ success: true, message: "E-mail de recuperação enviado." });
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error.message || error);
      // Resposta de erro
      return res.status(500).json({ success: false, message: "Erro ao enviar o e-mail." });
    }
  } else {
    console.log(`Método ${req.method} não permitido.`);
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` });
  }
}

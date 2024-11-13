import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";
import htmlContent from "./indexEmail";
import User from "../../../models/User";
import { connectOnce } from "../../../utils/db"; // Certifique-se de que este caminho está correto

dotenv.config();

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "E-mail é obrigatório." });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "E-mail inválido." });
  }

  try {
    // Conecta ao banco de dados, se necessário
    await connectOnce();

    // Procura o usuário pelo e-mail
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado." });
    }

    // Geração do token de recuperação e expiração
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de validade
    await user.save();

    // Criação do link de redefinição de senha
    const resetUrl = `http://localhost:3000/api/auth/reset-password`;

    // Substitui {{RESET_URL}} e {{TOKEN}} no conteúdo do e-mail
    const emailHtml = htmlContent
      .replace("{{RESET_URL}}", resetUrl)  // Link completo
      .replace("{{TOKEN}}", token);        // Token isolado

    // Configuração do e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperação de Senha",
      html: emailHtml,
    };

    // Envio do e-mail
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "E-mail de recuperação enviado." });
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    return res.status(500).json({ success: false, message: "Erro ao enviar o e-mail." });
  }
}

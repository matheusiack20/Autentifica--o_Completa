// src\pages\api\user\forgot-pass.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";
import htmlContent from "./indexEmail";
import User from "../../../models/User";
dotenv.config();

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
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "E-mail é obrigatório." });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "Usuário não encontrado." });
      }

      const token = "seu_token_de_recuperacao"; // Gere o token conforme necessário
      const emailHtml = htmlContent.replace("{{TOKEN}}", token);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Recuperação de Senha",
        html: emailHtml,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: "E-mail de recuperação enviado." });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Erro ao enviar o e-mail." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Método ${req.method} não permitido.` });
  }
}

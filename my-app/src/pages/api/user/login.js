
import dbConnect from "../../../utils/db"; // Certifique-se de conectar ao banco
import { findUserWithPassword } from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email, password } = req.body;

  await dbConnect(); // Conecta ao banco

  try {
    // Encontra o usuário com a senha inclusa
    const user = await findUserWithPassword(email);

    if (!user) {
      return res.status(400).json({ message: "Email ou senha incorretos" });
    }

    // Compara a senha fornecida com a senha armazenada
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Email ou senha incorretos" });
    }

    // Retorna o sucesso caso o usuário seja autenticado (você pode adicionar lógica JWT aqui)
    res.status(200).json({ message: "Autenticação bem-sucedida", user: { id: user._id, email: user.email, name: user.name } });

  } catch (error) {
    console.error("Erro na autenticação:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
}

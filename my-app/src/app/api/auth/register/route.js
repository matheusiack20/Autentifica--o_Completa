// src/app/api/auth/register/route.ts

import argon2 from 'argon2';
import User from '../../../../models/User'; // Verifique o caminho
import { connectOnce } from '../../../../utils/db'; // Verifique o caminho

export const POST = async (req, res) => {
  try {
    const { name, email, password } = await req.json();

    await connectOnce();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'E-mail já está em uso.' }), { status: 400 });
    }

    // Criptografar a senha usando argon2
    const hashedPassword = await argon2.hash(password); // Gera o hash

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    return new Response(JSON.stringify({ message: 'Usuário registrado com sucesso!' }), { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);

    if (error.name === 'MongoNetworkError') {
      return new Response(JSON.stringify({ message: 'Erro de conexão com o banco de dados.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Erro ao registrar usuário.' }), { status: 500 });
  }
};

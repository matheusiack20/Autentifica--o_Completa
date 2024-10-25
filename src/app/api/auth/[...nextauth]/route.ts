import mongoose from "mongoose";
import User from "../../../../models/User";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import connect from "../../../../utils/db";

// Verifique se as variáveis de ambiente para Google e Facebook estão configuradas
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google authentication environment variables are missing");
}
if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
  throw new Error("Facebook authentication environment variables are missing");
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "Credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials?.email });
          if (!user) {
            throw new Error("Credenciais erradas!");
          }
          const validPassword = await bcrypt.compare(credentials?.password, user.password);
          if (!validPassword) {
            throw new Error("Credenciais erradas!");
          }
          return user;
        } catch (error) {
          console.error("Erro de autenticação:", error);
          throw new Error("Erro na autenticação. Tente novamente mais tarde.");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        await connect();
        try {
          let user = await User.findOne({ email: profile.email });
          if (!user) {
            const newUser = new User({
              name: profile.name,
              email: profile.email,
              role: 'user', // Defina um papel padrão, se necessário
              image: profile.picture || '', // Armazene a imagem do perfil, se disponível
            });
            await newUser.save();
            user = newUser; // Atualiza a referência do usuário
          }
          return user;
        } catch (error) {
          console.error("Erro ao criar ou buscar usuário:", error);
          throw new Error("Erro ao autenticar com Google.");
        }
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      async profile(profile) {
        await connect();
        try {
          let user = await User.findOne({ email: profile.email });
          if (!user) {
            const newUser = new User({
              name: profile.name,
              email: profile.email,
              role: 'user', // Defina um papel padrão, se necessário
              image: profile.picture.data.url || '', // Armazene a imagem do perfil, se disponível
            });
            await newUser.save();
            user = newUser; // Atualiza a referência do usuário
          }
          return user;
        } catch (error) {
          console.error("Erro ao criar ou buscar usuário:", error);
          throw new Error("Erro ao autenticar com Facebook.");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      return true; // Você pode implementar mais lógica aqui, se necessário
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role || "user"; // Adiciona o papel do usuário ao token
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = token.role as string; // Adiciona o papel do usuário à sessão
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Certifique-se de que esta rota existe
    error: "/error", // Ou ajuste para a rota correta
  },
  debug: process.env.NODE_ENV === 'development', // Ative o modo de depuração se estiver em desenvolvimento
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

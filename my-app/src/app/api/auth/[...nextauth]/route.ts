import NextAuth, { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { connectOnce } from "../../../../utils/db";
import User from "../../../../models/User";
import jwt from 'jsonwebtoken';

const genericAvatar = "/Generic_avatar.png";

interface User extends NextAuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      authToken?: string;
    };
  }
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Senha", type: "password", required: true },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Credenciais não fornecidas.");
        }

        try {
          console.log("Credenciais recebidas:", credentials);

          // Conexão com o banco de dados
          await connectOnce();
          console.log("Tentando encontrar usuário com email:", credentials.email, credentials.password);
          // Busca o usuário e verifica a senha
          const user = await User.findUserWithPassword(
            credentials.email,
            credentials.password
          ) as User;

          if (!user) {
            console.error("Usuário não encontrado ou senha incorreta.");
            throw new Error("Credenciais inválidas. Por favor, tente novamente.");
          }

          // const decoded = jwt.verify(token, secretKey);
          // console.log("Token válido:", decoded);
          // Retorna as informações do usuário autenticado
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || genericAvatar,
          };
        } catch (error) {
          console.error("Erro durante a autorização:", error.message);
          throw new Error("Erro durante a autorização. Por favor, tente novamente.");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Adiciona o ID ao token
        token.email = user.email; // Adiciona a role ao token
        token.role = (user as User).role || "user"
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string || "user"; // Adiciona a role do token à sessão
        session.user.authToken = jwt.sign(
          { id: token.id, role: token.role },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" } // Exemplo: token de 1 hora
        );
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Handlers para rotas de API do Next.js
const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;

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
  authToken?: string; // Add authToken property
  plan?: number | null; // Add plan property
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      authToken?: string; // Add authToken property
      plan?: number | null; // Add plan property
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

          // Gera o token JWT
          const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });

          // Retorna as informações do usuário autenticado
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || genericAvatar,
            authToken, // Adiciona o token JWT ao JSON de resposta
            plan: user.plan, // Adiciona o plano ao JSON de resposta
          };
        } catch (error) {
          console.error("Erro durante a autorização:", error.message);
          throw new Error("Erro durante a autorização. Por favor, tente novamente.");
        }
      }
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
        token.role = (user as User).role || "user";
        token.picture = user.image || genericAvatar;
        token.email = user.email;
        token.name = user.name;
        token.authToken = (user as User).authToken; // Inclui o token JWT no token JWT
        token.plan = (user as User).plan; // Inclui o plano no token JWT
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        role: token.role as string | undefined,
        image: token.picture,
        email: token.email,
        name: token.name,
        authToken: token.authToken as string, // Inclui o token JWT na sessão
        plan: token.plan as number | null, // Inclui o plano na sessão
      };
      return session;
    }
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
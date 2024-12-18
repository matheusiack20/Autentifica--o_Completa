import NextAuth, { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import argon2 from "argon2";
import { connectOnce } from "../../../../utils/db";
import User from "../../../../models/User";

const genericAvatar = "/Generic_avatar.png";

// Extendendo o User do NextAuth
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
    };
  }
  interface User {
    role?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    // Credenciais (login por email e senha)
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
          console.log("🔐 Credenciais recebidas:", credentials);

          // Conexão com o banco de dados
          await connectOnce();

          // Busca o usuário no banco de dados
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("Usuário não encontrado.");
          }

          // Verifica a senha com argon2
          const passwordMatch = await argon2.verify(user.password, credentials.password);
          if (!passwordMatch) {
            throw new Error("Senha incorreta.");
          }

          // Retorna os dados do usuário autenticado
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
            image: user.image || genericAvatar,
          };
        } catch (error) {
          console.error("❌ Erro durante a autorização:", error);
          throw new Error("Credenciais inválidas. Tente novamente.");
        }
      },
    }),

    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // Facebook Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],

  // Callbacks
  callbacks: {
    // Callback para manipular o token JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as User).role || "user";
        token.picture = user.image || genericAvatar;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    // Callback para incluir os dados do token na sessão
    async session({ session, token }) {
      if (token) {
        session.user = {
          name: token.name,
          email: token.email,
          image: token.picture,
          role: token.role as string,
        };
      }
      return session;
    },
  },

  // Páginas customizadas
  pages: {
    signIn: "/login",
    error: "/error",
    signOut: "/",
  },

  // Estratégia de sessão usando JWT
  session: {
    strategy: "jwt",
  },

  // Secret do NextAuth
  secret: process.env.NEXTAUTH_SECRET,
};

// Configuração dos handlers do NextAuth
const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;

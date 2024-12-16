import NextAuth, { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectOnce } from "../../../../utils/db";
import User from "../../../../models/User";

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

          // Busca o usuário e verifica a senha
          const user = await User.findUserWithPassword(
            credentials.email,
            credentials.password
          ) as User;

          if (!user) {
            console.error("Usuário não encontrado ou senha incorreta.");
            throw new Error("Credenciais inválidas. Por favor, tente novamente.");
          }

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
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as User).role || "user";
        token.picture = user.image || genericAvatar;
        token.email = user.email;
        token.name = user.name;
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
      };
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
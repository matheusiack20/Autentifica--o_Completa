import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { connectOnce } from "../../../../utils/db"; // Função para conectar ao banco de dados
import User from "../../../../models/User"; // Modelo User
import argon2 from "argon2";

const genericAvatar = "/Generic_avatar.png"; // Avatar padrão

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    // **Credenciais**
    CredentialsProvider({
      id: "credentials",
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Senha", type: "password", required: true },
      },
      async authorize(credentials) {
        try {
          console.log("Credenciais recebidas:", credentials);

          // Conexão com o banco de dados
          await connectOnce();

          // Busca o usuário e verifica a senha
          if (!credentials) {
            throw new Error("Credenciais não fornecidas.");
          }
          const user = await User.findUserWithPassword(
            credentials.email,
            credentials.password
          );
          if (!user) {
            console.error("Usuário não encontrado ou senha incorreta.");
            throw new Error("Credenciais inválidas. Por favor, tente novamente.");
          }

          // Retorna as informações do usuário autenticado
          return {
            id: (user._id as string).toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || genericAvatar,
          };
        } catch (error) {
          console.error("Erro na autorização:", error.message);
          throw new Error("Erro na autorização. Por favor, tente novamente.");
        }
      },
    }),

    // **Google**
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      async profile(profile) {
        try {
          console.log("Perfil do Google recebido:", profile);
          await connectOnce();

          // Procura o usuário no banco de dados
          let user = await User.findOne({ email: profile.email });
          if (!user) {
            console.log("Criando novo usuário do Google...");
            user = new User({
              name: profile.name,
              email: profile.email,
              role: "user",
              image: profile.picture || genericAvatar,
            });
            await user.save({ validateBeforeSave: false });
          }

          return {
            id: (user._id as string).toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || genericAvatar,
          };
        } catch (error) {
          console.error("Erro ao processar perfil do Google:", error.message);
          throw new Error("Erro ao processar perfil do Google.");
        }
      },
    }),

    // **Facebook**
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      async profile(profile) {
        try {
          console.log("Perfil do Facebook recebido:", profile);
          await connectOnce();

          // Procura o usuário no banco de dados
          let user = await User.findOne({ email: profile.email });
          if (!user) {
            console.log("Criando novo usuário do Facebook...");
            user = new User({
              name: profile.name,
              email: profile.email,
              role: "user",
              image: profile.picture?.data?.url || genericAvatar,
            });
            await user.save({ validateBeforeSave: false });
          }

          return {
            id: (user._id as string).toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || genericAvatar,
          };
        } catch (error) {
          console.error("Erro ao processar perfil do Facebook:", error.message);
          throw new Error("Erro ao processar perfil do Facebook.");
        }
      },
    }),
  ],

  callbacks: {
    /**
     * Callback JWT: Adiciona informações personalizadas ao token
     */
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "user";
        token.picture = user.image || genericAvatar;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    /**
     * Callback Session: Adiciona dados personalizados à sessão
     */
    async session({ session, token }) {
      session.user = {
        ...session.user,
        role: token.role as string | null | undefined,
        image: token.picture,
        email: token.email,
        name: token.name,
      };
      return session;
    },
  },

  /**
   * Páginas personalizadas
   */
  pages: {
    signIn: "/login",
    error: "/error",
    signOut: "/",
  },

  /**
   * Estratégia de sessão
   */
  session: {
    strategy: "jwt", // Usando JWT para persistir sessões
  },

  /**
   * Configuração secreta
   */
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Handlers para Next.js API routes
 */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

const someVariable: any = 'value'; // Replace 'any' with a specific type

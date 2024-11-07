import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { connectOnce } from "../../../../utils/db"; // Função de conexão ao banco
import User from "../../../../models/User"; // Modelo User
import argon2 from "argon2";

const genericAvatar = "/Generic_avatar.png";

const authOptions: NextAuthOptions = {
  providers: [
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

          // Conectar ao banco de dados
          await connectOnce();

          // Verificar se o usuário existe e comparar a senha
          const user = await User.findUserWithPassword(credentials.email, credentials.password);
          if (!user) {
            console.log("Usuário não encontrado ou senha incorreta.");
            throw new Error("Credenciais inválidas. Por favor, tente novamente.");
          }

          // Retornar as informações do usuário após a autenticação bem-sucedida
          return {
            id: user._id.toString(),
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

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      async profile(profile) {
        try {
          console.log("Perfil do Google recebido:", profile);
          await connectOnce();

          let user = await User.findOne({ email: profile.email });
          if (!user) {
            console.log("Criando novo usuário para o perfil do Google...");
            user = new User({
              name: profile.name,
              email: profile.email,
              role: "user",
              image: profile.picture || genericAvatar,
            });
            await user.save({ validateBeforeSave: false });
            console.log("Usuário do Google salvo:", user);
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || genericAvatar,
          };
        } catch (error) {
          console.error("Erro ao processar perfil do Google:", error.message);
          throw new Error("Erro ao processar perfil do Google. Por favor, tente novamente.");
        }
      },
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      async profile(profile) {
        try {
          console.log("Perfil do Facebook recebido:", profile);
          await connectOnce();

          let user = await User.findOne({ email: profile.email });
          if (!user) {
            console.log("Criando novo usuário para o perfil do Facebook...");
            user = new User({
              name: profile.name,
              email: profile.email,
              role: "user",
              image: profile.picture?.data?.url || genericAvatar,
            });
            await user.save({ validateBeforeSave: false });
            console.log("Usuário do Facebook salvo:", user);
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || genericAvatar,
          };
        } catch (error) {
          console.error("Erro ao processar perfil do Facebook:", error.message);
          throw new Error("Erro ao processar perfil do Facebook. Por favor, tente novamente.");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "user";
        token.picture = user.image || genericAvatar;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        role: token.role,
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

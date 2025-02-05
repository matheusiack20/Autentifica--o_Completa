import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Substitua com a lógica de validação do seu banco de dados
        const users = [
          { id: 1, name: "Admin", username: "admin", password: "admin123", role: "admin" },
          { id: 2, name: "User", username: "user", password: "user123", role: "user" },
        ];

        const user = users.find(
          (u) =>
            u.username === credentials.username && u.password === credentials.password
        );

        if (user) {
          return user; // Retorna o usuário autenticado
        }

        return null; // Retorna null para falha na autenticação
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Adicionar a role ao token da sessão
      session.user.role = token.user?.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});

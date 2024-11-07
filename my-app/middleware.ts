import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server';

export default withAuth({
  // Middleware para adicionar a role ao token JWT
  async jwt({ token, user }) {
    // Apenas adicione a role ao token se ainda não estiver presente
    if (user && user.role) {
      token.role = user.role;
    }
    return token;
  },
  // Middleware para verificar o token e autorizar acesso com base na role
  async handle({ req, token }) {
    const { pathname } = req.nextUrl;

    // Checar se a rota começa com '/admin' e o token de role não é 'admin'
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      // Impedir acesso a rotas de admin para usuários não-admin
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Permitir acesso se as condições forem atendidas
    return NextResponse.next();
  },
  // Configuração para proteger rotas específicas que exigem autenticação
  pages: {
    signIn: "/login", // Página de login
  },
});

// Configuração de matcher para as rotas
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};

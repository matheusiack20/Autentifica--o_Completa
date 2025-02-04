import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import cors from './middleware/cors'; // Caminho para o arquivo de CORS
import { NextRequest } from  "next/server";
import Cookies from 'js-cookie';

export function middleware(req) {
  // Aplica o middleware de CORS a todas as rotas
  return cors(req, NextResponse.next());
}
export default withAuth(
    function middleware(req: NextRequest) {
      const { pathname } = req.nextUrl;
      // Permitir acesso à página de login e registro sem autenticação
      if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        return NextResponse.next();
      }
      // Redirecionar para a página de login se o usuário não estiver autenticado
      if (!req.cookies['next-auth.session-token']) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    },
{
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized: ({ token }) => !!token,
    },
}
);
/**
 * Middleware para adicionar a role ao token JWT
 */
export async function jwt({ token, user }) {
  if (user) {
    token.role = user.role || "user"; // Define 'user' como padrão para role
  }
  return token;
}

/**
 * Middleware para autorizar acesso com base na role
 */
export async function handle({ req, token }) {
  const { pathname } = req.nextUrl;

  // Bloqueio para usuários não autenticados
  if (!token) {
    console.warn("Acesso negado: Usuário não autenticado");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Bloqueio para rotas de admin
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    console.warn("Acesso negado: Role insuficiente para acessar rotas de admin");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Permitir acesso
  return NextResponse.next();
}

/**
 * Rotas protegidas pelo middleware
 */
export const config = {
  matcher: [
      ["/((?!api|_next|static|favicon.ico).*)"],
      ['/api/*'], // Aplica CORS somente para rotas de API
    "/dashboard/:path*", // Protege todas as rotas dentro de /dashboard
    "/profile/:path*",   // Protege todas as rotas dentro de /profile
    "/settings/:path*",  // Protege todas as rotas dentro de /settings
    "/admin/:path*",     // Protege todas as rotas dentro de /admin
  ],
};
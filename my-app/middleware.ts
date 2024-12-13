import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  /**
   * Página de login
   */
  pages: {
    signIn: "/login",
  },
});

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
    "/dashboard/:path*", // Protege todas as rotas dentro de /dashboard
    "/profile/:path*",   // Protege todas as rotas dentro de /profile
    "/settings/:path*",  // Protege todas as rotas dentro de /settings
    "/admin/:path*",     // Protege todas as rotas dentro de /admin
  ],
};
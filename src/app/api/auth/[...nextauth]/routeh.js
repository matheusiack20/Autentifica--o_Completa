// /pages/api/auth/[...nextauth].js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const nextauthParams = params.nextauth; // Se precisar, aguarde aqui se a lógica requerer.
  const cookies = request.cookies; // Para acessar cookies
  const headers = request.headers; // Para acessar headers

  // Lógica do seu código
  const myCookie = cookies.get('myCookie');
  const myHeader = headers.get('my-header');

  return NextResponse.json({
    nextauthParams,
    myCookie,
    myHeader,
  });
}

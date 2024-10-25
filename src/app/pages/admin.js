import React from "react";
import { getSession } from "next-auth/react";
import LayoutAdmin from "../components/LayoutAdmin";

export default function AdminPage({ session }) {
  return (
    <LayoutAdmin>
      {/* Seu conteúdo da página vai aqui */}
      <h1>Bem-vindo ao painel de administração</h1>
    </LayoutAdmin>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // Redireciona para a página de login se não houver sessão
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session }, // Passa a sessão como props para a página
  };
}

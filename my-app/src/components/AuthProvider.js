"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { getSession } from "next-auth/react";

export default function AuthProvider({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}

// Defina ou remova a função 'getSession'

"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import "./style.css";
import Image from "next/image";  // Mantém importação de Image
import map from "../../app/public/LogoMAP.png";  // Logo
import { SignOutButton } from './SignOutButton'; // Corrija o caminho do arquivo se necessário


export default function Header() {
  const { status, data: session } = useSession();

  if (status !== "authenticated") {
    return null;
  }

  return (
    <header className="dheader">
      <nav className="dnav">
        <Link href="/" passHref>
          <Image id="logoMap" src={map} alt="LogoMap" />
        </Link>

        <ul id="dul">
          <li className="dli"><Link href="/">Home</Link></li>
          <li className="dli"><Link href="/sobre">Sobre</Link></li>
          <li className="dli"><Link href="/contato">Contato</Link></li>
          <span className="bg-zinc-300 rounded-sm px-2">{`Olá ${session?.user?.name.split(" ")[0]}`}</span>
          {session && <li className="dli"><SignOutButton /></li>}
        </ul>

      </nav>
    </header>


    // <div className="flex gap-4 justify-center p-2 flex-wrap">
    //   <Link href="/">Home</Link>
    //   <Link href="/sobre">Sobre</Link>
    //   <Link href="/contato">Contato</Link>
    //   <Image src={map} alt="Logo MAP" width={40} height={40} /> {/* Adiciona a logo */}
    //   <span className="bg-zinc-300 rounded-sm px-2">{`Olá ${session?.user?.name.split(" ")[0]}`}</span>
    //   <Button
    //     text="Sair"
    //     className="bg-red-600 text-white rounded px-2 cursor-pointer"
    //     onClick={() => signOut()}  // Corrige o signOut
    //   />
    // </div>
  );
}
export { Header };

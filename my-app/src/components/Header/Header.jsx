"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import imglogo from "/public/LogoMAP.png";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Fecha o dropdown do avatar
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Renderiza estado de carregamento da sessão
  if (status === "loading") {
    return <div className="text-center py-2">Carregando...</div>;
  }

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/login" });
      setDropdownOpen(false);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <header className="bg-black text-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3 relative">
        {/* Logo */}
        <Link href="/" passHref>
          <Image
            src={imglogo}
            alt="Logo MAP"
            width={150}
            height={100}
            className="cursor-pointer"
          />
        </Link>

        {/* Botão Hambúrguer (Mobile) */}
        <button
          className="text-2xl md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Menu */}
        <ul
          ref={menuRef}
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute top-full left-0 w-full bg-black md:static md:flex md:items-center md:space-x-8 md:w-auto md:bg-transparent z-50`}
        >
          <li className="border-b md:border-none">
            <Link
              href="/"
              className="block py-2 px-4 text-center md:py-0 hover:text-[#dcfe00] transition"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="border-b md:border-none">
            <Link
              href="/sobre"
              className="block py-2 px-4 text-center md:py-0 hover:text-[#dcfe00] transition"
              onClick={() => setMenuOpen(false)}
            >
              Nossos Planos
            </Link>
          </li>
          <li className="border-b md:border-none">
            <Link
              href="/contato"
              className="block py-2 px-4 text-center md:py-0 hover:text-[#dcfe00] transition"
              onClick={() => setMenuOpen(false)}
            >
              Contato
            </Link>
          </li>

          {/* Usuário autenticado */}
          {session ? (
            <li className="relative md:border-none" ref={dropdownRef}>
              <div
                className="flex items-center justify-center py-2 px-4 cursor-pointer md:py-0"
                onClick={toggleDropdown}
              >
                <Image
                  src={session.user.image || "/Generic_avatar.png"}
                  alt="Avatar do Usuário"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-white shadow-lg rounded-lg py-2 z-50">
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-center px-4 py-2 hover:bg-gray-600 transition"
                  >
                    Sair
                  </button>
                </div>
              )}
            </li>
          ) : (
            // Botão de Login (quando não autenticado)
            pathname !== "/login" &&
            pathname !== "/register" && (
              <li className="py-2 md:py-0 flex justify-center">
                <Link href="/login">
                  <button className="bg-[#dcfe00] text-black hover:bg-white text-center px-4 py-1 rounded-md transition">
                    Login
                  </button>
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>
    </header>
  );
}

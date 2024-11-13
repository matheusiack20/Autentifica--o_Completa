"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import "./style.css";
import Image from "next/image";
import imglogo from "/public/LogoMAP.png"; // Path to logo image

export default function Header({ scrollToPlans }) {
  const { status, data: session } = useSession();
  const pathname = usePathname(); // Get the current path
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Render Loading state while session is loading
  if (status === "loading") {
    return <div>Loading...</div>; 
  }

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/login" });
      setMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="dheader">
      <nav className="dnav">
        <Link href="/" passHref>
          <Image id="logoMap" w-px src={imglogo} alt="Logo Map" />
        </Link>

        <ul id="dul">
          <li className="dli"><Link href="/">Home</Link></li>
          <li className="dli"><Link href="/sobre">Nossos Planos</Link></li>
          <li className="dli"><Link href="/contato">Contato</Link></li>

          {session ? (
            // Menu for logged-in users
            <li className="dli relative" ref={menuRef}>
              <div onClick={toggleMenu} className="cursor-pointer flex items-center" aria-expanded={menuOpen}>
                <Image
                  src={session.user.image || "/Generic_avatar.png"}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                  loading="lazy"
                />
              </div>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#DAFD00] shadow-lg rounded-lg py-2 text-center transition-transform transform-gpu ease-out duration-200 scale-100 origin-top">
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 rounded-md transition ease-in-out duration-150"
                  >
                    Sair
                  </button>
                </div>
              )}
            </li>
          ) : (
            // Login button for users who are not logged in, hidden on login and register pages
            (pathname !== "/login" && pathname !== "/register") && (
              <li className="dli">
                <Link href="/login">
                  <button className="bg-[#DAFD00] text-gray-800 hover:bg-gray-200 rounded-md px-5 py-2 transition ease-in-out duration-150">
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

'use client'
import { useEffect } from 'react';
import { signOut } from "next-auth/react";
import Button from "../Button";

export const SignOutButton = () => {
    const handleSignOut = () => {
        signOut({ callbackUrl: '/login' }); // Redireciona para a página de login ao sair
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            signOut({ callbackUrl: '/login' });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <Button text="Sair" className="bg-red-600 text-white rounded px-2 cursor-pointer" onClick={handleSignOut} />
    );
};

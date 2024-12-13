'use client';

import { signOut } from "next-auth/react";
import Button from "../Button";

const SignOutButton = () => {
    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: '/login' });
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    };

    return (
        <Button text="Sair" onClick={handleSignOut} className="your-class-name" />
    );
};

export default SignOutButton;

"use client";

import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import imglogo from "../../public/LogoMAP.png";
import logoFace from "../../public/Facebookapp.png";
import logoGoogle from "../../public/googlelogo.png";

// Componente de campo de entrada reutilizável
const InputField = ({ label, name, type, placeholder }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-[#d4ef00]">{label}:</label>
    <Field
      id={name}
      name={name}
      type={type}
      className="bg-[#3a3a3a] text-white p-2 rounded-md border border-[#d4ef00]"
      placeholder={placeholder}
      required
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  if (status !== "unauthenticated") {
    return null;
  }

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("O campo nome é obrigatório"),
    email: Yup.string()
      .email("Digite um e-mail válido")
      .required("O campo e-mail é obrigatório"),
    password: Yup.string().required("O campo senha é obrigatório"),
  });

  async function handleSubmit(values, { resetForm }) {
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();

      if (result.status === 201) {
        router.push("/");
      } else {
        setError(result.message || "Erro ao criar conta, tente mais tarde!");
        resetForm();
      }
    } catch {
      setError("Erro ao criar conta, tente mais tarde!");
    }
  }

  async function handleSocialLogin(provider) {
    const result = await signIn(provider, { redirect: false });

    if (result.error) {
      setError("Erro ao autenticar. Por favor, tente novamente.");
    } else {
      const profile = result?.profile;
      if (profile) {
        const response = await fetch("/api/auth/social-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
          }),
        });

        if (response.ok) {
          router.push("/");
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Erro ao registrar usuário social.");
        }
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[black]">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form
            noValidate
            className="flex flex-col gap-4 p-8 border-2 border-[#d4ef00] bg-[#2C2C2C] min-w-[450px] shadow-md rounded-3xl"
          >
            <Image
              className="min-w-[150px] w-px"
              src={imglogo}
              alt="Logo MAP"
            />

            <h2 className="text-[#d4ef00] text-center">Bem Vindo!</h2>
            <h3 className="text-[#d4ef00] text-center">Faça seu cadastro!</h3>

            {/* Botões de login social */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                aria-label="Login com Facebook"
                className="flex bg-[black] p-2 text-white w-1/2 rounded-full items-center hover:bg-[#d4ef00] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#d4ef00] focus:bg-[#d4ef00] focus:text-black"
              >
                <Image className="min-w-[20px]" src={logoFace} alt="Facebook" />
                Facebook
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                aria-label="Login com Google"
                className="flex bg-[black] pl-10 text-white w-1/2 rounded-full items-center hover:bg-[#d4ef00] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#d4ef00] focus:bg-[#d4ef00] focus:text-black"
              >
                <Image className="min-w-[20px] mr-2" src={logoGoogle} alt="Google" />
                Google
              </button>
            </div>

            {/* Campos do formulário */}
            <InputField label="Nome Completo" name="name" type="text" placeholder="Digite seu nome completo" />
            <InputField label="E-mail" name="email" type="email" placeholder="Digite seu e-mail" />
            <InputField label="Senha" name="password" type="password" placeholder="Digite sua senha" />

            {/* Botão de criar conta */}
            <center>
              <button
                type="submit"
                className={`p-2 bg-gradient-to-r from-[#1d1d1f] via-[#DAFD00] to-[#1d1d1f] text-[#2a2a2a] rounded-md text-center w-[200px] ${isSubmitting
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer animate-gradientButton bg-[length:400%_400%]"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Carregando..." : "Criar Conta"}
              </button>
            </center>

            {/* Link para login */}
            <span className="text-sm text-center mt-2 text-[#B3B3B3]">
              Já tem conta?{" "}
              <span className="text-[#DAFD00] no-underline">
                <Link href="/login">Clique aqui.</Link>
              </span>
            </span>

            {/* Mensagem de erro */}
            {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
          </Form>
        )}
      </Formik>
    </main>
  );
}

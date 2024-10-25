"use client";

import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import imglogo from "../../public/LogoMAP.png";
import logoFace from "../../public/Facebookapp.png";
import logoGoogle from "../../public/googlelogo.png";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  if (status === "authenticated") {
    return null;
  }

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Digite um e-mail válido")
      .required("O campo e-mail é obrigatório"),
    password: Yup.string().required("O campo senha é obrigatório"),
  });

  async function handleSubmit(values, { resetForm }) {
    setFormSubmitting(true);
    setError("");

    try {
      const result = await signIn("Credentials", { ...values, redirect: false });

      if (!result.error) {
        router.push("/");
      } else {
        setError(result.error.replace("Error: ", ""));
        resetForm();
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    } catch {
      setError("Erro ao fazer login, tente mais tarde!");
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleSocialLogin(provider) {
    const result = await signIn(provider, { redirect: false });

    if (result.error) {
      setError(result.error.replace("Error: ", ""));
    } else {
      router.push("/");
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
            <Image className="min-w-[150px] w-px" src={imglogo} alt="Logo" />

            <h2 className="text-[#d4ef00] text-center">Faça o seu Login para continuar:</h2>

            <div className="flex justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                className="flex bg-[black] p-2 text-white w-1/2 rounded-full items-center hover:bg-[#d4ef00] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#d4ef00]"
              >
                <Image className="min-w-[20px]" src={logoFace} alt="Facebook" />
                Facebook
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex bg-[black] p-2 text-white w-1/2 rounded-full items-center hover:bg-[#d4ef00] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#d4ef00]"
              >
                <Image className="min-w-[20px] mr-2" src={logoGoogle} alt="Google" />
                Google
              </button>
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-[#d4ef00]">E-mail:</label>
              <Field
                id="email"
                name="email"
                type="email"
                className="bg-[#3a3a3a] text-white p-2 rounded-md border border-[#d4ef00]"
                required
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-[#d4ef00]">Senha:</label>
              <Field
                id="password"
                name="password"
                type="password"
                className="bg-[#3a3a3a] text-white p-2 rounded-md border border-[#d4ef00]"
                required
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <span className="text-[#B3B3B3] text-sm text-right mt-2">
              <Link href="/forgot-password">Esqueceu a senha?</Link>
            </span>

            <center>
              <button
                type="submit"
                className={`p-2 bg-gradient-to-r from-[#1d1d1f] via-[#DAFD00] to-[#1d1d1f] text-[#2a2a2a] rounded-md text-center w-[200px] ${isSubmitting
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Carregando..." : "Entrar"}
              </button>
            </center>

            <span className="text-sm text-center mt-2 text-[#B3B3B3]">
              Novo por aqui?{" "}
              <span className="text-[#DAFD00] no-underline">
                <Link href="/register">Assine agora.</Link>
              </span>
            </span>

            {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
          </Form>
        )}
      </Formik>
    </main>
  );
}

"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Link from "next/link";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Register() {
  const [error, setError] = useState("");
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

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
    setFormSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });
      const result = await response.json();

      if (result.status === 201) {
        alert(result.message);
        router.push("/login");
      } else {
        renderError(result.message);
        resetForm();
      }
    } catch (error) {
      renderError("Erro ao criar conta, tente mais tarde!");
    } finally {
      setFormSubmitting(false);
    }
  }

  function renderError(msg) {
    setError(msg);
    setTimeout(() => {
      setError("");
    }, 3000);
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form
            noValidate
            className="flex flex-col gap-2 p-4 border rounded border-zinc-300 min-w-[300px] bg-white"
          >
            {/* Nome Field */}
            <div className="flex flex-col">
              <label htmlFor="name">Nome</label>
              <Field
                id="name"
                name="name"
                type="text"
                className="input-class"
                required
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Email Field */}
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <Field
                id="email"
                name="email"
                type="email"
                className="input-class"
                required
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Senha Field */}
            <div className="flex flex-col">
              <label htmlFor="password">Senha</label>
              <Field
                id="password"
                name="password"
                type="password"
                className="input-class"
                required
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Botão de Inscrever-se */}
            <Button
              type="submit"
              text={isSubmitting ? "Carregando..." : "Inscrever-se"}
              disabled={isSubmitting || isFormSubmitting}
              className="bg-green-500 text-white rounded p-2 cursor-pointer"
            />

            {/* Exibir erro geral */}
            {error && <span className="text-red-500 text-sm text-center">{error}</span>}

            <span className="text-xs text-zinc-500">
              Já possui uma conta?
              <strong className="text-zinc-700">
                <Link href="/login"> Entre</Link>
              </strong>
            </span>
          </Form>
        )}
      </Formik>
    </main>
  );
}

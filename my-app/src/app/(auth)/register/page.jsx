"use client";

import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import imglogo from "/public/LogoMAP.png";

const InputField = ({ label, name, type, placeholder, autoComplete }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-[#d4ef00]">{label}:</label>
    <Field
      id={name}
      name={name}
      type={type}
      className="bg-[#3a3a3a] text-white p-2 rounded-md border border-[#d4ef00]"
      placeholder={placeholder}
      autoComplete={autoComplete}
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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") return <div>Carregando...</div>;
  if (status !== "unauthenticated") return null;

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("O campo nome é obrigatório"),
    email: Yup.string()
      .email("Digite um e-mail válido")
      .required("O campo e-mail é obrigatório"),
    password: Yup.string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .required("O campo senha é obrigatório"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "As senhas devem coincidir")
      .required("Confirme sua senha"),
    acceptTerms: Yup.bool().oneOf([true], "Você precisa aceitar os Termos de Uso"),
  });

  async function handleSubmit(values, { setSubmitting }) {
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.status === 201) {
        router.push("/");
      } else {
        setError(result.message || "Erro ao criar conta, tente mais tarde!");
      }
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      setError("Erro ao criar conta, tente mais tarde!");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black pt-40 pb-20">
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

            <InputField label="Nome Completo" name="name" type="text" placeholder="Digite seu nome completo" autoComplete="name" />
            <InputField label="E-mail" name="email" type="email" placeholder="Digite seu e-mail" autoComplete="email" />
            <InputField label="Senha" name="password" type="password" placeholder="Digite sua senha" autoComplete="new-password" />
            <InputField label="Confirmar Senha" name="confirmPassword" type="password" placeholder="Confirme sua senha" autoComplete="new-password" />

            <div className="flex items-center gap-2">
              <Field
                type="checkbox"
                name="acceptTerms"
                id="acceptTerms"
                className="form-checkbox text-[#d4ef00]"
              />
              <label htmlFor="acceptTerms" className="text-[#d4ef00] text-sm">
                Eu aceito os{" "}
                <button type="button" onClick={() => setShowTermsModal(true)} className="text-[#DAFD00] underline">
                  Termos de Uso
                </button>
              </label>
            </div>
            <ErrorMessage name="acceptTerms" component="div" className="text-red-500 text-sm" />

            <center>
              <button
                type="submit"
                className={`p-2 bg-gradient-to-r from-[#1d1d1f] via-[#DAFD00] to-[#1d1d1f] rounded-md text-center w-[200px] ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Carregando..." : "Criar Conta"}
              </button>
            </center>

            <span className="text-sm text-center mt-2 text-[#B3B3B3]">
              Já tem conta?{" "}
              <Link href="/login" className="text-[#DAFD00]">
                Clique aqui.
              </Link>
            </span>

            {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}

            {showTermsModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-md max-w-md">
                  <h2 className="text-center font-bold text-lg mb-2">Termos de Uso</h2>
                  <div className="overflow-y-scroll max-h-64 p-2 border">
                    <p className="text-sm mb-4">
                      Bem-vindo à MAP. Ao utilizar nossos serviços, você concorda com os seguintes Termos de Serviço. Leia atentamente cada item, pois ele descreve os direitos e responsabilidades dos usuários.
                    </p>
                    <p className="text-sm">
                      <b>1. Aceitação dos Termos</b>
                      <br />
                      Ao criar uma conta e acessar ou utilizar nossos serviços, você concorda com todos os termos descritos aqui. Caso você não concorde com qualquer parte destes Termos, não deverá usar o serviço.
                      <br /><br />

                      <b>2. Cadastro de Usuário</b>
                      <br />
                      Para utilizar determinados recursos, você deve criar uma conta fornecendo informações precisas e completas. Você é responsável pela segurança da sua conta e pela confidencialidade de suas informações de login.
                      <br /><br />

                      <b>3. Privacidade e Uso de Dados</b>
                      <br />
                      Nossa política de privacidade descreve como coletamos, usamos e protegemos suas informações pessoais. Ao utilizar nossos serviços, você concorda com essa coleta e uso de dados, conforme descrito na política de privacidade.
                      <br /><br />

                      <b>4. Responsabilidades do Usuário</b>
                      <br />
                      Você concorda em utilizar o serviço de forma responsável e em conformidade com todas as leis aplicáveis. Qualquer atividade em sua conta é de sua responsabilidade.
                      <br /><br />

                      <b>5. Modificações do Serviço</b>
                      <br />
                      Podemos alterar ou descontinuar nossos serviços a qualquer momento, com ou sem aviso prévio. Quaisquer modificações nos Termos de Serviço serão notificadas através do nosso site e entrarão em vigor imediatamente.
                      <br /><br />

                      <b>6. Limitação de Responsabilidade</b>
                      <br />
                      Não nos responsabilizamos por quaisquer danos diretos, indiretos, incidentais ou punitivos resultantes do uso ou da incapacidade de uso do serviço.
                      <br /><br />
                     <b>7. Alterações e Cancelamento</b>
                     <br />
                      Reservamo-nos o direito de modificar ou encerrar a conta de um usuário que viole os termos estabelecidos. Você pode cancelar sua conta a qualquer momento através das configurações da sua conta.
                    </p>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button onClick={() => setShowTermsModal(false)} className="bg-red-500 text-white px-4 py-2 rounded-md">
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import imglogo from '/public/LogoMAP.png';
import eyeOpen from '/public/icons/olhoaberto.png'; // Caminho do ícone de mostrar senha
import eyeClosed from '/public/icons/olhofechado.png'; // Caminho do ícone de ocultar senha


const InputField = ({
  label,
  name,
  type,
  placeholder,
  autoComplete,
  showPasswordToggle,
  onToggle,
  isPasswordVisible,
}) => (
  <div className="flex flex-col relative">
    <label htmlFor={name} className="text-[#d4ef00]">
      {label}:
    </label>
    <Field
      id={name}
      name={name}
      type={type}
      className="bg-[#3a3a3a] text-white p-2 rounded-md border border-[#d4ef00]"
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
    />
    {showPasswordToggle && (
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-10 bg-yellow-400 rounded-full focus:ring-yellow-500" 
        style={{ padding: "1px 10px" }}>
        <Image
          src={isPasswordVisible ? eyeOpen : eyeClosed}
          alt={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
          width={20}
          height={20}
        />
      </button>
    )}
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') return <div>Carregando...</div>;
  if (status !== 'unauthenticated') return null;

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('O campo nome é obrigatório'),
    email: Yup.string()
      .email('Digite um e-mail válido')
      .required('O campo e-mail é obrigatório'),
    password: Yup.string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .required('O campo senha é obrigatório'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'As senhas devem coincidir')
      .required('Confirme sua senha'),
    acceptTerms: Yup.bool().oneOf(
      [true],
      'Você precisa aceitar os Termos de Uso',
    ),
  });

  async function handleSubmit(values, { setSubmitting }) {
    setError('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.status === 201) {
        router.push('/login');
      } else {
        setError(result.message || 'Erro ao criar conta, tente mais tarde!');
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      setError('Erro ao criar conta, tente mais tarde!');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[90vh] flex items-center justify-center bg-black mb-[5px] px-4 sm:px-6 lg:px-8">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form
            noValidate
            className="flex flex-col gap-4 p-6 border-2 border-[#d4ef00] bg-[#2C2C2C] max-w-[450px] w-full shadow-md rounded-3xl"
          >
            <Link href="/" passHref>
              <Image
                className="min-w-[150px] w-px mx-auto"
                src={imglogo}
                alt="Logo MAP"
              />
              </Link>

            <h2 className="text-[#d4ef00] text-center text-xl sm:text-2xl">Bem Vindo!</h2>
            <h3 className="text-[#d4ef00] text-center text-sm sm:text-base">Faça seu cadastro!</h3>

            <InputField
              label="Nome Completo"
              name="name"
              type="text"
              placeholder="Digite seu nome completo"
              autoComplete="name"
            />
            <InputField
              label="E-mail"
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              autoComplete="email"
            />
            <InputField
              label="Senha"
              name="password"
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Digite sua senha"
              autoComplete="new-password"
              showPasswordToggle
              onToggle={() => setPasswordVisible(!passwordVisible)}
              isPasswordVisible={passwordVisible}
            />
            <InputField
              label="Confirmar Senha"
              name="confirmPassword"
              type={confirmPasswordVisible ? 'text' : 'password'}
              placeholder="Confirme sua senha"
              autoComplete="new-password"
              showPasswordToggle
              onToggle={() =>
                setConfirmPasswordVisible(!confirmPasswordVisible)
              }
              isPasswordVisible={confirmPasswordVisible}
            />

            <div className="flex items-center gap-2">
              <Field
                type="checkbox"
                name="acceptTerms"
                id="acceptTerms"
                className="form-checkbox text-[#d4ef00]"
              />
              <label htmlFor="acceptTerms" className="text-[#d4ef00] text-sm">
                Eu aceito os{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="termos-de-uso"
                >
                  Termos de Uso
                </button>
              </label>
            </div>
            <ErrorMessage
              name="acceptTerms"
              component="div"
              className="text-red-500 text-sm"
            />

            <center>
              <button
                type="submit"
                className={`p-2 bg-gradient-to-r from-[#1d1d1f] via-[#DAFD00] to-[#1d1d1f] rounded-md text-center w-[200px] ${
                  isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Carregando...' : 'Criar Conta'}
              </button>
            </center>

            <span className="text-sm text-center mt-2 text-[#B3B3B3]">
              Já tem conta?{' '}
              <Link href="/login" className="text-[#DAFD00]">
                Clique aqui.
              </Link>
            </span>

            {error && (
              <div className="text-red-500 text-sm text-center mt-2">
                {error}
              </div>
            )}

            {showTermsModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-md max-w-md">
                  <h2 className="text-center font-bold text-[black] mb-2">
                    Termos de Uso
                  </h2>
                  <div className="overflow-y-scroll max-h-64 p-2 border">
                    <p className="text-[black] mb-4">
                      Bem-vindo à MAP. Ao utilizar nossos serviços, você
                      concorda com os seguintes Termos de Serviço. Leia
                      atentamente cada item, pois ele descreve os direitos e
                      responsabilidades dos usuários.
                    </p>
                    <p className="text-[black]">
                      <b>1. Aceitação dos Termos</b>
                      <br/>
                      Ao utilizar os serviços da plataforma Map Marketplaces,
                      você concorda integralmente com os presentes Termos de Uso.
                      Caso não concorde com qualquer cláusula aqui descrita,
                      recomenda-se que não utilize nossos serviços.
                      O uso contínuo da plataforma será interpretado
                      como aceitação tácita dos termos.
                      <br/>
                      <br/>
                      <b>2. Cadastro de Usuário</b>
                      <br/>
                      Você pode ser obrigado a registrar uma conta conosco para fins de
                      uso de nossos serviços. Você concorda que as informações que você fornece são precisas,
                      até onde você sabe. Você será obrigado a nos fornecer certas informações pessoais como
                      parte de sua conta. Você concorda em manter as informações quanto à sua precisão.
                      Deixar de manter uma conta atualizada pode resultar na sua incapacidade de usar nossos serviços.
                      Você é o único responsável por todas as atividades que ocorrem em sua conta.
                      <br/>
                      <br/>
                      <b>3. Informações da conta</b>
                      <br/>
                      A privacidade e segurança dos seus dados são prioridades para o Map Marketplaces.
                      Ao utilizar nossa plataforma, você concorda com a coleta, processamento e uso dos
                      seus dados pessoais de acordo com nossa Política de Privacidade.
                      Os dados coletados serão utilizados exclusivamente para a prestação dos serviços,
                      como criação e publicação de anúncios. Também podemos usar suas informações para
                      melhorar nossos serviços, realizar análises internas ou enviar comunicações sobre
                      atualizações, novos recursos ou ofertas promocionais, desde que você tenha consentido
                      previamente.
                      Nós nos comprometemos a adotar medidas de segurança para proteger seus dados, mas não
                      nos responsabilizamos por danos decorrentes de falhas de segurança fora de nosso controle.
                      <br/>
                      <br/>
                      Uso da conta. Você concorda em usar sua conta exclusivamente para o benefício de nossos
                      serviços. Você também concorda que não permite que terceiros usem sua conta ou usem sua
                      conta para quaisquer serviços não associados à sua propriedade pessoal ou propriedade sobre
                      a qual você tenha controle legal. Você concorda que usará nossos serviços apenas para atividades
                      legais. Você concorda, conforme necessário, em oferecer prova de identidade ao concluir os
                      serviços
                      para garantir que você corresponda aos detalhes da conta.
                      <br/>
                      <br/>
                      <b>4. Responsabilidades do Usuário</b>
                      <br/>
                      Ao utilizar a Map Marketplaces, o usuário declara que todas as informações fornecidas para a
                      criação de anúncios são verdadeiras, completas e legais. O usuário é integralmente responsável
                      pelo conteúdo dos anúncios, incluindo o cumprimento das normas aplicáveis, como legislações de
                      publicidade, direitos autorais, e regulamentos específicos das plataformas integradas.
                      O usuário também se compromete a não utilizar o serviço para criar ou publicar anúncios que contenham
                      conteúdo impróprio, ilegal, ofensivo ou que viole as políticas das plataformas parceiras, como Bling
                      e Olist. Caso isso ocorra, a Map Marketplaces se reserva o direito de suspender ou encerrar a conta
                      do usuário sem aviso prévio.
                      Além disso, o usuário reconhece que é sua responsabilidade revisar e aprovar o anúncio antes de sua
                      publicação nas plataformas integradas.
                      <br/>
                      <br/>
                      <b>5. Modificações do Serviço</b>
                      <br/>
                      A Map Marketplaces reserva-se o direito de modificar, suspender ou descontinuar, temporária ou
                      permanentemente, qualquer funcionalidade ou parte de seus serviços, a qualquer momento, sem
                      aviso prévio. Essas mudanças podem incluir ajustes nas integrações com plataformas de terceiros,
                      alterações na estrutura do serviço ou remoção de funcionalidades.

                      Sempre que possível, notificaremos os usuários sobre alterações significativas, mas o uso contínuo
                      da plataforma após a implementação das mudanças será considerado como aceitação das mesmas. O Map
                      Marketplaces não se responsabiliza por eventuais impactos causados por tais modificações, desde que estejam
                      de acordo com os presentes Termos de Uso.
                      <br/>
                      <br/>
                      <b>6. Limitação de Responsabilidade</b>
                      <br/>
                      Não nos responsabilizamos por quaisquer danos diretos,
                      indiretos, incidentais ou punitivos resultantes do uso ou
                      da incapacidade de uso do serviço.
                      <br/>
                      <br/>
                      <b>7. Alterações e Cancelamento</b>
                      <br/>
                      Reservamo-nos o direito de modificar ou encerrar a conta
                      de um usuário que viole os termos estabelecidos. Você pode
                      cancelar sua conta a qualquer momento através das
                      configurações da sua conta.
                    </p>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setShowTermsModal(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
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

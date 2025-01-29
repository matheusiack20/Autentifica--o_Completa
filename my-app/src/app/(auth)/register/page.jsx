'use client';

import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import imglogo from '/public/LogoMAP.png';
import eyeOpen from '/public/icons/olhoaberto.png'; // Caminho do ícone de mostrar senha
import eyeClosed from '/public/icons/olhofechado.png'; // Caminho do ícone de ocultar senha
import React from 'react';

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
                      className={`p-2 bg-[#DAFD00] rounded-md text-center w-[200px] text-[#2c2c2c] font-medium ${
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

                <p>
                  Para criar uma conta, clique no botão &quot;Registrar&quot; abaixo.
                </p>

                {error && (
                    <div className="text-red-500 text-sm text-center mt-2">
                      {error}
                    </div>
                )}

                {showTermsModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white p-4 rounded-md max-w-xl">
                        <h2 className="text-center font-bold text-[black] mb-2">
                          Termos de Uso
                        </h2>
                        <div className="overflow-y-scroll max-h-64 p-2 border">
                          <p className="text-[black] mb-4 text-justify">
                            Bem-vindo à MAP. Ao utilizar nossos serviços, você
                            concorda com os seguintes Termos de Serviço. Leia
                            atentamente cada item, pois ele descreve os direitos e
                            responsabilidades dos usuários.
                          </p>
                          <p className="text-[black] text-justify">
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
                            Ao criar uma conta conosco para utilizar nossos serviços, você declara que as informações fornecidas
                            são precisas, conforme seu conhecimento. Será solicitado que você disponibilize alguns dados pessoais
                            como parte do cadastro. É sua responsabilidade garantir que essas informações estejam corretas. Não
                            manter sua conta atualizada pode levar à impossibilidade de acessar nossos serviços. Você é exclusivamente
                            responsável por todas as atividades realizadas por meio de sua conta.
                            <br/>
                            <br/>
                            <b>3. Informações da conta</b>
                            <br/>
                            A segurança e a privacidade dos seus dados são prioridades para a Map Marketplaces. Ao utilizar nossa plataforma,
                            você aceita a coleta, o processamento e o uso de seus dados pessoais conforme descrito em nossa Política de
                            Privacidade. As informações coletadas serão utilizadas exclusivamente para fornecer os serviços, como a criação
                            e publicação de anúncios. Além disso, podemos usar esses dados para aprimorar nossos serviços, realizar análises
                            internas ou enviar comunicações sobre atualizações, novos recursos e ofertas promocionais, desde que você tenha
                            dado seu consentimento prévio. Comprometemo-nos a implementar medidas de segurança para proteger suas informações,
                            mas não nos responsabilizamos por prejuízos causados por falhas de segurança fora de nosso controle.
                            <br/>
                            <br/>
                            Utilização da conta. Você se compromete a utilizar sua conta exclusivamente para os fins relacionados aos nossos serviços.
                            Também concorda em não permitir que terceiros utilizem sua conta ou a utilizem para finalidades não vinculadas à sua
                            propriedade pessoal ou a bens sobre os quais você detenha controle legal. Você se compromete a usar nossos serviços
                            exclusivamente para atividades legais. Quando necessário, concorda em fornecer comprovação de identidade ao concluir os
                            serviços, assegurando que suas informações correspondem aos dados da conta. Caso tome conhecimento de qualquer violação de
                            segurança ou uso não autorizado de sua conta, você deve nos informar imediatamente.

                            <br/>
                            <br/>
                            <b>4. Responsabilidades do Usuário</b>
                            <br/>
                            Ao utilizar a Map Marketplaces, o usuário declara que todas as informações fornecidas para a
                            criação de anúncios são verdadeiras, completas e legais. O usuário é integralmente responsável
                            pelo conteúdo dos anúncios, incluindo o cumprimento das normas aplicáveis, como legislações de
                            publicidade, direitos autorais, e regulamentos específicos das plataformas integradas.
                            O usuário também se compromete a não utilizar o serviço para criar ou publicar anúncios que
                            contenham conteúdo impróprio, ilegal, ofensivo ou que viole as políticas das plataformas parceiras,
                            como Bling e Olist. Caso isso ocorra, a Map Marketplaces se reserva o direito de suspender ou
                            encerrar a conta do usuário sem aviso prévio. Além disso, o usuário reconhece que é sua
                            responsabilidade revisar e aprovar o anúncio antes de sua publicação nas plataformas integradas.
                            <br/>
                            <br/>
                            <b>5. Modificações do Serviço</b>
                            <br/>
                            A Map Marketplaces reserva-se o direito de modificar, suspender ou descontinuar, temporária ou
                            permanentemente, qualquer funcionalidade ou parte de seus serviços, a qualquer momento, sem
                            aviso prévio. Essas mudanças podem incluir ajustes nas integrações com plataformas de terceiros,
                            alterações na estrutura do serviço ou remoção de funcionalidades.

                            Sempre que possível, notificaremos os usuários sobre alterações significativas, mas o uso contínuo
                            da plataforma após a implementação das mudanças será considerado como aceitação das mesmas. A Map
                            Marketplaces não se responsabiliza por eventuais impactos causados por tais modificações, desde
                            que estejam de acordo com os presentes Termos de Uso.
                            <br/>
                            <br/>
                            <b>6. Limitação de Responsabilidade</b>
                            <br/>
                            A Map Marketplaces oferece seus serviços no estado em que se encontram, sem garantias de resultados
                            específicos, como aumento de vendas, maior visibilidade ou sucesso dos anúncios criados e publicados.
                            Não nos responsabilizamos por falhas técnicas, indisponibilidades ou problemas relacionados a plataformas
                            de terceiros, como Bling e Olist, nem por alterações realizadas por essas plataformas que possam impactar
                            as integrações com nosso sistema. O usuário reconhece que é sua responsabilidade revisar os anúncios antes
                            da publicação e garantir que o conteúdo esteja em conformidade com as leis e regulamentos aplicáveis.

                            A Map Marketplaces não se responsabiliza por erros, omissões ou interpretações equivocadas nos anúncios gerados
                            a partir das informações fornecidas pelo usuário. Sob nenhuma circunstância, a Map Marketplaces será responsável
                            por perdas financeiras, danos incidentais, indiretos ou consequentes, incluindo lucros cessantes, interrupções nos
                            negócios ou perda de dados, decorrentes do uso ou da incapacidade de utilizar nossos serviços.

                            <br/>
                            <br/>
                            <b>7. Cancelamento</b>
                            <br/>
                            Após o cancelamento, sua assinatura permanecerá ativa até o final do período de cobrança atual,
                            permitindo acesso contínuo aos serviços até o término desse período (exceto nos casos em que seu
                            acesso seja suspenso ou encerrado conforme disposto abaixo). No entanto, você não terá direito a
                            reembolso por valores já pagos.

                            A Map Marketplaces reserva-se o direito de negar acesso a todos ou parte dos serviços ou encerrar
                            sua conta, com ou sem aviso prévio, caso seja identificada qualquer conduta ou atividade que viole
                            estes Termos de Uso, os direitos da Map Marketplaces, ou que seja considerada inadequada ou
                            prejudicial, a exclusivo critério da empresa. Em tais casos, o cancelamento ou suspensão não dará
                            direito a reembolso.
                            <br/>
                            <br/>
                            <b>8. Atividades Bancárias</b>
                            <br/>
                            Utilizamos serviços de terceiros para processar pagamentos relacionados aos nossos serviços.
                            Não armazenamos nem rastreamos informações sobre o uso de seus dados bancários, incluindo,
                            mas não se limitando a, nomes de usuário e senhas. Não assumimos responsabilidade pela proteção
                            ou segurança das informações bancárias em relação ao uso de nossos serviços. Embora adotemos
                            medidas para proteger suas informações, nossos serviços são fornecidos como estão, e você assume
                            total responsabilidade e risco ao utilizá-los, bem como os serviços de terceiros. É sua
                            responsabilidade garantir que tome as devidas precauções para proteger suas informações
                            pessoais e confidenciais.
                            <br/>
                            <br/>
                            <b>9. Política de Assinatura e Cobrança Recorrente</b>
                            <br/>
                            Modelo de Assinatura: O serviço oferecido pelo MAP Marketplaces funciona por meio de um modelo de
                            assinatura recorrente, no qual o usuário autoriza cobranças periódicas em seu método de pagamento cadastrado.

                            <br/>
                            <br/>
                            Cobrança Automática: Ao fornecer os dados de pagamento, o usuário autoriza a cobrança automática do valor
                            correspondente ao plano escolhido, de forma recorrente, até que a assinatura seja cancelada pelo próprio
                            usuário ou pela  MAP Marketplaces.

                            <br/>
                            <br/>
                            Renovação Automática: A assinatura será renovada automaticamente ao final de cada período de faturamento
                            (mensal, trimestral, anual, conforme o plano escolhido), salvo se o usuário cancelar a assinatura antes
                            da próxima cobrança.

                            <br/>
                            <br/>
                            Mudanças de Preços: A MAP Marketplaces reserva-se o direito de modificar os preços de assinatura a qualquer
                            momento. Caso haja alterações, os usuários serão notificados com antecedência, podendo optar pelo cancelamento
                            antes da próxima cobrança.

                            <br/>
                            <br/>
                            Falha na Cobrança: Se uma cobrança não for concluída devido a falta de saldo, cartão expirado ou outros problemas
                            relacionados ao pagamento, a plataforma poderá suspender o acesso ao serviço até que um novo pagamento seja realizado.

                            <br/>
                            <br/>
                            Caso a MAP Marketplaces ofereça um período de teste gratuito, a assinatura será ativada automaticamente ao término
                            desse período, e a cobrança ocorrerá no método de pagamento cadastrado, salvo se o usuário cancelar antes da data
                            programada para a primeira cobrança.
                            <br/>
                            <br/>
                            <b>10. Lei Geral de Proteção de Dados</b>
                            <br/>
                            Na MAP Marketplaces, sua privacidade e a segurança dos seus dados são nossas prioridades. Coletamos, armazenamos e
                            processamos suas informações com total transparência, seguindo as melhores práticas de segurança e em conformidade
                            com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Seus dados são utilizados exclusivamente para melhorar
                            sua experiência e otimizar nossos serviços. Além disso, você tem total controle sobre suas informações, podendo acessá-las,
                            corrigi-las ou solicitar sua exclusão a qualquer momento. Para mais detalhes, consulte nossa Política de Privacidade.
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

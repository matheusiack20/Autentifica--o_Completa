'use client';
import React, { useState } from 'react';
import PlanPriceCard from './plansCards';
import axios from 'axios';

const PlansPriceBoard: React.FC = () => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleToggle = () => {
    setChecked(!checked);
  };

  const handleSubscribe = async (planName: string) => {
    const planType = checked ? 'annual' : 'monthly';
    const email = 'user@example.com'; // Substitua pelo email do usuário logado
    const cardToken = 'CARD_TOKEN'; // Substitua pelo token do cartão do usuário

    try {
      const response = await axios.post(
        '/api/auth/subscriptions/create-preapproval',
        {
          email,
          planType,
          planName,
          cardToken,
        },
      );

      const { init_point } = response.data;
      window.location.href = init_point;
    } catch (error) {
      console.error(
        'Erro ao processar pagamento:',
        error.response ? error.response.data : error.message,
      );
    }
  };

  return (
    <section className="flex flex-col items-center">
      <div
        id="toggle-switch-plans"
        className={`select-none text-[18px] border border-ternary relative flex w-60 h-14 rounded-full cursor-pointer transition-colors duration-300 bg-[#282828]`}
        onClick={handleToggle}
      >
        <div className="z-10 flex-1 flex items-center justify-center text-black">
          <span
            className={`font-bold transition-colors ${checked ? 'text-white' : 'text-black'}`}
          >
            Mensal
          </span>
        </div>
        <div className="z-10 flex-1 flex items-center justify-center mr-3">
          <div className="flex items-center">
            <span
              className={`font-bold transition-colors ${!checked ? 'text-white' : 'text-black'}`}
            >
              Anual
            </span>
            <div className="font-bold ml-2 text-[12px] bg-green-600 rounded-sm p-[1.5px] text-white">
              25% off
            </div>
          </div>
        </div>
        <div
          className={`absolute top-1 left-0 h-12 bg-ternary rounded-full transform transition-all duration-300 ${checked ? 'w-32 translate-x-[105px]' : 'w-24 translate-x-2'}`}
        />
      </div>

      <center>
        <div id="my-plans-board" className="mt-8 flex flex-wrap justify-center">
          <PlanPriceCard
            isCheckedAnualMode={checked}
            name="Free"
            price={0}
            discount={0}
            benefits="Período de Teste;Criação de 1 anúncio"
            borderColor={checked ? 'border-[#1cbf03]' : 'border-[#1cbf03]'}
            bgColor="bg-[#00000] hover:shadow-[#1cbf03]"
            buttonColor="bg-[#1cbf03] hover:shadow-[#c1c1c1]"
            iconColor="#1cbf03"
            titleBgColor="bg-[#1cbf03]"
            onSubscribe={() => handleSubscribe('free')}
          />

          <PlanPriceCard
            isCheckedAnualMode={checked}
            name="Bronze"
            price={490.0}
            discount={25.0}
            benefits="Cadastro de Produtos; Criação de Categorias; Multi Integrações"
            borderColor={checked ? 'border-[#DAFD00]' : 'border-[#DAFD00]'}
            bgColor="bg-[#00000]"
            titleBgColor="bg-[#DAFD00]"
            onSubscribe={() => handleSubscribe('bronze')}
          />

          <PlanPriceCard
            isCheckedAnualMode={checked}
            name="Prata"
            price={590.0}
            discount={25.0}
            benefits="Cadastro de Produtos; Criação de Categorias; Sugestões de Imagens; Suporte Ticket"
            borderColor={checked ? 'border-[#1cbf03]' : 'border-[#1cbf03]'}
            bgColor="bg-[#000000] hover:shadow-[#1cbf03]"
            buttonColor="bg-[#1cbf03] hover:shadow-[#c1c1c1]"
            iconColor="#1cbf03"
            titleBgColor="bg-[#1cbf03]"
            onSubscribe={() => handleSubscribe('prata')}
          />

          <PlanPriceCard
            isCheckedAnualMode={checked}
            name="Ouro"
            price={1590.0}
            discount={25.0}
            benefits="Cadastro de Produtos; Criação de Categorias; Multi Integrações; Sugestões de Imagens; Editor de imagens; Suporte Whatsapp"
            borderColor={checked ? 'border-[#DAFD00]' : 'border-[#DAFD00]'}
            bgColor="bg-[#00000]"
            titleBgColor="bg-[#DAFD00]"
            onSubscribe={() => handleSubscribe('ouro')}
          />
        </div>
      </center>
    </section>
  );
};

export default PlansPriceBoard;

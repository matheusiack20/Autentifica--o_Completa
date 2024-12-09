"use client"
import React, { useState } from 'react';
import PlanPriceCard from './plansCards';

const PlansPriceBoard: React.FC = () => {
    const [checked, setChecked] = useState<boolean>(false);

    const handleToggle = () => {
        setChecked(!checked);
    };

    return (
        <section className='flex flex-col items-center'>
            <div id='toggle-switch-plans'
                className={`select-none text-[18px] border border-ternary relative flex w-60 h-14 rounded-full cursor-pointer transition-colors duration-300 bg-[#282828]`}
                onClick={handleToggle}
            >
                <div className="z-10 flex-1 flex items-center justify-center text-black">
                    <span className={`font-bold transition-colors ${checked ? 'text-white' : 'text-black'}`}>Mensal</span>
                </div>
                <div className="z-10 flex-1 flex items-center justify-center mr-3">
                    <div className='flex items-center'>
                        <span className={`font-bold transition-colors ${!checked ? 'text-white' : 'text-black'}`}>Anual</span>
                        <div className='font-bold ml-2 text-[12px] bg-green-600 rounded-sm p-[1.5px] text-white'>
                            {/* necessário implementar para pegar as promoções do banco de dados */}
                            25% off
                        </div>
                    </div>
                </div>
                <div
                    className={`absolute top-1 left-0 h-12 bg-ternary rounded-full transform transition-all duration-300 ${checked ? 'w-32 translate-x-[105px]' : 'w-24 translate-x-2'}`}
                />
            </div>

            <center>
                <div id='my-plans-board' className='mt-8 flex flex-wrap justify-center'>
                    <PlanPriceCard
                        isCheckedAnualMode={checked}
                        name='Free'
                        price={0}
                        discount={0}
                        benefits='1 anúncio; Período de Teste'
                    />
                    <PlanPriceCard
                        isCheckedAnualMode={checked}
                        name='Bronze'
                        price={490.00}
                        discount={25.00}
                        benefits='Cadastro de Produtos; Enriquecimento de Produtos; Criando Categorias; Sugestão de Imagens; Multi Integrações;'
                    />
                    <PlanPriceCard
                        isCheckedAnualMode={checked}
                        name='Prata'
                        price={900.00}
                        discount={25.00}
                        benefits='Tudo do plano Ouro; Cadastro de Produtos; Enriquecimento de Produtos; Criando Categorias; Sugestão de Imagens; Multi Integrações; Suporte Map;'
                    />
                    <PlanPriceCard
                        isCheckedAnualMode={checked}
                        name='Ouro'
                        price={1590.00}
                        discount={25.00}
                        benefits='Tudo do plano Prata; Suporte WhatsApp; Sem Limite de Requisições;'
                    />
                </div>
            </center>
        </section>
    );
}

export default PlansPriceBoard;

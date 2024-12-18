import React from 'react';
import { FaCheck } from 'react-icons/fa';

interface PlanPriceCardProps {
  isCheckedAnualMode: boolean;
  name: string;
  price: number;
  discount: number;
  benefits: string;
  borderColor: string;
  bgColor: string;
  titleBgColor: string; // Cor de fundo do título
  titleTextColor?: string; // Cor da letra do título
  buttonColor?: string; // Cor de fundo do botão (opcional)
  buttonTextColor?: string; // Cor da letra do botão (opcional)
  benefitTextColor?: string; // Cor do texto dos benefícios
  priceTextColor?: string; // Cor do valor
  monthTextColor?: string; // Cor do texto "mês"
  iconColor?: string; // Cor do ícone dos benefícios
  onSubscribe: () => void;
}

const PlanPriceCard: React.FC<PlanPriceCardProps> = ({
  isCheckedAnualMode,
  name,
  price,
  discount,
  benefits,
  borderColor,
  bgColor,
  titleBgColor,
  titleTextColor = 'text-black', // Valor padrão
  buttonColor = 'bg-ternary',
  buttonTextColor = 'text-white', // Valor padrão
  benefitTextColor = 'text-white', // Valor padrão
  priceTextColor = 'text-white', // Valor padrão
  monthTextColor = 'text-white', // Valor padrão
  iconColor = '#DAFD00',
  onSubscribe,
}) => {
  return (
    <div
      className={`select-none flex flex-col items-center border ${borderColor} w-[300px] text-center ${bgColor} m-2 rounded-2xl min-h-[500px] h-auto pb-10 shadow-lg hover:shadow-lg hover:shadow-ternary transition-shadow duration-300`}
    >
      {/* Nome do Plano com fundo e cor de texto personalizáveis */}
      <div
        id="plan_name"
        className={`inline-block m-4 min-w-[130px] px-4 py-1 rounded-full ${titleBgColor}`}
      >
        <h1 className={`text-[20px] font-extrabold ${titleTextColor}`}>{name}</h1>
      </div>

      {isCheckedAnualMode && (
        <div
          id="tag_discount"
          className="mt-3 font-bold text-[12px] bg-green-600 rounded-sm px-2 py-1 text-white"
        >
          <span>{discount}% off</span>
        </div>
      )}

      <div id="pricing" className="mt-5 mb-3 flex flex-col">
        {isCheckedAnualMode && (
          <span className="line-through text-[#929292] font-extrabold text-[20px]">
            R$ {price.toFixed(2).replace('.', ',')}
          </span>
        )}
        <span className={`font-extrabold text-[20px] ${priceTextColor}`}>
          R${' '}
          {(isCheckedAnualMode ? (price * (100 - discount)) / 100 : price)
            .toFixed(2)
            .replace('.', ',')}{' '}
          <span className={`text-[14px] ${monthTextColor}`}>/mês</span>
        </span>
      </div>

      <button
        id="button_buy_plan"
        className={`text-[22px] ${buttonTextColor} ${buttonColor} font-extrabold px-3 py-1 rounded-lg transition-all hover:scale-95`}
        onClick={onSubscribe}
      >
        Assinar Agora
      </button>

      <div className="my-5 w-[200px] h-2 border-b border-white" />
      <div id="benefits_list" className="w-[180px]">
        {benefits.split(';').map((benefit, index) => (
          <div
            key={index}
            className={`flex items-center mb-2 text-[14px] whitespace-nowrap ${benefitTextColor}`}
          >
            <FaCheck className="mr-2" style={{ color: iconColor }} />
            <span>{benefit.trim()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanPriceCard;
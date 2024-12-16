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
  onSubscribe: () => void;
  buttonColor?: string; // Opcional
  iconColor?: string; // Opcional
}


const PlanPriceCard: React.FC<PlanPriceCardProps> = ({
  isCheckedAnualMode,
  name,
  price,
  discount,
  benefits,
  borderColor,
  bgColor,
  onSubscribe,
  buttonColor = 'bg-ternary',
  iconColor = '#DAFD00',
  titleBgColor, // Recebe a cor de fundo personalizada
}) => {
  return (
    <div
      className={`select-none flex flex-col items-center border ${borderColor} w-[300px] text-center ${bgColor} m-2 rounded-2xl min-h-[500px] h-auto pb-10 shadow-lg hover:shadow-lg hover:shadow-ternary transition-shadow duration-300`}
    >
      {/* Nome do Plano com fundo personalizado */}
      <div
        id="plan_name"
        className={`inline-block m-4 min-w-[130px] px-4 py-1 rounded-full ${titleBgColor}`}
      >
        <h1 className="text-[20px] font-extrabold text-black">{name}</h1>
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
        <span className="text-white font-extrabold text-[20px]">
          R${' '}
          {(isCheckedAnualMode ? (price * (100 - discount)) / 100 : price)
            .toFixed(2)
            .replace('.', ',')}{' '}
          <span className="text-[14px] text-white">/mês</span>
        </span>
      </div>

      <button
        id="button_buy_plan"
        className={`text-[22px] text-black ${buttonColor} font-extrabold px-3 py-1 rounded-lg transition-all hover:bg-white hover:scale-95`}
        onClick={onSubscribe}
      >
        Assinar Agora
      </button>

      <div className="my-5 w-[200px] h-2 border-b border-white" />
      <div id="benefits_list" className="w-[180px]">
        {benefits.split(';').map((benefit, index) => (
          <div
            key={index}
            className="text-white flex items-center mb-2 text-[14px] whitespace-nowrap"
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

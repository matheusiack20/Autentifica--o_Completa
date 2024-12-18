import React from 'react';
import { FaCheck } from 'react-icons/fa';
const PlanPriceCard: React.FC<PlanPriceCardProps> = ({
  isCheckedAnualMode,
  name,
  price,
  discount,
  benefits,
  borderColor,
  bgColor,
  titleBgColor,
  titleTextColor = 'text-black',
  buttonColor = 'bg-ternary',
  buttonTextColor = 'text-white',
  benefitTextColor = 'text-white',
  priceTextColor = 'text-white',
  monthTextColor = 'text-white',
  iconColor = '#DAFD00',
  onSubscribe,
}) => {
  const handleSubscribe = () => {
    window.location.href = 'https://c119-131-0-29-227.ngrok-free.app';
  };

  return (
    <div
      className={`select-none flex flex-col items-center border ${borderColor} w-[300px] text-center ${bgColor} m-2 rounded-2xl min-h-[500px] h-auto pb-10 shadow-lg hover:shadow-lg hover:shadow-ternary transition-shadow duration-300`}
    >
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
        onClick={handleSubscribe}
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

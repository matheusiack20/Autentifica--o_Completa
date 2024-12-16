import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';  // Usando NextAuth.js para gerenciamento de sessão
import { FaCheck } from 'react-icons/fa'; // Importing check icon from react-icons

interface PlanPriceProps {
  isCheckedAnualMode: boolean;
  name: string;
  price: number;
  discount: number;
  benefits: string;
  onSubscribe: () => void;
}

const PlanPriceCard: React.FC<PlanPriceProps> = ({
  isCheckedAnualMode,
  name,
  price,
  discount,
  benefits,
}) => {
  const { data: session } = useSession();  // Obtendo a sessão do usuário logado
  const [email, setEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      console.log('Sessão do usuário:', session);  // Logando a sessão
      setEmail(session.user?.email || null);
      setFullName(session.user?.name || null);
    }
  }, [session]);

  const benefitsList = benefits
    .split(';')
    .filter((benefit) => benefit.trim() !== '');

  const handleBuyNow = async () => {
    if (!email || !fullName) {
      alert('Por favor, faça login para realizar a compra.');
      return;
    }

    try {
      const response = await fetch('/api/auth/subscriptions/create-preapproval', {
        method: 'POST',
        body: JSON.stringify({
          email,
          planType: isCheckedAnualMode ? 'annual' : 'monthly',
          planName: name.toLowerCase(),
          cardToken: 'YOUR_CARD_TOKEN', // Substitua pelo token do cartão
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!data.init_point) {
        throw new Error('Link de pagamento não retornado.');
      }

      window.location.href = data.init_point;
    } catch (error) {
      console.error('Erro ao processar pagamento:', error.message);
    }
  };

  return (
    <div className="c select-none flex flex-col items-center border border-ternary w-[300px] text-center bg-secondary m-2 rounded-2xl min-h-[500px] h-auto pb-10 shadow-lg hover:shadow-lg hover:shadow-ternary transition-shadow duration-300"> {/* Added shadow effect around */}
      <div
        id="plan_name"
        className="text-center m-4 bg-ternary w-auto min-w-[130px] px-4 py-1 rounded-3xl"
      >
        <h1 className="text-[20px] font-extrabold text-shadow text-black shadowhad">
          <span
            className={
              name === 'Olist'
                ? 'text-olistcolor'
                : name === 'Bling'
                  ? 'text-blingcolor'
                  : ''
            }
          >
            {name}
          </span>
        </h1>
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
            .replace('.', ',')} <span className="text-[14px] text-ternary">/mês</span>
        </span>
      </div>
      <button
        id="button_buy_plan"
        className="text-[22px] text-black bg-ternary font-extrabold px-3 py-1 rounded-lg transition-all hover:bg-white hover:scale-95" // Added hover:scale-95 for shrink effect
        onClick={handleBuyNow}
      >
        Assinar Agora
      </button>
      <div className="my-5 w-[170px] h-2 border-b border-ternary" />
      <div id="benefits_list" className="w-[180px]">
        {benefitsList.map((benefit, index) => (
          <div
            key={index}
            className="text-white flex items-center mb-2 text-[14px] whitespace-nowrap"
          >
            <FaCheck className="mr-2" style={{ color: '#DAFD00' }} /> {/* Adding check icon with color */}
            <span>{benefit.trim()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanPriceCard;

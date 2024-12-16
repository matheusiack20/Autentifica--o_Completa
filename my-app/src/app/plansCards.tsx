import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Usando NextAuth.js para gerenciamento de sessão
import { FaCheck } from 'react-icons/fa'; // Importando ícone de check

interface PlanPriceProps {
  isCheckedAnualMode: boolean;
  name: string;
  price: number;
  discount: number;
  benefits: string;
  onSubscribe: () => void;
  borderColor?: string; // Nova propriedade para borda e sombra dinâmica
}

const PlanPriceCard: React.FC<PlanPriceProps> = ({
  isCheckedAnualMode,
  name,
  price,
  discount,
  benefits,
  onSubscribe,
  borderColor = 'border-ternary', // Classe padrão para a borda
}) => {
  const { data: session } = useSession(); // Obtendo a sessão do usuário logado
  const [email, setEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
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
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao processar pagamento.');
      }

      const data = await response.json();
      if (!data.init_point) {
        throw new Error('Link de pagamento não retornado.');
      }

      window.location.href = data.init_point;
    } catch (error) {
      console.error('Erro ao processar pagamento:', error.message);
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <div
      className={`c select-none flex flex-col items-center ${borderColor} border w-[300px] text-center bg-secondary m-2 rounded-2xl min-h-[500px] h-auto pb-10 shadow-lg hover:shadow-lg transition-shadow duration-300`}
    >
      {/* Nome do plano */}
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

      {/* Desconto */}
      {isCheckedAnualMode && (
        <div
          id="tag_discount"
          className="mt-3 font-bold text-[12px] bg-green-600 rounded-sm px-2 py-1 text-white"
        >
          <span>{discount}% off</span>
        </div>
      )}

      {/* Preço */}
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
          <span className="text-[14px] text-ternary">/mês</span>
        </span>
      </div>

      {/* Botão de assinatura */}
      <button
        id="button_buy_plan"
        className="text-[22px] text-black bg-ternary font-extrabold px-3 py-1 rounded-lg transition-all hover:bg-white hover:scale-95"
        onClick={handleBuyNow}
      >
        Assinar Agora
      </button>

      {/* Linha de separação */}
      <div className="my-5 w-[170px] h-2 border-b border-ternary" />

      {/* Lista de benefícios */}
      <div id="benefits_list" className="w-[180px]">
        {benefitsList.map((benefit, index) => (
          <div
            key={index}
            className="text-white flex items-center mb-2 text-[14px] whitespace-nowrap"
          >
            <FaCheck className="mr-2" style={{ color: '#DAFD00' }} />
            <span>{benefit.trim()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanPriceCard;

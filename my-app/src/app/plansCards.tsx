import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';  // Usando NextAuth.js para gerenciamento de sessão

interface PlanPriceProps {
  isCheckedAnualMode: boolean;
  name: string;
  price: number;
  discount: number;
  benefits: string;
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
        // Enviar dados para a API que cria a preferência de pagamento
        const response = await fetch('/api/user/mercadopago', {
          method: 'POST',
          body: JSON.stringify({
            email,
            fullName,
            selectedPlan: name,
            planPrice: isCheckedAnualMode ? (price * (100 - discount)) / 100 : price,
            frequency: isCheckedAnualMode ? 12 : 1,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        console.log('Resposta da API:', response);  // Verificando a resposta antes de tentar parseá-la
    
        // Se a resposta não for JSON válido, tente logar o conteúdo da resposta para depurar
        const textResponse = await response.text();
        console.log('Texto da resposta:', textResponse);
    
        // Se a resposta não for JSON válido, podemos retornar aqui
        try {
          const data = JSON.parse(textResponse);
          console.log('Resposta JSON:', data);  // Logando a resposta JSON
          if (!data.init_point) {
            throw new Error('Link de pagamento não retornado.');
          }
    
          // Redirecionando para o Mercado Pago
          window.location.href = data.init_point;
        } catch (error) {
          console.error('Erro ao processar a resposta JSON:', error.message);
        }
      } catch (error) {
        console.error('Erro ao processar pagamento:', error.message);
      }
    };
    

  return (
    <div className="c select-none flex flex-col items-center border border-ternary w-[235px] text-center bg-secondary m-2 rounded-2xl min-h-[500px] h-auto pb-10">
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
            .replace('.', ',')}
        </span>
      </div>
      <button
        id="button_buy_plan"
        className="text-[22px] text-black bg-ternary font-extrabold px-3 py-1 rounded-lg transition-all hover:bg-white"
        onClick={handleBuyNow}
      >
        Assinar Agora
      </button>
      <div className="my-5 w-[170px] h-2 border-b border-white" />
      <div id="benefits_list" className="w-[180px]">
        {benefitsList.map((benefit, index) => (
          <div
            key={index}
            className="text-white flex items-center mb-1 text-[12px] lowercase"
          >
            <span>{benefit.trim()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanPriceCard;

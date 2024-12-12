// Frontend: Formulário de Pagamento
import { useEffect, useState } from 'react';

export default function PaymentForm() {
  const [cardToken, setCardToken] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY, {
        locale: 'pt-BR',
      });
      window.mp = mp;
    };
    document.body.appendChild(script);
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    const cardData = {
      cardNumber: e.target.cardNumber.value,
      cardholderName: e.target.cardholderName.value,
      cardExpirationMonth: e.target.cardExpirationMonth.value,
      cardExpirationYear: e.target.cardExpirationYear.value,
      securityCode: e.target.securityCode.value,
      identificationType: 'CPF',
      identificationNumber: e.target.identificationNumber.value,
    };

    try {
      const mp = window.mp;
      const cardTokenResponse = await mp.createCardToken(cardData);
      setCardToken(cardTokenResponse.id);
    } catch (error) {
      console.error('Erro ao criar card token:', error);
    }
  };

  const handleSubscription = async () => {
    try {
      const response = await fetch('/api/user/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: cardToken,
          email: 'test@example.com',
          name: 'User Name',
          selectedPlan: 'Plano Mensal',
          planPrice: 100,
          frequency: 1,
        }),
      });

      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error('Erro na criação da assinatura:', data.error);
      }
    } catch (error) {
      console.error('Erro ao processar assinatura:', error);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <div>
        <label>Número do Cartão</label>
        <input type="text" name="cardNumber" required />
      </div>
      <div>
        <label>Nome no Cartão</label>
        <input type="text" name="cardholderName" required />
      </div>
      <div>
        <label>Validade (MM/AA)</label>
        <input type="text" name="cardExpirationMonth" placeholder="MM" required />
        <input type="text" name="cardExpirationYear" placeholder="AA" required />
      </div>
      <div>
        <label>Código de Segurança (CVV)</label>
        <input type="text" name="securityCode" required />
      </div>
      <div>
        <label>CPF</label>
        <input type="text" name="identificationNumber" required />
      </div>
      <button type="submit">Gerar Token</button>
      {cardToken && (
        <div>
          <p>Token Gerado: {cardToken}</p>
          <button type="button" onClick={handleSubscription}>Criar Assinatura</button>
        </div>
      )}
    </form>
  );
}

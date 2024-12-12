import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Script from 'next/script';

export default function PaymentForm() {
  const { data: session } = useSession();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Carregar o SDK do Mercado Pago
    window.MercadoPago.setPublishableKey('YOUR_PUBLIC_KEY');  // Substitua pela sua chave pública
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Coleta os dados do formulário
    const cardForm = window.MercadoPago.cardForm({
      amount: '100.0', // Valor da assinatura
      autoFill: true,
      form: {
        id: 'paymentForm', // O ID do seu formulário HTML
        cardholderName: {
          id: 'cardholderName',
        },
        cardNumber: {
          id: 'cardNumber',
        },
        cardExpirationMonth: {
          id: 'cardExpirationMonth',
        },
        cardExpirationYear: {
          id: 'cardExpirationYear',
        },
        securityCode: {
          id: 'securityCode',
        },
        documentNumber: {
          id: 'documentNumber',
        },
        issuer: {
          id: 'issuer',
        },
        installments: {
          id: 'installments',
        },
      },
    });

    try {
      // Cria o token do cartão
      const { token } = await cardForm.createToken();

      // Envia o token para o backend para criar a assinatura
      const response = await fetch('/api/user/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          email: session.user.email,
          planName: 'Plano Teste',
          planPrice: 100.0,
          frequency: 1, // Mensal
        }),
      });

      const data = await response.json();

      if (data.init_point) {
        // Redireciona para a página de pagamento
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error('Erro ao gerar o token do cartão:', error);
    }
  };

  return (
    <>
      <Script src="https://sdk.mercadopago.com/js/v2"></Script>
      
      <form id="paymentForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="cardholderName">Nome do titular do cartão</label>
          <input type="text" id="cardholderName" required />
        </div>
        <div>
          <label htmlFor="cardNumber">Número do cartão</label>
          <input type="text" id="cardNumber" required />
        </div>
        <div>
          <label htmlFor="cardExpirationMonth">Mês de Expiração</label>
          <input type="text" id="cardExpirationMonth" required />
        </div>
        <div>
          <label htmlFor="cardExpirationYear">Ano de Expiração</label>
          <input type="text" id="cardExpirationYear" required />
        </div>
        <div>
          <label htmlFor="securityCode">Código de segurança</label>
          <input type="text" id="securityCode" required />
        </div>
        <div>
          <label htmlFor="installments">Parcelas</label>
          <input type="text" id="installments" required />
        </div>
        <div>
          <label htmlFor="documentNumber">Número do documento</label>
          <input type="text" id="documentNumber" required />
        </div>
        <button type="submit">Pagar</button>
      </form>
    </>
  );
}

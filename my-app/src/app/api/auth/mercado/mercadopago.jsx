// src/app/api/auth/mercado/mercadopago.jsx

import { useEffect } from 'react';

const MercadoPagoForm = () => {
  useEffect(() => {
    // Carregar o SDK do Mercado Pago
    const mp = new window.MercadoPago('MERCADO_PAGO_KEY_PUBLIC', {
      locale: 'pt-BR',
    });

    // Configurar o formulário de pagamento
    const cardForm = mp.cardForm({
      amount: '100.5', // Valor do pagamento
      iframe: true,
      form: {
        id: 'form-checkout',
        cardNumber: {
          id: 'form-checkout__cardNumber',
          placeholder: 'Número do cartão',
        },
        expirationDate: {
          id: 'form-checkout__expirationDate',
          placeholder: 'MM/YY',
        },
        securityCode: {
          id: 'form-checkout__securityCode',
          placeholder: 'Código de segurança',
        },
        cardholderName: {
          id: 'form-checkout__cardholderName',
          placeholder: 'Titular do cartão',
        },
        issuer: {
          id: 'form-checkout__issuer',
          placeholder: 'Banco emissor',
        },
        installments: {
          id: 'form-checkout__installments',
          placeholder: 'Parcelas',
        },
        identificationType: {
          id: 'form-checkout__identificationType',
          placeholder: 'Tipo de documento',
        },
        identificationNumber: {
          id: 'form-checkout__identificationNumber',
          placeholder: 'Número do documento',
        },
        cardholderEmail: {
          id: 'form-checkout__cardholderEmail',
          placeholder: 'E-mail',
        },
      },
      callbacks: {
        onFormMounted: (error) => {
          if (error) return console.warn('Form Mounted handling error: ', error);
          console.log('Form mounted');
        },
        onSubmit: (event) => {
          event.preventDefault();

          const {
            paymentMethodId: payment_method_id,
            issuerId: issuer_id,
            cardholderEmail: email,
            amount,
            token,
            installments,
            identificationNumber,
            identificationType,
          } = cardForm.getCardFormData();

          // Enviar o token para o backend para processar o pagamento
          fetch('/api/user/process_payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token,
              issuer_id,
              payment_method_id,
              transaction_amount: Number(amount),
              installments: Number(installments),
              description: 'Descrição do produto',
              payer: {
                email,
                identification: {
                  type: identificationType,
                  number: identificationNumber,
                },
              },
            }),
          })
            .then(response => response.json())
            .then(data => {
              if (data.status === 'approved') {
                console.log('Pagamento aprovado');
                // Aqui você pode redirecionar o usuário ou exibir uma mensagem de sucesso
              } else {
                console.error('Erro no pagamento', data);
                // Mostrar erro
              }
            })
            .catch(err => {
              console.error('Erro ao processar o pagamento', err);
            });
        },
      },
    });
  }, []);

  return (
    <div>
      <form id="form-checkout">
        <div id="form-checkout__cardNumber" className="container"></div>
        <div id="form-checkout__expirationDate" className="container"></div>
        <div id="form-checkout__securityCode" className="container"></div>
        <input type="text" id="form-checkout__cardholderName" />
        <select id="form-checkout__issuer"></select>
        <select id="form-checkout__installments"></select>
        <select id="form-checkout__identificationType"></select>
        <input type="text" id="form-checkout__identificationNumber" />
        <input type="email" id="form-checkout__cardholderEmail" />

        <button type="submit" id="form-checkout__submit">Pagar</button>
        <progress value="0" className="progress-bar">Carregando...</progress>
      </form>

      <style jsx>{`
        #form-checkout {
          display: flex;
          flex-direction: column;
          max-width: 600px;
        }

        .container {
          height: 18px;
          display: inline-block;
          border: 1px solid rgb(118, 118, 118);
          border-radius: 2px;
          padding: 1px 2px;
        }

        .progress-bar {
          width: 100%;
          height: 10px;
        }
      `}</style>
    </div>
  );
};

export default MercadoPagoForm;

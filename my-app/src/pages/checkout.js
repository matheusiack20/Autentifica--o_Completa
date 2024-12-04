// src/pages/checkout.js (ou qualquer página onde você quiser configurar o pagamento)

import { useEffect } from 'react';

const Checkout = () => {
  useEffect(() => {
    const mp = new window.MercadoPago(MERCADO_PAGO_KEY_PUBLIC);

    const cardForm = mp.cardForm({
      amount: '100.5',
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

          fetch('/api/payment', {
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
              // Aqui você pode redirecionar o usuário ou mostrar uma mensagem de sucesso
              if (data.status === 'approved') {
                console.log('Pagamento aprovado');
                // Redirecionar ou mostrar sucesso
              } else {
                console.log('Erro no pagamento', data);
                // Mostrar mensagem de erro
              }
            })
            .catch(err => {
              console.error('Erro ao processar o pagamento', err);
            });
        },
        onFetching: (resource) => {
          console.log('Fetching resource: ', resource);
        },
      },
    });

    return () => {
      cardForm.destroy();
    };
  }, []);

  return (
    <div>
      <form id="form-checkout">
        <div id="form-checkout__cardNumber"></div>
        <div id="form-checkout__expirationDate"></div>
        <div id="form-checkout__securityCode"></div>
        <div id="form-checkout__cardholderName"></div>
        <div id="form-checkout__issuer"></div>
        <div id="form-checkout__installments"></div>
        <div id="form-checkout__identificationType"></div>
        <div id="form-checkout__identificationNumber"></div>
        <div id="form-checkout__cardholderEmail"></div>
        <button type="submit">Pagar</button>
      </form>
    </div>
  );
};

export default Checkout;

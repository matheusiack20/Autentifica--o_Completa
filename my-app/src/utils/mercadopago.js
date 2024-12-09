import mercadopago from 'mercadopago';

mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN, // Coloque sua chave privada em um arquivo .env
});

export default mercadopago;

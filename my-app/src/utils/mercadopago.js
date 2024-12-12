import mercadopago from 'mercadopago';

mercadopago.configurations.setAccessToken(process.env.MERCADO_PAGO_ACCESS_TOKEN);

export default mercadopago;


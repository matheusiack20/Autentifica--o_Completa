import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15", // Especificando a versão da API para garantir compatibilidade
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Obtendo os parâmetros da requisição
      const { planType, productType } = req.body;

      // Log para debug
      console.log("Parâmetros recebidos:", { planType, productType });

      // Verificando se os parâmetros foram passados corretamente
      if (!planType || !productType) {
        return res.status(400).json({ error: "Parâmetros ausentes ou inválidos." });
      }

      // Mapeamento dos IDs de preço para os planos
      const priceMap = {
        anual: {
          olist: "price_1QMYgRJdLjslywmyn1CGtRh1",  // Substituir pelo ID real
          bling: "price_1QMYhmJdLjslywmyQQSW7fdd", // Substituir pelo ID real
        },
        mensal: {
          olist: "price_1QMYiNJdLjslywmyUqMxbZ5q",  // Substituir pelo ID real
          bling: "price_1QMYiwJdLjslywmyfHr7xBN4", // Substituir pelo ID real
        },
      };

      // Selecionando o ID do preço com base nos parâmetros fornecidos
      const priceId = priceMap[planType]?.[productType];

      // Validação para garantir que o productType esteja no formato correto
      if (!priceMap[planType]?.[productType.toLowerCase()]) {
        return res.status(400).json({ error: "ID de preço inválido." });
      }

      // Se o priceId não for encontrado, retornar erro
      if (!priceId) {
        return res.status(400).json({
          error: `ID de preço inválido para plano "${planType}" e produto "${productType}".`,
        });
      }

      // Criação da sessão de checkout no Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription", // Mode para subscrição (assinatura)
        success_url: `${process.env.NEXT_PUBLIC_URL}/pagamentostatus/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/pagamentostatus/cancel`,
      });

      // Retornando a URL da sessão de checkout criada
      return res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Erro no backend:", error.message);

      // Erro detalhado
      return res.status(500).json({ error: `Erro interno do servidor: ${error.message}` });
    }
  } else {
    // Definir cabeçalho de métodos permitidos
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }
}

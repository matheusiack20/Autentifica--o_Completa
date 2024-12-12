import mercadopago from "../../../../utils/mercadopago.js";

const plans = [
    {
        reason: 'Assinatura Mensal - Free',
        auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: 0,
            currency_id: 'BRL',
        },
    },
    {
        reason: 'Assinatura Anual - Free',
        auto_recurring: {
            frequency: 1,
            frequency_type: 'years',
            transaction_amount: 0,
            currency_id: 'BRL',
        },
    },
    {
        reason: 'Assinatura Mensal - Bronze',
        auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: 49.00,
            currency_id: 'BRL',
        },
    },
    {
        reason: 'Assinatura Anual - Bronze',
        auto_recurring: {
            frequency: 1,
            frequency_type: 'years',
            transaction_amount: 490.00,
            currency_id: 'BRL',
        },
    },
    {
        reason: 'Assinatura Mensal - Prata',
        auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: 90.00,
            currency_id: 'BRL',
        },
    },
    {
        reason: 'Assinatura Anual - Prata',
        auto_recurring: {
            frequency: 1,
            frequency_type: 'years',
            transaction_amount: 900.00,
            currency_id: 'BRL',
        },
    },
    {
        reason: 'Assinatura Mensal - Ouro',
        auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: 159.00,
            currency_id: 'BRL',
        },
    },
    {
        reason: 'Assinatura Anual - Ouro',
        auto_recurring: {
            frequency: 1,
            frequency_type: 'years',
            transaction_amount: 1590.00,
            currency_id: 'BRL',
        },
    },
];

async function createPlans() {
    for (const plan of plans) {
        try {
            const response = await mercadopago.preapproval_plan.create(plan);
            console.log(`Plano criado: ${plan.reason}`);
            console.log(`preapproval_plan_id: ${response.body.id}`);
        } catch (error) {
            console.error(`Erro ao criar plano: ${plan.reason}`, error);
        }
    }
}

createPlans();

export { createPlans };
import PlanPriceCard from '../../src/app/plansCards';


const Subscriptions = () => {
    return (
        <div>
            <h1>Planos de Assinatura</h1>
            <PlanPriceCard
                isCheckedAnualMode={false}
                name="Plano Básico"
                price={100}
                discount={10}
                benefits="Benefício 1;Benefício 2;Benefício 3"
            />
        </div>
    );
};

export default Subscriptions;

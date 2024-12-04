interface PlanPriceProps {
    isCheckedAnualMode: boolean
    name: string
    price: number
    discount: number
    benefits: string
}

const PlanPriceCard: React.FC<PlanPriceProps> = ({isCheckedAnualMode, name, price, discount, benefits}) => {
    const benefitsList = benefits.split(';').filter(benefit => benefit.trim() !== '');
    return(
        <div className='c select-none flex flex-col items-center border border-ternary w-[235px] text-center bg-secondary m-2 rounded-2xl min-h-[500px] h-auto pb-10'>
            <div id='plan_name' className='text-center m-4 bg-ternary w-auto min-w-[130px] px-4 py-1 rounded-3xl'>
                <h1 className='text-[20px] font-extrabold text-shadow text-black shadowhad'>
                    <span className={name === 'Olist' ? 'text-olistcolor' : name === 'Bling' ? 'text-blingcolor' : ''}>
                        {name}
                    </span>
                </h1>
            </div>
            {isCheckedAnualMode == true ? 
            <div id='tag_discount' className='mt-3 font-bold text-[12px] bg-green-600 rounded-sm px-2 py-1 text-white'>
                <span>{discount}% off</span>
            </div> : ''}
            <div id='pricing' className='mt-5 mb-3 flex flex-col'>
                {isCheckedAnualMode == true ? 
                    <span className='line-through text-[#929292] font-extrabold text-[20px]'>R$ {price.toFixed(2).replace('.',',')}</span>
                : ''}
                {isCheckedAnualMode == true ? 
                    <span className='text-white font-extrabold text-[20px]'>R$ {(price * (100 - discount)/100).toFixed(2).replace('.',',')}</span>
                : 
                <span className='text-white font-extrabold text-[20px]'>R$ {price.toFixed(2).replace('.',',')}</span>
                }
            </div>
            <button id='button_buy_plan' className='text-[22px] text-black bg-ternary font-extrabold px-3 py-1 rounded-lg transition-all hover:bg-white'>Assinar Agora</button>
            <div className='my-5 w-[170px] h-2 border-b border-white'/>
            <div id='benfits_list' className='w-[180px] '>
                {benefitsList.map((benefit, index) => (
                    <div key={index} className='text-white flex items-center mb-1 text-[12px] lowercase'>
                        <span className=''>{benefit.trim()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlanPriceCard;
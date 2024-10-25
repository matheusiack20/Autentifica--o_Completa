'use client';   

import Image from 'next/image'; 
import im1 from "../public/Pagina_inicial.png"; 
import im2 from "../public/Foto1.png"; 
import im3 from "../public/Foto2.png"; 
import "./pagepublic.css"
export default function PublicPage (){
    return(
        <main>
            <div className="containerpublic">
                <h1 id="titlecon">Sobre o Produto</h1>
                <div className="dpage">
                    <Image src={im2} alt="Foto cria produto 1"/>
                    <Image id='fotopaginit' src={im1} alt="Foto da Pagina Inicial"/>
                    <Image src={im3} alt="Foto cria produto 2"/>
                </div>
                <h2 id='subtitle'>Transforme seu produto em uma estrela: títulos e descrições que vendem!</h2>
                <p id="textop">Apresentamos o AnuncIA, a solução inovadora que transforma a forma como você apresenta seus produtos.
                    Com nossa plataforma, basta inserir o título e a descrição do seu produto, e, utilizando a poderosa API do ChatGPT, 
                    geramos títulos e descrições irresistíveis que capturam a atenção do seu público-alvo. 
                    Aumente suas vendas e destaque-se da concorrência com AnuncIA – onde a criatividade se encontra com a eficácia!</p>

                <button id='saibamaispersona'>Saiba Mais</button>
            </div>
        </main>
    )
}
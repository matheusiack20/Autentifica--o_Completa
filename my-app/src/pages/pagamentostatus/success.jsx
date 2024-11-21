import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from "next/image";
import roboagradece from "../../../public/robozin.png";
import "./styles.css"

export default function SuccessPage() {
  const router = useRouter();
  const { plan } = router.query; // Obtém o nome do plano da URL
  const [showPopup, setShowPopup] = useState(true);

  const handleRedirect = () => {
    router.push('/'); // Redireciona para a página inicial
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      {showPopup && (
        <div className="popup bg-black text-white border-2 border-lime-500 rounded-lg p-8 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-lime-500 mb-6">
            Compra Realizada!
          </h2>
          <p className="text-lg mb-8">
            Sua compra foi concluída com sucesso. Obrigado por usar nossa
            plataforma!
          </p>
          <center>
          <Image src={roboagradece} alt="Robo agradecendo a compra" className='robozin'/>
          </center>
          {plan && (
            <p className="text-xl font-semibold mb-6">
              Você acabou de assinar o plano <span className="text-lime-500">{plan}</span>.
            </p>
          )}
          
          <button
            onClick={handleRedirect}
            className="bg-lime-500 text-black px-6 py-2 rounded font-semibold hover:bg-lime-400 transition"
          >
            Voltar à Página Principal
          </button>
        </div>
        
      )}
    </div>
  );
}

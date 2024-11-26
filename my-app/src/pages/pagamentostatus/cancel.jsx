import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from "next/image";
import robotriste from "../../../public/robôtriste.png";
import "./styles.css"

export default function Cancel() {
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
          Pagamento cancelado
          </h2>
          <p className="text-lg mb-8">
          Você pode tentar novamente quando quiser.
          </p>
          <center>
          <Image src={robotriste} alt="Robo triste" className='robozin'/>
          </center>
          
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

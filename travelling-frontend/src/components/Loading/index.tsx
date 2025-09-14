import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import treeLoadingAnimation from "../../assets/tree.json";

interface LoadingProps {}

export const Loading: React.FC<LoadingProps> = () => {
  const paragraphs = [
    "Buscando seus locais...",
    "Montando a sua viagem...",
    "Criando sua expirência...",
  ];

  const [currentParagraph, setCurrentParagraph] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Escolha um parágrafo aleatório
      const randomIndex = Math.floor(Math.random() * paragraphs.length);
      setCurrentParagraph(randomIndex);
    }, 1000); // Troque a cada segundo (1000ms)

    return () => {
      clearInterval(timer); // Limpar o temporizador quando o componente for desmontado
    };
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-auxiliary-beige fixed top-0 left-0 z-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <Lottie animationData={treeLoadingAnimation} />
        <h3 className="text-2xl text-primary-dark font-semibold">
          {paragraphs[currentParagraph]}
        </h3>
      </div>
    </div>
  );
};

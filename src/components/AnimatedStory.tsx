import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Star,
  Sparkles,
  Home,
  Scissors,
  Heart,
  Wind,
  CheckCircle2,
} from 'lucide-react';

export interface StoryScene {
  id: number;
  title: string;
  narration: string;
  image: string;
  soundDescription: string;
  feeling: string;
  tip: string;
  duration: number;
}

export const storyScenes: StoryScene[] = [
  {
    id: 1,
    title: "O Dia do Cabeleireiro",
    narration: "Hoje é um dia especial! Vou ao cabeleireiro cortar o cabelo. Vou vestir a minha roupa confortável e levar o meu brinquedo favorito.",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&h=600&fit=crop",
    soundDescription: "Silêncio em casa, preparação calma",
    feeling: "Calmo e preparado",
    tip: "Escolhe roupa que não aperte nem coce",
    duration: 8,
  },
  {
    id: 2,
    title: "A Viagem",
    narration: "Estamos a ir de carro! Olho pela janela e vejo árvores, casas e carros. Aperto a mão do meu pai/mãe se precisar.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop",
    soundDescription: "Som suave do carro, música calma",
    feeling: "Curioso e seguro",
    tip: "Música suave ajuda a relaxar",
    duration: 8,
  },
  {
    id: 3,
    title: "Chegar ao Salão",
    narration: "Chegámos! O salão tem luzes brilhantes e espelhos grandes. Respiro fundo 1... 2... 3... Estou bem!",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
    soundDescription: "Secadores ao longe, conversas suaves",
    feeling: "Um pouco nervoso mas seguro",
    tip: "Respirar fundo acalma o corpo",
    duration: 10,
  },
  {
    id: 4,
    title: "A Cadeira Mágica",
    narration: "A cadeira sobe e desce como um elevador! É divertido! Seguro nos braços da cadeira. Up! Down! Up! Down!",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop",
    soundDescription: "Som mecânico suave da cadeira",
    feeling: "Surpreso e divertido",
    tip: "Pede ajuda se tiveres medo de altura",
    duration: 10,
  },
  {
    id: 5,
    title: "A Capa de Super-Herói",
    narration: "O cabeleireiro põe-me uma capa! É como uma capa de super-herói. Protege a minha roupa. É macia e quentinha!",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&h=600&fit=crop",
    soundDescription: "Tecido a mexer, som suave",
    feeling: "Confortável e protegido",
    tip: "Diz se o tecido coçar ou incomodar",
    duration: 8,
  },
  {
    id: 6,
    title: "Lavar o Cabelo",
    narration: "Água morna na cabeça! O cabeleireiro é muito gentil. Fecho os olhos e imagino que estou na praia. Água fresca e relaxante!",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop",
    soundDescription: "Água a correr, som relaxante",
    feeling: "Relaxado e fresco",
    tip: "Pede uma toalha para a cara se precisares",
    duration: 10,
  },
  {
    id: 7,
    title: "Snip Snip!",
    narration: "O cabeleireiro corta o cabelo com tesouras especiais. Faz 'snip snip'! O som é curto e rápido. Não dói nada!",
    image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=600&fit=crop",
    soundDescription: "Tesoura a cortar: snip snip",
    feeling: "Corajoso e forte",
    tip: "Podes pedir uma pausa a qualquer momento!",
    duration: 10,
  },
  {
    id: 8,
    title: "O Secador",
    narration: "O secador sopra ar quente no cabelo. É como vento no verão! O som é um pouco alto, mas passa rápido. Quase acabámos!",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop",
    soundDescription: "Secador: som contínuo suave",
    feeling: "Quase lá! Estou orgulhoso!",
    tip: "Tapo os ouvidos se o som for muito alto",
    duration: 8,
  },
  {
    id: 9,
    title: "O Resultado!",
    narration: "Uau! Fiquei tão giro/a! Olho no espelho e dou um grande sorriso. Consegui! Sou um campeão/ã!",
    image: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&h=600&fit=crop",
    soundDescription: "Aplausos! Parabéns!",
    feeling: "Feliz, orgulhoso e confiante!",
    tip: "Pede aos teus pais para tirarem uma foto!",
    duration: 8,
  },
];

interface AnimatedStoryProps {
  onComplete: () => void;
  onExit: () => void;
}

export default function AnimatedStory({ onComplete, onExit }: AnimatedStoryProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [progress, setProgress] = useState(0);

  const scene = storyScenes[currentScene];
  const totalScenes = storyScenes.length;

  // Auto-progress
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          handleNext();
          return 0;
        }
        return p + (100 / (scene.duration * 10));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentScene, scene.duration]);

  const handleNext = useCallback(() => {
    setProgress(0);
    if (currentScene < totalScenes - 1) {
      setCurrentScene(c => c + 1);
    } else {
      setIsPlaying(false);
      onComplete();
    }
  }, [currentScene, totalScenes, onComplete]);

  const handlePrev = () => {
    setProgress(0);
    if (currentScene > 0) {
      setCurrentScene(c => c - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setAutoPlay(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header com controles */}
      <div className="glass border-b-2 border-sky-100 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={onExit}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 text-text-light hover:text-sky-500 font-comic font-bold"
          >
            <Home size={20} />
            <span className="hidden sm:inline">Sair</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <span className="font-comic font-bold text-sky-500">
              {currentScene + 1} / {totalScenes}
            </span>
            <div className="flex gap-1">
              {storyScenes.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === currentScene ? 'bg-sky-400' : 
                    i < currentScene ? 'bg-mint-400' : 'bg-sky-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={togglePlay}
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isPlaying ? 'bg-coral-100 text-coral-400' : 'bg-sky-100 text-sky-400'
              }`}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </motion.button>
          </div>
        </div>

        {/* Barra de progresso da cena */}
        <div className="max-w-4xl mx-auto mt-3">
          <div className="h-2 bg-sky-50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sky-400 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>

      {/* Cena Principal */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-kid-lg overflow-hidden border-4 border-sky-100"
            >
              {/* Imagem grande */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={scene.image}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Título sobreposto */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-comic font-bold text-2xl md:text-3xl text-white mb-2"
                  >
                    {scene.title}
                  </motion.h2>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-2"
                  >
                    <Heart size={16} className="text-mint-400" />
                    <span className="text-white/90 text-sm font-comic">{scene.feeling}</span>
                  </motion.div>
                </div>

                {/* Badge de som */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5"
                >
                  <Volume2 size={14} className="text-sky-400" />
                  <span className="text-xs font-comic font-bold text-text">{scene.soundDescription}</span>
                </motion.div>
              </div>

              {/* Narração */}
              <div className="p-6">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg md:text-xl text-text font-comic leading-relaxed mb-4"
                >
                  {scene.narration}
                </motion.p>

                {/* Dica */}
                <motion.button
                  onClick={() => setShowTip(!showTip)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 text-sky-400 hover:text-sky-500 font-comic font-bold text-sm mb-2"
                >
                  <Sparkles size={16} />
                  {showTip ? 'Esconder dica' : 'Ver dica especial'}
                </motion.button>

                <AnimatePresence>
                  {showTip && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-peach-50 rounded-2xl p-4 border-2 border-peach-100">
                        <p className="text-sm text-text font-comic">
                          <strong className="text-peach-500">💡 Dica:</strong> {scene.tip}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navegação */}
          <div className="flex items-center justify-between mt-6">
            <motion.button
              onClick={handlePrev}
              disabled={currentScene === 0}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl font-comic font-bold text-text shadow-kid disabled:opacity-40 hover:bg-sky-50 transition-colors border-2 border-sky-100"
            >
              <ChevronLeft size={20} />
              Anterior
            </motion.button>

            {/* Indicador de cenas */}
            <div className="hidden md:flex items-center gap-2">
              {storyScenes.map((s, i) => (
                <motion.button
                  key={s.id}
                  onClick={() => { setCurrentScene(i); setProgress(0); }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-comic font-bold text-sm transition-all ${
                    i === currentScene 
                      ? 'bg-sky-400 text-white shadow-kid' 
                      : i < currentScene 
                        ? 'bg-mint-100 text-mint-500' 
                        : 'bg-sky-50 text-sky-200'
                  }`}
                >
                  {i < currentScene ? <CheckCircle2 size={18} /> : i + 1}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={handleNext}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-sky-400 text-white rounded-2xl font-comic font-bold shadow-kid hover:bg-sky-500 transition-colors"
            >
              {currentScene === totalScenes - 1 ? 'Acabou!' : 'Próximo'}
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

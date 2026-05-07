import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Star,
  Sparkles,
  Home,
  Wind,
} from 'lucide-react';
import BreathingExercise from '../components/BreathingExercise';
import toast from 'react-hot-toast';

interface Scene {
  id: number;
  title: string;
  description: string;
  image: string;
  tip: string;
  duration: number;
  sensoryNote?: string;
}

// Social Story para crianças com PEA - linguagem simples, visual, previsível
const scenes: Scene[] = [
  {
    id: 1,
    title: '1. Preparar-me',
    description: 'Vou vestir roupa confortável. Posso levar o meu brinquedo favorito para me sentir seguro.',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop',
    tip: 'Escolhe roupa que não aperte nem coce.',
    duration: 30,
    sensoryNote: 'Roupa confortável = menos stress',
  },
  {
    id: 2,
    title: '2. A Caminho',
    description: 'Estamos a ir de carro ou a pé. Vou olhar pela janela e contar coisas que vejo.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop',
    tip: 'Se sentir ansiedade, aperto a mão do meu pai/mãe.',
    duration: 45,
    sensoryNote: 'Música suave pode ajudar no carro',
  },
  {
    id: 3,
    title: '3. Chegar ao Salão',
    description: 'O salão tem cheiros novos e sons diferentes. Vou respirar fundo 3 vezes.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop',
    tip: 'Posso tapar os ouvidos se o som for muito alto.',
    duration: 30,
    sensoryNote: 'Cheiros fortes podem incomodar',
  },
  {
    id: 4,
    title: '4. Sentar na Cadeira',
    description: 'A cadeira sobe e desce. É como um elevador! Vou segurar nos braços da cadeira.',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop',
    tip: 'Se tiver medo, peço ajuda ao cabeleireiro.',
    duration: 60,
    sensoryNote: 'Movimento da cadeira pode assustar',
  },
  {
    id: 5,
    title: '5. Vestir o Capote',
    description: 'O capote é como uma capa de super-herói. Protege a minha roupa. É macio!',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop',
    tip: 'Se o tecido coçar, digo ao cabeleireiro.',
    duration: 30,
    sensoryNote: 'Tecido do capote pode ser desconfortável',
  },
  {
    id: 6,
    title: '6. Cortar o Cabelo',
    description: 'O cabeleireiro usa tesouras que fazem "snip snip". O som é curto e rápido.',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop',
    tip: 'Posso pedir uma pausa a qualquer momento!',
    duration: 90,
    sensoryNote: 'Som da tesoura pode ser irritante',
  },
  {
    id: 7,
    title: '7. Ver o Resultado!',
    description: 'Uau! Fiquei tão giro/a! Olho no espelho e dou um grande sorriso. Consegui!',
    image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&h=400&fit=crop',
    tip: 'Peço aos meus pais para tirarem uma foto!',
    duration: 30,
    sensoryNote: 'Celebrar a conquista é importante!',
  },
];

export default function HomeModePage() {
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState(0);
  const [completedScenes, setCompletedScenes] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const scene = scenes[currentScene];
  const isCompleted = completedScenes.includes(scene.id);
  const progress = ((completedScenes.length) / scenes.length) * 100;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(t => {
          if (t >= scene.duration) {
            setIsPlaying(false);
            completeScene();
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, scene.duration]);

  const completeScene = () => {
    if (!completedScenes.includes(scene.id)) {
      setCompletedScenes([...completedScenes, scene.id]);
      toast.success(`Cena ${scene.id} completa!`, { icon: '⭐' });

      if (completedScenes.length + 1 === scenes.length) {
        setShowCelebration(true);
      }
    }
  };

  const handleNext = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
      setTimer(0);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
      setTimer(0);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isCompleted) {
      setTimer(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b-2 border-sky-100">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <motion.button
            onClick={() => navigate('/child')}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 text-text-light hover:text-sky-500 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-comic font-bold hidden sm:inline">Voltar</span>
          </motion.button>

          <div className="flex items-center gap-2">
            <Star size={20} className="text-peach-400 fill-peach-400" />
            <span className="font-comic font-bold text-lg">
              {completedScenes.length}/{scenes.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-3 max-w-4xl mx-auto">
          <div className="h-3 bg-sky-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 to-mint-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Scene View - Social Story Style */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="mb-6"
          >
            {/* Scene Image - Grande e central */}
            <div className="relative rounded-3xl overflow-hidden mb-4 shadow-kid-lg border-4 border-white">
              <div className="aspect-[4/3] relative">
                <img
                  src={scene.image}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Overlay info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-white/90 rounded-full text-sky-500 text-sm font-bold font-comic">
                      Passo {scene.id} de {scenes.length}
                    </span>
                    {isCompleted && (
                      <span className="px-3 py-1 bg-mint-400 rounded-full text-white text-sm font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        Feito!
                      </span>
                    )}
                  </div>
                  <h2 className="font-comic font-bold text-2xl md:text-3xl text-white">
                    {scene.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Description - Texto grande e claro */}
            <div className="bg-white rounded-3xl p-6 shadow-kid mb-4">
              <p className="text-lg text-text leading-relaxed font-comic">
                {scene.description}
              </p>

              {/* Sensory Note */}
              {scene.sensoryNote && (
                <div className="mt-4 p-4 bg-lavender-50 rounded-2xl border-2 border-lavender-100">
                  <div className="flex items-start gap-2">
                    <Volume2 size={18} className="text-lavender-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-lavender-600 font-comic">
                      <strong>Nota sensorial:</strong> {scene.sensoryNote}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Timer & Controls - Botões grandes */}
            <div className="bg-white rounded-3xl p-5 shadow-kid mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={togglePlay}
                    whileTap={{ scale: 0.9 }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-kid ${
                      isPlaying ? 'bg-coral-400' : 'bg-sky-400'
                    }`}
                  >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                  </motion.button>

                  <div>
                    <p className="font-comic font-bold text-2xl text-text">
                      {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                    </p>
                    <p className="text-sm text-text-light font-comic">
                      de {Math.floor(scene.duration / 60)}:{String(scene.duration % 60).padStart(2, '0')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => { setTimer(0); setIsPlaying(false); }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-400 hover:bg-sky-100"
                  >
                    <RotateCcw size={20} />
                  </motion.button>
                  <motion.button
                    onClick={() => setShowBreathing(true)}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-xl bg-mint-50 flex items-center justify-center text-mint-400 hover:bg-mint-100"
                  >
                    <Wind size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Timer bar */}
              <div className="h-3 bg-sky-50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-sky-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(timer / scene.duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Tip - Destaque visual */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-peach-50 border-2 border-peach-200 rounded-3xl p-5 mb-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-peach-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles size={20} className="text-peach-500" />
                </div>
                <p className="text-base font-comic text-text">{scene.tip}</p>
              </div>
            </motion.div>

            {/* Navigation - Botões grandes */}
            <div className="flex gap-3">
              <motion.button
                onClick={handlePrev}
                disabled={currentScene === 0}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-4 bg-sky-50 rounded-2xl font-comic font-bold text-lg text-text flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-sky-100 transition-colors border-2 border-sky-100"
              >
                <ChevronLeft size={20} />
                Anterior
              </motion.button>

              <motion.button
                onClick={handleNext}
                disabled={currentScene === scenes.length - 1}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-4 bg-sky-400 text-white rounded-2xl font-comic font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-sky-500 transition-colors shadow-kid"
              >
                Próximo
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* All Scenes - Grid visual */}
        <div className="mt-8">
          <h3 className="font-comic font-bold text-xl text-text mb-4">
            Todos os Passos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {scenes.map((s, i) => {
              const isCompleted = completedScenes.includes(s.id);
              const isLocked = i > 0 && !completedScenes.includes(scenes[i - 1].id);
              const isActive = currentScene === i;

              return (
                <motion.button
                  key={s.id}
                  onClick={() => {
                    if (!isLocked) {
                      setCurrentScene(i);
                      setTimer(0);
                      setIsPlaying(false);
                    }
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={!isLocked ? { scale: 0.95 } : {}}
                  className={`relative rounded-2xl overflow-hidden transition-all ${
                    isLocked 
                      ? 'opacity-40 cursor-not-allowed' 
                      : 'cursor-pointer'
                  } ${isActive ? 'ring-4 ring-sky-400 shadow-kid-lg' : 'shadow-kid'}`}
                >
                  <div className="aspect-square relative">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    <div className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center font-comic font-bold text-sm text-text">
                      {isCompleted ? <CheckCircle2 size={16} className="text-mint-400" /> : i + 1}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white font-comic font-bold text-xs text-center">{s.title}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Breathing Exercise Modal */}
      <BreathingExercise
        isOpen={showBreathing}
        onClose={() => setShowBreathing(false)}
        duration={60}
      />

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <motion.div
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-sky-400 to-mint-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-kid-lg"
              >
                <Sparkles size={40} className="text-white" />
              </motion.div>

              <h2 className="font-comic font-bold text-2xl text-text mb-2">
                Parabéns!
              </h2>
              <p className="text-text-light mb-6 font-comic">
                Completaste todos os passos! Estás pronto/a para ir ao cabeleireiro de verdade!
              </p>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowCelebration(false)}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-sky-50 rounded-2xl font-comic font-bold text-text border-2 border-sky-100"
                >
                  Continuar
                </motion.button>
                <motion.button
                  onClick={() => navigate('/child/salon-mode')}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-sky-400 text-white rounded-2xl font-comic font-bold shadow-kid"
                >
                  Modo Salão
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

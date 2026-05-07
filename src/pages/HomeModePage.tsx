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
  Sparkles
} from 'lucide-react';
import SceneCard from '../components/SceneCard';
import ProgressBar from '../components/ProgressBar';
import BreathingExercise from '../components/BreathingExercise';
import toast from 'react-hot-toast';

interface Scene {
  id: number;
  title: string;
  description: string;
  image: string;
  tip: string;
  duration: number;
}

const scenes: Scene[] = [
  {
    id: 1,
    title: 'Preparação',
    description: 'Vamos preparar-nos para ir ao cabeleireiro! Escolhe a roupa confortável e os teus brinquedos favoritos.',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop',
    tip: '💡 Leva um brinquedo que te faça sentir seguro',
    duration: 30,
  },
  {
    id: 2,
    title: 'A Caminho',
    description: 'Estamos a caminho do cabeleireiro! Olha pela janela e conta quantos carros vermelhos consegues ver.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop',
    tip: '💡 Respira fundo 3 vezes se começares a sentir nervoso',
    duration: 45,
  },
  {
    id: 3,
    title: 'Chegada ao Salão',
    description: 'Chegámos! Olha à volta, vê as cadeiras giras e as pessoas a cortar o cabelo. Não tens nada que temer!',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop',
    tip: '💡 Diz olá ao cabeleireiro com um sorriso',
    duration: 30,
  },
  {
    id: 4,
    title: 'Sentar na Cadeira',
    description: 'A cadeira é especial! Ela sobe e desce como um elevador. É divertido! Vamos experimentar?',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop',
    tip: '💡 Pede ajuda se precisares de subir à cadeira',
    duration: 60,
  },
  {
    id: 5,
    title: 'O Capote',
    description: 'O capote é como uma capa de super-herói! Ele protege a tua roupa. Vamos vesti-lo juntos?',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop',
    tip: '💡 O capote é macio e quentinho',
    duration: 30,
  },
  {
    id: 6,
    title: 'Cortar o Cabelo',
    description: 'O cabeleireiro vai cortar o cabelo com tesouras especiais. Faz um som "snip snip"!',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop',
    tip: '💡 Podes pedir uma pausa a qualquer momento',
    duration: 90,
  },
  {
    id: 7,
    title: 'O Resultado Final',
    description: 'Uau! Ficas tão giro/a! Olha para o espelho e dá um grande sorriso. Conseguiste! 🎉',
    image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&h=400&fit=crop',
    tip: '💡 Pede para tirar uma foto para mostrar aos teus amigos',
    duration: 30,
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
      toast.success(`Cena ${scene.id} completada! ⭐`, {
        icon: '🎉',
      });

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
      <div className="sticky top-0 z-30 glass border-b border-gray-100">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <motion.button
            onClick={() => navigate('/child')}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 text-text-light hover:text-text transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold text-sm hidden sm:inline">Voltar</span>
          </motion.button>

          <div className="flex items-center gap-2">
            <Star size={16} className="text-yellow-500" />
            <span className="font-bold text-sm">
              {completedScenes.length}/{scenes.length}
            </span>
          </div>
        </div>

        <div className="px-4 pb-3 max-w-4xl mx-auto">
          <ProgressBar progress={progress} color="bg-primary" height={8} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Scene View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="mb-6"
          >
            {/* Scene Image */}
            <div className="relative rounded-2xl overflow-hidden mb-4 shadow-xl">
              <div className="aspect-video relative">
                <img
                  src={scene.image}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Scene Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                      Cena {scene.id} de {scenes.length}
                    </span>
                    {isCompleted && (
                      <span className="px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full text-white text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Completo
                      </span>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
                    {scene.title}
                  </h2>
                  <p className="text-white/90 text-sm md:text-base max-w-xl">
                    {scene.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Timer & Controls */}
            <div className="bg-white rounded-2xl p-5 shadow-lg mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={togglePlay}
                    whileTap={{ scale: 0.9 }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg ${
                      isPlaying ? 'bg-red-500' : 'bg-primary'
                    }`}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </motion.button>

                  <div>
                    <p className="font-bold text-text text-lg">
                      {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                    </p>
                    <p className="text-xs text-text-light">
                      de {Math.floor(scene.duration / 60)}:{String(scene.duration % 60).padStart(2, '0')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => { setTimer(0); setIsPlaying(false); }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-text-light hover:bg-gray-200"
                  >
                    <RotateCcw size={18} />
                  </motion.button>
                  <motion.button
                    onClick={() => setShowBreathing(true)}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary/20"
                  >
                    <Volume2 size={18} />
                  </motion.button>
                </div>
              </div>

              <ProgressBar 
                progress={(timer / scene.duration) * 100} 
                color="bg-primary" 
                height={6}
                showPercentage={false}
              />
            </div>

            {/* Tip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/10 border border-accent/20 rounded-2xl p-4 mb-4"
            >
              <p className="text-sm font-semibold text-text">{scene.tip}</p>
            </motion.div>

            {/* Navigation */}
            <div className="flex gap-3">
              <motion.button
                onClick={handlePrev}
                disabled={currentScene === 0}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-text flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={18} />
                Anterior
              </motion.button>

              <motion.button
                onClick={handleNext}
                disabled={currentScene === scenes.length - 1}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-primary-dark transition-colors"
              >
                Próxima
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* All Scenes Grid */}
        <div className="mt-8">
          <h3 className="font-display font-bold text-xl text-text mb-4">
            Todas as Cenas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {scenes.map((s, i) => (
              <SceneCard
                key={s.id}
                title={s.title}
                description={s.description}
                image={s.image}
                isCompleted={completedScenes.includes(s.id)}
                isLocked={i > 0 && !completedScenes.includes(scenes[i - 1].id)}
                isActive={currentScene === i}
                onClick={() => {
                  if (i === 0 || completedScenes.includes(scenes[i - 1].id)) {
                    setCurrentScene(i);
                    setTimer(0);
                    setIsPlaying(false);
                  }
                }}
                index={i}
              />
            ))}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
              >
                <Sparkles size={40} className="text-white" />
              </motion.div>

              <h2 className="font-display font-bold text-2xl text-text mb-2">
                Parabéns! 🎉
              </h2>
              <p className="text-text-light mb-6">
                Completaste todas as cenas do Modo Casa! Estás pronto/a para ir ao cabeleireiro de verdade!
              </p>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowCelebration(false)}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-text"
                >
                  Continuar
                </motion.button>
                <motion.button
                  onClick={() => navigate('/child/salon-mode')}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold"
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

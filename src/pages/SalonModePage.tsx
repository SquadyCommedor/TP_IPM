import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Square,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Award,
  Clock,
  TrendingUp,
  Save,
  Wind,
  Star,
  Volume2,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useBitalino } from '../hooks/useBitalino';
import { useTimer } from '../hooks/useTimer';
import BreathingExercise from '../components/BreathingExercise';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface SalonStep {
  id: number;
  title: string;
  description: string;
  duration: number;
  sensoryNote: string;
  copingStrategy: string;
}

const salonSteps: SalonStep[] = [
  { 
    id: 1, 
    title: 'Entrar no Salão', 
    description: 'Cheguei ao salão! Vou olhar à volta e encontrar um lugar calmo.',
    duration: 300,
    sensoryNote: 'Cheiros novos e sons diferentes',
    copingStrategy: 'Respiro fundo 3 vezes',
  },
  { 
    id: 2, 
    title: 'Sentar na Cadeira', 
    description: 'A cadeira sobe e desce. Vou segurar nos braços da cadeira.',
    duration: 180,
    sensoryNote: 'Movimento da cadeira pode assustar',
    copingStrategy: 'Peço ajuda se precisar',
  },
  { 
    id: 3, 
    title: 'Vestir o Capote', 
    description: 'O capote protege a minha roupa. É como uma capa de herói!',
    duration: 120,
    sensoryNote: 'Tecido pode ser desconfortável',
    copingStrategy: 'Digo se o tecido coçar',
  },
  { 
    id: 4, 
    title: 'Lavar o Cabelo', 
    description: 'Água morna na cabeça. O cabeleireiro é gentil.',
    duration: 300,
    sensoryNote: 'Água na cara pode incomodar',
    copingStrategy: 'Peço uma toalha para a cara',
  },
  { 
    id: 5, 
    title: 'Cortar o Cabelo', 
    description: 'Tesouras fazem "snip snip". O som acaba rápido.',
    duration: 600,
    sensoryNote: 'Som da tesoura pode irritar',
    copingStrategy: 'Posso pedir uma pausa!',
  },
  { 
    id: 6, 
    title: 'Secar o Cabelo', 
    description: 'O secador faz ar quente. É como vento no verão.',
    duration: 300,
    sensoryNote: 'Som do secador é alto',
    copingStrategy: 'Tapo os ouvidos ou peço pausa',
  },
  { 
    id: 7, 
    title: 'Ver no Espelho!', 
    description: 'Uau! Fiquei tão giro/a! Sorrio para mim mesmo/a!',
    duration: 180,
    sensoryNote: 'Celebrar a conquista!',
    copingStrategy: 'Peço foto para mostrar!',
  },
];

export default function SalonModePage() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { seconds, isRunning, start, pause, stop, reset } = useTimer();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showBreathing, setShowBreathing] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [stressReadings, setStressReadings] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [pausesCount, setPausesCount] = useState(0);
  const [notes, setNotes] = useState('');

  const { reading, isConnected, connect, disconnect } = useBitalino(profile?.id);

  const step = salonSteps[currentStep];
  const progress = ((completedSteps.length) / salonSteps.length) * 100;

  useEffect(() => {
    if (reading) {
      setStressReadings(prev => [...prev, reading.stressIndex]);
    }
  }, [reading]);

  const handleHighStress = () => {
    if (isRunning && !showBreathing) {
      pause();
      setShowBreathing(true);
      setPausesCount(c => c + 1);
      toast('O teu corpo pede uma pausa. Vamos respirar?', {
        icon: '🫁',
        duration: 4000,
      });
    }
  };

  const startSession = () => {
    setIsSessionActive(true);
    start();
    connect();
    toast.success('Vamos começar! Estou contigo! 💙');
  };

  const endSession = async () => {
    stop();
    disconnect();
    setIsSessionActive(false);

    if (stressReadings.length > 0) {
      const maxStress = Math.max(...stressReadings);
      const avgStress = Math.round(stressReadings.reduce((a, b) => a + b, 0) / stressReadings.length);

      try {
        await supabase.from('visit_logs').insert({
          child_id: user?.id,
          date: new Date().toISOString(),
          duration: seconds,
          max_stress: maxStress,
          avg_stress: avgStress,
          pauses: pausesCount,
          completed: completedSteps.length === salonSteps.length,
          notes: notes || undefined,
        });
        toast.success('Visita guardada!');
      } catch (e) {
        console.error('Erro:', e);
      }
    }

    setShowSummary(true);
  };

  const completeStep = () => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
      toast.success(`${step.title} completo!`, { icon: '✅' });
    }
    if (currentStep < salonSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endSession();
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const maxStress = stressReadings.length > 0 ? Math.max(...stressReadings) : 0;
  const avgStress = stressReadings.length > 0 
    ? Math.round(stressReadings.reduce((a, b) => a + b, 0) / stressReadings.length) 
    : 0;

  const getStressColor = (level: number) => {
    if (level < 30) return { bg: 'bg-mint-400', text: 'text-mint-500', label: 'Muito Calmo' };
    if (level < 50) return { bg: 'bg-sky-400', text: 'text-sky-500', label: 'Calmo' };
    if (level < 70) return { bg: 'bg-peach-400', text: 'text-peach-500', label: 'Ansioso' };
    return { bg: 'bg-coral-400', text: 'text-coral-500', label: 'Muito Ansioso' };
  };

  const stressInfo = getStressColor(reading?.stressIndex ?? 0);

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b-2 border-sky-100">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <motion.button
            onClick={() => navigate('/child')}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 text-text-light hover:text-sky-500"
          >
            <ArrowLeft size={24} />
            <span className="font-comic font-bold hidden sm:inline">Voltar</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-sky-50 rounded-xl px-3 py-2 border-2 border-sky-100">
              <Clock size={18} className="text-sky-400" />
              <span className="font-mono font-bold text-lg">{formatTime(seconds)}</span>
            </div>

            {isSessionActive ? (
              <motion.button
                onClick={endSession}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 bg-coral-400 text-white font-comic font-bold rounded-xl flex items-center gap-1.5 shadow-kid"
              >
                <Square size={16} />
                Terminar
              </motion.button>
            ) : (
              <motion.button
                onClick={startSession}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 bg-mint-400 text-white font-comic font-bold rounded-xl flex items-center gap-1.5 shadow-kid"
              >
                <Play size={16} />
                Começar
              </motion.button>
            )}
          </div>
        </div>

        <div className="px-4 pb-3 max-w-4xl mx-auto">
          <div className="h-3 bg-sky-50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 to-lavender-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Stress Monitor - Visual calmante */}
        {isSessionActive && (
          <div className="bg-white rounded-3xl p-6 shadow-kid border-2 border-sky-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${stressInfo.bg} flex items-center justify-center shadow-sm`}>
                  <Heart size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-comic font-bold text-lg text-text">Como me sinto</h3>
                  <p className="text-xs text-text-light font-comic">A minha pulseira diz...</p>
                </div>
              </div>

              {!isConnected ? (
                <motion.button
                  onClick={connect}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-sky-400 text-white font-comic font-bold rounded-xl shadow-kid"
                >
                  Ligar Pulseira
                </motion.button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-3 h-3 bg-mint-400 rounded-full"
                  />
                  <span className="text-xs text-mint-500 font-comic font-bold">Ligada</span>
                </div>
              )}
            </div>

            {reading && (
              <div className="space-y-4">
                <div className="text-center">
                  <span className={`text-4xl font-comic font-black ${stressInfo.text}`}>
                    {reading.stressIndex}%
                  </span>
                  <p className={`text-sm font-comic font-bold ${stressInfo.text}`}>
                    {stressInfo.label}
                  </p>
                </div>

                <div className="h-4 bg-sky-50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${stressInfo.bg}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${reading.stressIndex}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-sky-50 rounded-2xl p-3 flex items-center gap-3">
                    <Heart size={18} className="text-coral-400" />
                    <div>
                      <p className="text-xs text-text-light font-comic">Coração</p>
                      <p className="font-comic font-bold text-text">{reading.heartRate} bpm</p>
                    </div>
                  </div>
                  <div className="bg-sky-50 rounded-2xl p-3 flex items-center gap-3">
                    <Volume2 size={18} className="text-lavender-400" />
                    <div>
                      <p className="text-xs text-text-light font-comic">Suar</p>
                      <p className="font-comic font-bold text-text">{reading.eda.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-6 shadow-kid border-2 border-sky-50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl ${
                  completedSteps.includes(step.id) ? 'bg-mint-100' : 'bg-sky-100'
                } flex items-center justify-center`}>
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle2 size={28} className="text-mint-400" />
                  ) : (
                    <span className="font-comic font-bold text-xl text-sky-400">{step.id}</span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-comic font-bold text-sky-400 bg-sky-50 px-2 py-1 rounded-full">
                    Passo {step.id}
                  </span>
                  <h2 className="font-comic font-bold text-xl text-text mt-1">
                    {step.title}
                  </h2>
                </div>
              </div>
            </div>

            <p className="text-lg text-text font-comic mb-4">{step.description}</p>

            {/* Sensory Note & Coping Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-peach-50 rounded-2xl p-4 border-2 border-peach-100">
                <div className="flex items-start gap-2">
                  <Volume2 size={16} className="text-peach-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-comic font-bold text-peach-500 mb-1">Posso sentir:</p>
                    <p className="text-sm text-text font-comic">{step.sensoryNote}</p>
                  </div>
                </div>
              </div>
              <div className="bg-mint-50 rounded-2xl p-4 border-2 border-mint-100">
                <div className="flex items-start gap-2">
                  <Wind size={16} className="text-mint-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-comic font-bold text-mint-500 mb-1">Se precisar:</p>
                    <p className="text-sm text-text font-comic">{step.copingStrategy}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={completeStep}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-4 bg-mint-400 text-white rounded-2xl font-comic font-bold text-lg flex items-center justify-center gap-2 shadow-kid hover:bg-mint-500 transition-colors"
              >
                <CheckCircle2 size={22} />
                {currentStep === salonSteps.length - 1 ? 'Acabei!' : 'Próximo Passo'}
              </motion.button>

              {isRunning && (
                <motion.button
                  onClick={() => { pause(); setShowBreathing(true); setPausesCount(c => c + 1); }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-4 bg-sky-50 rounded-2xl font-comic font-bold text-sky-400 flex items-center gap-2 border-2 border-sky-100"
                >
                  <Pause size={22} />
                  <span className="hidden sm:inline">Pausa</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Steps Timeline */}
        <div className="bg-white rounded-3xl p-5 shadow-kid border-2 border-sky-50">
          <h3 className="font-comic font-bold text-lg text-text mb-4">Os Meus Passos</h3>
          <div className="space-y-2">
            {salonSteps.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                  currentStep === i 
                    ? 'bg-sky-50 ring-2 ring-sky-200' 
                    : completedSteps.includes(s.id)
                    ? 'bg-mint-50'
                    : 'hover:bg-gray-50'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-comic font-bold ${
                  completedSteps.includes(s.id)
                    ? 'bg-mint-400 text-white'
                    : currentStep === i
                    ? 'bg-sky-400 text-white'
                    : 'bg-sky-50 text-text-light'
                }`}>
                  {completedSteps.includes(s.id) ? <CheckCircle2 size={18} /> : s.id}
                </div>
                <div className="flex-1">
                  <p className={`font-comic font-bold ${
                    completedSteps.includes(s.id) ? 'text-mint-600' : 'text-text'
                  }`}>
                    {s.title}
                  </p>
                </div>
                {currentStep === i && !completedSteps.includes(s.id) && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2.5 h-2.5 bg-sky-400 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notes */}
        {isSessionActive && (
          <div className="bg-white rounded-3xl p-5 shadow-kid border-2 border-sky-50">
            <h3 className="font-comic font-bold text-lg text-text mb-3 flex items-center gap-2">
              <Save size={18} className="text-sky-400" />
              Como me senti
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escreve como te sentiste..."
              className="w-full p-4 bg-sky-50 rounded-2xl border-2 border-transparent focus:border-sky-200 outline-none resize-none text-base font-comic min-h-[100px]"
            />
          </div>
        )}
      </div>

      {/* Breathing Exercise Modal */}
      <BreathingExercise
        isOpen={showBreathing}
        onClose={() => {
          setShowBreathing(false);
          if (isSessionActive) start();
        }}
        duration={60}
      />

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border-4 border-sky-100"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-sky-400 to-mint-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-kid-lg"
              >
                <Award size={48} className="text-white" />
              </motion.div>

              <h2 className="font-comic font-bold text-2xl text-text mb-2">
                Consegui!
              </h2>
              <p className="text-text-light mb-6 font-comic">
                {completedSteps.length === salonSteps.length 
                  ? 'Fiz tudo! Sou um campeão/ã!' 
                  : 'Bom trabalho! Na próxima faço mais!'}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-sky-50 rounded-2xl p-4 text-center">
                  <Clock size={24} className="mx-auto mb-2 text-sky-400" />
                  <p className="font-comic font-black text-xl text-text">{formatTime(seconds)}</p>
                  <p className="text-xs text-text-light font-comic">Tempo</p>
                </div>
                <div className="bg-mint-50 rounded-2xl p-4 text-center">
                  <TrendingUp size={24} className="mx-auto mb-2 text-mint-400" />
                  <p className="font-comic font-black text-xl text-text">{avgStress}%</p>
                  <p className="text-xs text-text-light font-comic">Stress Médio</p>
                </div>
                <div className="bg-peach-50 rounded-2xl p-4 text-center">
                  <AlertTriangle size={24} className="mx-auto mb-2 text-peach-400" />
                  <p className="font-comic font-black text-xl text-text">{maxStress}%</p>
                  <p className="text-xs text-text-light font-comic">Stress Máx</p>
                </div>
                <div className="bg-lavender-50 rounded-2xl p-4 text-center">
                  <Pause size={24} className="mx-auto mb-2 text-lavender-400" />
                  <p className="font-comic font-black text-xl text-text">{pausesCount}</p>
                  <p className="text-xs text-text-light font-comic">Pausas</p>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => {
                    setShowSummary(false);
                    reset();
                    setCompletedSteps([]);
                    setCurrentStep(0);
                    setStressReadings([]);
                    setPausesCount(0);
                    setNotes('');
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-sky-50 rounded-2xl font-comic font-bold text-text border-2 border-sky-100"
                >
                  Nova Sessão
                </motion.button>
                <motion.button
                  onClick={() => navigate('/child')}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-sky-400 text-white rounded-2xl font-comic font-bold shadow-kid"
                >
                  Início
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

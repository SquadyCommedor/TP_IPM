import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Square,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Award,
  Clock,
  TrendingUp,
  Save,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useBitalino } from '../hooks/useBitalino';
import { useTimer } from '../hooks/useTimer';
import StressMonitor from '../components/StressMonitor';
import BreathingExercise from '../components/BreathingExercise';
import ProgressBar from '../components/ProgressBar';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface SalonStep {
  id: number;
  title: string;
  description: string;
  icon: typeof Heart;
  duration: number;
}

const salonSteps: SalonStep[] = [
  { id: 1, title: 'Entrada', description: 'Chegada e acolhimento no salão', icon: Heart, duration: 300 },
  { id: 2, title: 'Sentar', description: 'Subir à cadeira do cabeleireiro', icon: Heart, duration: 180 },
  { id: 3, title: 'Capote', description: 'Vestir o capote protetor', icon: Heart, duration: 120 },
  { id: 4, title: 'Lavar', description: 'Lavar o cabelo com água morna', icon: Heart, duration: 300 },
  { id: 5, title: 'Cortar', description: 'Cortar o cabelo com tesoura', icon: Heart, duration: 600 },
  { id: 6, title: 'Secar', description: 'Secar o cabelo com o secador', icon: Heart, duration: 300 },
  { id: 7, title: 'Resultado', description: 'Ver o resultado no espelho', icon: Heart, duration: 180 },
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
      toast('Stress alto detetado! Vamos respirar juntos?', {
        icon: '⚠️',
        duration: 4000,
      });
    }
  };

  const startSession = () => {
    setIsSessionActive(true);
    start();
    connect();
    toast.success('Sessão iniciada! Boa sorte!');
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
        toast.success('Visita guardada com sucesso!');
      } catch (e) {
        console.error('Erro ao guardar log:', e);
      }
    }

    setShowSummary(true);
  };

  const completeStep = () => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
      toast.success(`${step.title} completado!`);
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

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-gray-100">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <motion.button
            onClick={() => navigate('/child')}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 text-text-light hover:text-text"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold text-sm hidden sm:inline">Voltar</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl px-3 py-1.5">
              <Clock size={16} className="text-text-light" />
              <span className="font-mono font-bold text-sm">{formatTime(seconds)}</span>
            </div>

            {isSessionActive ? (
              <motion.button
                onClick={endSession}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-1.5 bg-red-500 text-white text-sm font-bold rounded-xl flex items-center gap-1.5"
              >
                <Square size={14} />
                Terminar
              </motion.button>
            ) : (
              <motion.button
                onClick={startSession}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-1.5 bg-primary text-white text-sm font-bold rounded-xl flex items-center gap-1.5"
              >
                <Play size={14} />
                Iniciar
              </motion.button>
            )}
          </div>
        </div>

        <div className="px-4 pb-3 max-w-4xl mx-auto">
          <ProgressBar progress={progress} color="bg-purple" height={8} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Stress Monitor */}
        {isSessionActive && (
          <StressMonitor
            childId={profile?.id || ''}
            onHighStress={handleHighStress}
            threshold={70}
          />
        )}

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${
                  completedSteps.includes(step.id) 
                    ? 'bg-green-100' 
                    : 'bg-purple/10'
                } flex items-center justify-center`}>
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle2 size={24} className="text-green-500" />
                  ) : (
                    <step.icon size={24} className="text-purple" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple bg-purple/10 px-2 py-0.5 rounded-full">
                      Passo {step.id}
                    </span>
                    {completedSteps.includes(step.id) && (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        Completo
                      </span>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-xl text-text mt-1">
                    {step.title}
                  </h2>
                </div>
              </div>

              <span className="text-sm text-text-light font-medium">
                {Math.floor(step.duration / 60)} min
              </span>
            </div>

            <p className="text-text-light mb-4">{step.description}</p>

            <div className="flex gap-3">
              <motion.button
                onClick={completeStep}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-3 bg-purple text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <CheckCircle2 size={18} />
                {currentStep === salonSteps.length - 1 ? 'Finalizar' : 'Completar Passo'}
              </motion.button>

              {isRunning && (
                <motion.button
                  onClick={pause}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 bg-gray-100 rounded-xl font-bold text-text flex items-center gap-2"
                >
                  <Pause size={18} />
                  <span className="hidden sm:inline">Pausa</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Steps Timeline */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="font-display font-bold text-lg text-text mb-4">Progresso da Visita</h3>
          <div className="space-y-3">
            {salonSteps.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  currentStep === i 
                    ? 'bg-purple/10 ring-2 ring-purple/30' 
                    : completedSteps.includes(s.id)
                    ? 'bg-green-50'
                    : 'hover:bg-gray-50'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  completedSteps.includes(s.id)
                    ? 'bg-green-500 text-white'
                    : currentStep === i
                    ? 'bg-purple text-white'
                    : 'bg-gray-100 text-text-light'
                }`}>
                  {completedSteps.includes(s.id) ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    s.id
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${
                    completedSteps.includes(s.id) ? 'text-green-700' : 'text-text'
                  }`}>
                    {s.title}
                  </p>
                  <p className="text-xs text-text-light">{s.description}</p>
                </div>
                {currentStep === i && !completedSteps.includes(s.id) && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 bg-purple rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notes */}
        {isSessionActive && (
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="font-display font-bold text-lg text-text mb-3 flex items-center gap-2">
              <Save size={18} className="text-text-light" />
              Notas da Visita
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como te sentiste? O que gostaste mais?..."
              className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-purple outline-none resize-none text-sm min-h-[100px]"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 bg-gradient-to-br from-purple to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
                >
                  <Award size={40} className="text-white" />
                </motion.div>
                <h2 className="font-display font-bold text-2xl text-text">
                  Visita Completa!
                </h2>
                <p className="text-text-light mt-1">
                  {completedSteps.length === salonSteps.length 
                    ? 'Conseguiste fazer tudo! És um campeão!' 
                    : 'Bom trabalho! Na próxima vais conseguir mais!'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Clock size={20} className="mx-auto mb-2 text-primary" />
                  <p className="font-black text-xl text-text">{formatTime(seconds)}</p>
                  <p className="text-xs text-text-light">Duração</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <TrendingUp size={20} className="mx-auto mb-2 text-secondary" />
                  <p className="font-black text-xl text-text">{avgStress}%</p>
                  <p className="text-xs text-text-light">Stress Médio</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <AlertTriangle size={20} className="mx-auto mb-2 text-orange-500" />
                  <p className="font-black text-xl text-text">{maxStress}%</p>
                  <p className="text-xs text-text-light">Stress Máx</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Pause size={20} className="mx-auto mb-2 text-purple" />
                  <p className="font-black text-xl text-text">{pausesCount}</p>
                  <p className="text-xs text-text-light">Pausas</p>
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
                  className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-text"
                >
                  Nova Sessão
                </motion.button>
                <motion.button
                  onClick={() => navigate('/child')}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold"
                >
                  Dashboard
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

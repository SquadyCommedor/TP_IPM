import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, LogOut, Heart, Activity, Calendar, TrendingUp,
  User, Baby, ChevronDown, ChevronUp, Clock, AlertTriangle,
  BarChart3, Download, FileText
} from 'lucide-react';
import { useStore } from '../store';
import { ProgressBar } from '../components/ProgressBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const visitLogs = useStore((s) => s.visitLogs);
  const bitalinoHistory = useStore((s) => s.bitalinoHistory);

  const [selectedVisit, setSelectedVisit] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'visits' | 'stress'>('overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data for demo if no real data
  const demoVisits = visitLogs.length > 0 ? visitLogs : [
    {
      id: '1', date: new Date(Date.now() - 86400000 * 7).toISOString(),
      duration: 1800, maxStress: 85, avgStress: 45, pauses: 3, completed: true, notes: 'Primeira visita'
    },
    {
      id: '2', date: new Date(Date.now() - 86400000 * 3).toISOString(),
      duration: 1500, maxStress: 60, avgStress: 35, pauses: 1, completed: true, notes: 'Melhorou muito'
    },
  ];

  const demoStressData = bitalinoHistory.length > 0 
    ? bitalinoHistory.slice(-20).map((r, i) => ({
        time: i,
        stress: Math.round(r.stressIndex),
        heartRate: r.heartRate,
      }))
    : Array.from({ length: 20 }, (_, i) => ({
        time: i,
        stress: 30 + Math.sin(i * 0.5) * 20 + Math.random() * 10,
        heartRate: 75 + Math.sin(i * 0.3) * 15 + Math.random() * 5,
      }));

  const avgDuration = demoVisits.reduce((acc, v) => acc + v.duration, 0) / demoVisits.length;
  const avgPauses = demoVisits.reduce((acc, v) => acc + v.pauses, 0) / demoVisits.length;
  const completionRate = (demoVisits.filter(v => v.completed).length / demoVisits.length) * 100;

  return (
    <div className="min-h-screen bg-parent-bg">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-sm">Área dos Pais</h1>
              <p className="text-xs text-gray-500">{user?.name}</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-xl p-1 border border-gray-200">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'visits', label: 'Visitas', icon: Calendar },
            { id: 'stress', label: 'Stress', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <Calendar className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{demoVisits.length}</p>
                  <p className="text-xs text-gray-500">Total Visitas</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <Clock className="w-5 h-5 text-secondary mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{Math.floor(avgDuration / 60)}m</p>
                  <p className="text-xs text-gray-500">Duração Média</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <AlertTriangle className="w-5 h-5 text-danger mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{avgPauses.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">Pausas Média</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <TrendingUp className="w-5 h-5 text-accent mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{Math.round(completionRate)}%</p>
                  <p className="text-xs text-gray-500">Taxa Sucesso</p>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-4">Evolução do Stress nas Visitas</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={demoVisits.map((v, i) => ({
                      visita: `V${i + 1}`,
                      maxStress: v.maxStress,
                      pauses: v.pauses * 20,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="visita" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="maxStress" stroke="#EF4444" strokeWidth={2} name="Stress Máx." />
                      <Line type="monotone" dataKey="pauses" stroke="#F59E0B" strokeWidth={2} name="Pausas (x20)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Child Profile Summary */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Baby className="w-4 h-4 text-primary" />
                  Perfil da Criança
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Alcunha</p>
                    <p className="font-medium text-gray-800">{user?.childProfile?.nickname || 'Não definido'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Idade</p>
                    <p className="font-medium text-gray-800">{user?.childProfile?.age || '-'} anos</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estrelas Acumuladas</p>
                    <p className="font-medium text-gray-800">{user?.childProfile?.stars || 0} ⭐</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Diploma</p>
                    <p className="font-medium text-gray-800">{user?.childProfile?.diplomaEarned ? '✅ Conquistado' : '🔒 Por conquistar'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Visits Tab */}
          {activeTab === 'visits' && (
            <motion.div
              key="visits"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {demoVisits.map((visit, index) => (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedVisit(selectedVisit === visit.id ? null : visit.id)}
                    className="w-full p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        visit.completed ? 'bg-accent/10' : 'bg-danger/10'
                      }`}>
                        {visit.completed ? (
                          <TrendingUp className="w-5 h-5 text-accent" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-danger" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-800 text-sm">
                          Visita #{demoVisits.length - index}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(visit.date).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-500">
                        {Math.floor(visit.duration / 60)}m {visit.duration % 60}s
                      </span>
                      {selectedVisit === visit.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {selectedVisit === visit.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                      >
                        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Stress Máx.</p>
                            <p className="text-lg font-bold text-danger">{visit.maxStress}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Stress Méd.</p>
                            <p className="text-lg font-bold text-secondary">{visit.avgStress}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Pausas</p>
                            <p className="text-lg font-bold text-primary">{visit.pauses}</p>
                          </div>
                        </div>
                        {visit.notes && (
                          <p className="text-xs text-gray-500 mt-3 bg-gray-50 p-2 rounded-lg">
                            📝 {visit.notes}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Stress Tab */}
          {activeTab === 'stress' && (
            <motion.div
              key="stress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-4">Monitorização em Tempo Real</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={demoStressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={[0, 150]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="stress" stroke="#EF4444" strokeWidth={2} name="Stress %" dot={false} />
                      <Line type="monotone" dataKey="heartRate" stroke="#4F46E5" strokeWidth={2} name="FC (bpm)" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-danger" />
                    <span className="text-xs text-gray-600">Stress (%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-xs text-gray-600">Frequência Cardíaca (bpm)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-3">Distribuição de Stress</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { range: '0-25%', count: demoStressData.filter(d => d.stress < 25).length, label: 'Calmo' },
                      { range: '25-50%', count: demoStressData.filter(d => d.stress >= 25 && d.stress < 50).length, label: 'Normal' },
                      { range: '50-75%', count: demoStressData.filter(d => d.stress >= 50 && d.stress < 75).length, label: 'Elevado' },
                      { range: '75-100%', count: demoStressData.filter(d => d.stress >= 75).length, label: 'Crítico' },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

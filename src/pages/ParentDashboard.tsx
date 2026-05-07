import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, Calendar, TrendingUp, User, Clock, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';
import { ProgressBar } from '../components/ProgressBar';
import type { VisitLog } from '../types';

interface ChildStats {
  totalVisits: number;
  avgStress: number;
  maxStress: number;
  totalPauses: number;
  completedScenes: number;
  stars: number;
  diplomaEarned: boolean;
}

export default function ParentDashboard() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);
  const [childStats, setChildStats] = useState<ChildStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Find children linked to this parent
        const { data: children, error: childrenError } = await supabase
          .from('profiles')
          .select('id, name, child_profile')
          .eq('parent_email', user.email)
          .eq('role', 'child');

        if (childrenError) throw childrenError;

        if (children && children.length > 0) {
          const child = children[0];

          // Fetch visit logs for this child
          const { data: logs, error: logsError } = await supabase
            .from('visit_logs')
            .select('*')
            .eq('child_id', child.id)
            .order('created_at', { ascending: false });

          if (logsError) throw logsError;

          if (logs) {
            const formattedLogs: VisitLog[] = logs.map((row: any) => ({
              id: row.id,
              date: row.date,
              duration: row.duration,
              maxStress: row.max_stress,
              avgStress: row.avg_stress,
              pauses: row.pauses,
              completed: row.completed,
              notes: row.notes,
            }));
            setVisitLogs(formattedLogs);
          }

          // Calculate stats
          const childProfile = child.child_profile as any;
          setChildStats({
            totalVisits: childProfile?.completed_visits || 0,
            avgStress: logs && logs.length > 0 
              ? Math.round(logs.reduce((sum: number, log: any) => sum + log.avg_stress, 0) / logs.length)
              : 0,
            maxStress: logs && logs.length > 0
              ? Math.max(...logs.map((log: any) => log.max_stress))
              : 0,
            totalPauses: logs ? logs.reduce((sum: number, log: any) => sum + log.pauses, 0) : 0,
            completedScenes: childProfile?.completed_scenes?.length || 0,
            stars: childProfile?.stars || 0,
            diplomaEarned: childProfile?.diploma_earned || false,
          });
        }
      } catch (err) {
        console.error('Error fetching parent dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">A carregar dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 bg-white rounded-xl border-2 border-gray-200 hover:border-primary transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dashboard Pais</h1>
            <p className="text-sm text-gray-500">Estatísticas e relatórios</p>
          </div>
        </div>

        {childStats ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 border-2 border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={20} className="text-primary" />
                  <span className="text-sm text-gray-500">Visitas</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{childStats.totalVisits}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-4 border-2 border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} className="text-secondary" />
                  <span className="text-sm text-gray-500">Stress Médio</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{childStats.avgStress}%</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-4 border-2 border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={20} className="text-yellow-500" />
                  <span className="text-sm text-gray-500">Stress Máximo</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{childStats.maxStress}%</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-4 border-2 border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={20} className="text-purple-500" />
                  <span className="text-sm text-gray-500">Pausas Totais</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{childStats.totalPauses}</p>
              </motion.div>
            </div>

            {/* Progress Section */}
            <div className="bg-white rounded-3xl p-6 mb-6 border-2 border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Progresso da Criança</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Cenas completadas</span>
                    <span className="font-bold">{childStats.completedScenes}/7</span>
                  </div>
                  <ProgressBar progress={(childStats.completedScenes / 7) * 100} color="bg-primary" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Estrelas</span>
                    <span className="font-bold">{childStats.stars}</span>
                  </div>
                  <ProgressBar progress={Math.min(100, childStats.stars * 10)} color="bg-yellow-400" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Diploma</span>
                    <span className="font-bold">{childStats.diplomaEarned ? '✅ Conquistado' : '🔒 Por conquistar'}</span>
                  </div>
                  <ProgressBar 
                    progress={childStats.diplomaEarned ? 100 : (childStats.totalVisits / 3) * 100} 
                    color="bg-blue-500" 
                  />
                </div>
              </div>
            </div>

            {/* Visit History */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Histórico de Visitas</h3>

              {visitLogs.length > 0 ? (
                <div className="space-y-3">
                  {visitLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-50 rounded-2xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-800">
                          {new Date(log.date).toLocaleDateString('pt-PT')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          log.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {log.completed ? 'Completada' : 'Incompleta'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Duração</p>
                          <p className="font-bold">{Math.floor(log.duration / 60)} min</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Stress Máx</p>
                          <p className="font-bold">{log.maxStress}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Pausas</p>
                          <p className="font-bold">{log.pauses}</p>
                        </div>
                      </div>
                      {log.notes && (
                        <p className="text-xs text-gray-500 mt-2">{log.notes}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Ainda não há visitas registadas</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-gray-100">
            <User size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhuma criança associada</h3>
            <p className="text-gray-500">
              As crianças precisam de registar-se com o teu email para aparecerem aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Calendar,
  Clock,
  AlertTriangle,
  Award,
  Activity,
  BarChart3,
  Filter,
  Users,
  Baby,
  TrendingUp,
  Star,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface VisitLog {
  id: string;
  child_id: string;
  date: string;
  duration: number;
  max_stress: number;
  avg_stress: number;
  pauses: number;
  completed: boolean;
  notes: string;
  child_name?: string;
}

interface Child {
  id: string;
  name: string;
  email: string;
  age?: number;
}

export default function ParentDashboard() {
  const { profile } = useAuth();
  const [visits, setVisits] = useState<VisitLog[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | 'all'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'week' | 'month'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, [profile]);

  useEffect(() => {
    if (children.length > 0) {
      loadVisits();
    }
  }, [children, selectedChild, selectedPeriod]);

  const loadChildren = async () => {
    if (!profile) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, child_profile')
        .eq('role', 'child')
        .ilike('parent_email', profile.email);

      if (error) {
        console.error('Erro:', error);
        return;
      }

      if (data) {
        setChildren(data.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          age: c.child_profile?.age,
        })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadVisits = async () => {
    try {
      let query = supabase
        .from('visit_logs')
        .select('*, profiles(name)')
        .order('date', { ascending: false });

      if (selectedChild !== 'all') {
        query = query.eq('child_id', selectedChild);
      } else {
        const childIds = children.map(c => c.id);
        if (childIds.length > 0) query = query.in('child_id', childIds);
      }

      const { data, error } = await query;
      if (error) { console.error(error); return; }

      if (data) {
        setVisits(data.map((v: any) => ({ ...v, child_name: v.profiles?.name })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisits = visits.filter(v => {
    if (selectedPeriod === 'all') return true;
    const visitDate = new Date(v.date);
    const now = new Date();
    if (selectedPeriod === 'week') {
      return visitDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    if (selectedPeriod === 'month') {
      return visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const totalVisits = filteredVisits.length;
  const completedVisits = filteredVisits.filter(v => v.completed).length;
  const avgStress = filteredVisits.length > 0
    ? Math.round(filteredVisits.reduce((a, b) => a + b.avg_stress, 0) / filteredVisits.length) : 0;
  const maxStress = filteredVisits.length > 0 ? Math.max(...filteredVisits.map(v => v.max_stress)) : 0;
  const totalPauses = filteredVisits.reduce((a, b) => a + b.pauses, 0);
  const totalDuration = filteredVisits.reduce((a, b) => a + b.duration, 0);

  const formatDuration = (s: number) => `${Math.floor(s / 60)} min`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
          <Activity size={40} className="text-sky-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 bg-gradient-to-br from-lavender-300 to-sky-300 rounded-2xl flex items-center justify-center shadow-kid">
            <Heart size={28} className="text-white" />
          </div>
          <div>
            <h1 className="font-comic font-bold text-2xl md:text-3xl text-text">
              Dashboard dos Pais
            </h1>
            <p className="text-text-light text-sm font-comic">
              Acompanha o progresso do teu filho/a
            </p>
          </div>
        </div>
      </motion.div>

      {/* Seletor de Filhos */}
      {children.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-4 shadow-kid mb-6 border-2 border-sky-50">
          <div className="flex items-center gap-2 mb-3">
            <Users size={20} className="text-sky-400" />
            <span className="font-comic font-bold text-text">Os meus filhos:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button onClick={() => setSelectedChild('all')} whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl font-comic font-bold transition-all ${
                selectedChild === 'all' ? 'bg-sky-400 text-white shadow-kid' : 'bg-sky-50 text-text-light'
              }`}>
              Todos
            </motion.button>
            {children.map((child) => (
              <motion.button key={child.id} onClick={() => setSelectedChild(child.id)} whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl font-comic font-bold transition-all flex items-center gap-2 ${
                  selectedChild === child.id ? 'bg-sky-400 text-white shadow-kid' : 'bg-sky-50 text-text-light'
                }`}>
                <Baby size={16} />
                {child.name}
                {child.age && <span className="text-xs opacity-75">({child.age}a)</span>}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {children.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0 }}
          className="bg-peach-50 border-2 border-peach-200 rounded-3xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle size={24} className="text-peach-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-comic font-bold text-peach-600 mb-1">Nenhum filho encontrado</h3>
              <p className="text-sm text-peach-500 font-comic">
                Não foram encontradas crianças associadas ao teu email. 
                Certifica-te de que o teu filho/a registou a conta com o teu email ({profile?.email}).
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { icon: Calendar, label: 'Visitas', value: totalVisits.toString(), color: 'text-sky-400', bg: 'bg-sky-50' },
          { icon: Award, label: 'Completas', value: `${completedVisits}/${totalVisits}`, color: 'text-mint-400', bg: 'bg-mint-50' },
          { icon: TrendingUp, label: 'Stress Médio', value: `${avgStress}%`, color: 'text-sky-400', bg: 'bg-sky-50' },
          { icon: AlertTriangle, label: 'Stress Máx', value: `${maxStress}%`, color: 'text-peach-400', bg: 'bg-peach-50' },
          { icon: Clock, label: 'Pausas', value: totalPauses.toString(), color: 'text-lavender-400', bg: 'bg-lavender-50' },
          { icon: Activity, label: 'Tempo Total', value: formatDuration(totalDuration), color: 'text-sky-400', bg: 'bg-sky-50' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`${stat.bg} rounded-2xl p-4 text-center border-2 border-white`}>
            <stat.icon size={24} className={`mx-auto mb-2 ${stat.color}`} />
            <p className="font-comic font-black text-xl text-text">{stat.value}</p>
            <p className="text-xs text-text-light font-comic">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={18} className="text-text-light" />
        <span className="text-sm font-comic font-bold text-text-light">Período:</span>
        {(['all', 'week', 'month'] as const).map((period) => (
          <motion.button key={period} onClick={() => setSelectedPeriod(period)} whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl text-sm font-comic font-bold transition-all ${
              selectedPeriod === period ? 'bg-sky-400 text-white shadow-kid' : 'bg-white text-text-light'
            }`}>
            {period === 'all' && 'Todas'}
            {period === 'week' && 'Esta Semana'}
            {period === 'month' && 'Este Mês'}
          </motion.button>
        ))}
      </div>

      {/* Visits List */}
      <div className="bg-white rounded-3xl shadow-kid overflow-hidden border-2 border-sky-50">
        <div className="p-5 border-b-2 border-sky-50">
          <h2 className="font-comic font-bold text-xl text-text flex items-center gap-2">
            <BarChart3 size={20} className="text-sky-400" />
            Histórico de Visitas
          </h2>
        </div>

        {filteredVisits.length === 0 ? (
          <div className="p-12 text-center">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} className="text-sky-200" />
            </motion.div>
            <p className="text-text-light font-comic font-bold">Ainda não há visitas</p>
            <p className="text-sm text-text-light font-comic mt-1">
              Quando o teu filho/a usar o Modo Salão, os dados aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="divide-y divide-sky-50">
            {filteredVisits.map((visit, i) => (
              <motion.div key={visit.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="p-5 hover:bg-sky-50/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-comic font-bold text-text">{formatDate(visit.date)}</span>
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-600 text-xs font-comic font-bold rounded-full">
                        {visit.child_name}
                      </span>
                      {visit.completed ? (
                        <span className="px-2 py-0.5 bg-mint-100 text-mint-600 text-xs font-comic font-bold rounded-full">Completa</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-peach-100 text-peach-600 text-xs font-comic font-bold rounded-full">Incompleta</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-text-light" />
                        <span className="text-sm text-text font-comic">{formatDuration(visit.duration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-sky-400" />
                        <span className="text-sm text-text font-comic">Méd: {visit.avg_stress}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-peach-400" />
                        <span className="text-sm text-text font-comic">Máx: {visit.max_stress}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-lavender-400" />
                        <span className="text-sm text-text font-comic">{visit.pauses} pausas</span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-light font-comic">Nível de Stress</span>
                        <span className="font-comic font-bold text-text">{visit.avg_stress}%</span>
                      </div>
                      <div className="h-2.5 bg-sky-50 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            visit.avg_stress < 30 ? 'bg-mint-400' :
                            visit.avg_stress < 50 ? 'bg-sky-400' :
                            visit.avg_stress < 70 ? 'bg-peach-400' : 'bg-coral-400'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${visit.avg_stress}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                    </div>

                    {visit.notes && (
                      <p className="text-sm text-text-light mt-2 bg-sky-50 p-3 rounded-2xl font-comic">
                        "{visit.notes}"
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-lavender-50 to-sky-50 rounded-3xl p-6 border-2 border-lavender-100">
        <h3 className="font-comic font-bold text-lg text-text mb-3 flex items-center gap-2">
          <Star size={20} className="text-lavender-400" />
          Dicas para Pais
        </h3>
        <ul className="space-y-3 text-sm text-text-light font-comic">
          <li className="flex items-start gap-2">
            <span className="text-lavender-400 mt-0.5">•</span>
            Se o stress médio estiver acima de 60%, considera mais sessões no Modo Casa antes da próxima visita real.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-lavender-400 mt-0.5">•</span>
            Muitas pausas indicam que a criança pode precisar de mais tempo para se adaptar.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-lavender-400 mt-0.5">•</span>
            Celebra cada visita completa! Recompensas positivas ajudam a construir confiança.
          </li>
        </ul>
      </motion.div>
    </div>
  );
}

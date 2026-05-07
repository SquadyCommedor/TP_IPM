import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  AlertTriangle,
  Award,
  User,
  Activity,
  BarChart3,
  ChevronRight,
  Filter,
  Users,
  Baby,
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
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [visits, setVisits] = useState<VisitLog[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | 'all'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'week' | 'month'>('all');
  const [loading, setLoading] = useState(true);

  // Carregar filhos do pai
  useEffect(() => {
    loadChildren();
  }, [profile]);

  // Carregar visitas quando filhos ou período mudam
  useEffect(() => {
    if (children.length > 0) {
      loadVisits();
    }
  }, [children, selectedChild, selectedPeriod]);

  const loadChildren = async () => {
    if (!profile || !user) return;

    try {
      // Método 1: Usar a função RPC get_children() (se existir)
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_children');

      if (rpcError || !rpcData || rpcData.length === 0) {
        // Método 2: Query direta com RLS
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, child_profile')
          .eq('role', 'child')
          .ilike('parent_email', profile.email);

        if (error) {
          console.error('Erro ao carregar filhos:', error);
          toast.error('Erro ao carregar dados dos filhos');
          return;
        }

        if (data) {
          const formattedChildren = data.map((child: any) => ({
            id: child.id,
            name: child.name,
            email: child.email,
            age: child.child_profile?.age,
          }));
          setChildren(formattedChildren);
        }
      } else {
        setChildren(rpcData);
      }
    } catch (e) {
      console.error('Erro:', e);
    }
  };

  const loadVisits = async () => {
    try {
      let query = supabase
        .from('visit_logs')
        .select('*, profiles(name)')
        .order('date', { ascending: false });

      // Filtrar por criança selecionada
      if (selectedChild !== 'all') {
        query = query.eq('child_id', selectedChild);
      } else {
        // Filtrar apenas pelos filhos deste pai
        const childIds = children.map(c => c.id);
        if (childIds.length > 0) {
          query = query.in('child_id', childIds);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao carregar visitas:', error);
        toast.error('Erro ao carregar visitas');
        return;
      }

      if (data) {
        const formattedVisits = data.map((visit: any) => ({
          ...visit,
          child_name: visit.profiles?.name || 'Desconhecido',
        }));
        setVisits(formattedVisits);
      }
    } catch (e) {
      console.error('Erro:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisits = visits.filter(v => {
    if (selectedPeriod === 'all') return true;
    const visitDate = new Date(v.date);
    const now = new Date();
    if (selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return visitDate >= weekAgo;
    }
    if (selectedPeriod === 'month') {
      return visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const totalVisits = filteredVisits.length;
  const completedVisits = filteredVisits.filter(v => v.completed).length;
  const avgStress = filteredVisits.length > 0
    ? Math.round(filteredVisits.reduce((a, b) => a + b.avg_stress, 0) / filteredVisits.length)
    : 0;
  const maxStress = filteredVisits.length > 0
    ? Math.max(...filteredVisits.map(v => v.max_stress))
    : 0;
  const totalPauses = filteredVisits.reduce((a, b) => a + b.pauses, 0);
  const totalDuration = filteredVisits.reduce((a, b) => a + b.duration, 0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Activity size={40} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Heart size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-text">
              Dashboard dos Pais
            </h1>
            <p className="text-text-light text-sm">
              Acompanha o progresso do teu filho/a
            </p>
          </div>
        </div>
      </motion.div>

      {/* Seletor de Filhos */}
      {children.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-lg mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Users size={18} className="text-primary" />
            <span className="font-bold text-text">Filhos registados:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => setSelectedChild('all')}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedChild === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-text-light hover:bg-gray-200'
              }`}
            >
              Todos
            </motion.button>
            {children.map((child) => (
              <motion.button
                key={child.id}
                onClick={() => setSelectedChild(child.id)}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  selectedChild === child.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-text-light hover:bg-gray-200'
                }`}
              >
                <Baby size={16} />
                {child.name}
                {child.age && <span className="text-xs opacity-75">({child.age} anos)</span>}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {children.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={24} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-800 mb-1">Nenhum filho encontrado</h3>
              <p className="text-sm text-yellow-700">
                Não foram encontradas crianças associadas ao teu email. 
                Certifica-te de que o teu filho/a registou a conta com o teu email ({profile?.email}) 
                no campo "Email do Pai/Mãe".
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { icon: Calendar, label: 'Visitas', value: totalVisits.toString(), color: 'text-primary', bg: 'bg-orange-50' },
          { icon: Award, label: 'Completas', value: `${completedVisits}/${totalVisits}`, color: 'text-green-500', bg: 'bg-green-50' },
          { icon: TrendingUp, label: 'Stress Médio', value: `${avgStress}%`, color: 'text-secondary', bg: 'bg-teal-50' },
          { icon: AlertTriangle, label: 'Stress Máx', value: `${maxStress}%`, color: 'text-orange-500', bg: 'bg-orange-50' },
          { icon: Clock, label: 'Pausas', value: totalPauses.toString(), color: 'text-purple', bg: 'bg-purple-50' },
          { icon: Activity, label: 'Tempo Total', value: formatDuration(totalDuration), color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`${stat.bg} rounded-2xl p-4 text-center`}
          >
            <stat.icon size={20} className={`mx-auto mb-2 ${stat.color}`} />
            <p className="font-black text-xl text-text">{stat.value}</p>
            <p className="text-xs text-text-light font-semibold">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={18} className="text-text-light" />
        <span className="text-sm font-semibold text-text-light">Período:</span>
        {(['all', 'week', 'month'] as const).map((period) => (
          <motion.button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedPeriod === period
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-text-light hover:bg-gray-50'
            }`}
          >
            {period === 'all' && 'Todas'}
            {period === 'week' && 'Esta Semana'}
            {period === 'month' && 'Este Mês'}
          </motion.button>
        ))}
      </div>

      {/* Visits List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h2 className="font-display font-bold text-xl text-text flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            Histórico de Visitas
          </h2>
        </div>

        {filteredVisits.length === 0 ? (
          <div className="p-12 text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Calendar size={28} className="text-gray-400" />
            </motion.div>
            <p className="text-text-light font-semibold">Ainda não há visitas registadas</p>
            <p className="text-sm text-text-light mt-1">
              Quando o teu filho/a usar o Modo Salão, os dados aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredVisits.map((visit, i) => (
              <motion.div
                key={visit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-text">
                        {formatDate(visit.date)}
                      </span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                        {visit.child_name}
                      </span>
                      {visit.completed ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          Completa
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                          Incompleta
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-text-light" />
                        <span className="text-sm text-text">{formatDuration(visit.duration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-secondary" />
                        <span className="text-sm text-text">Méd: {visit.avg_stress}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-orange-500" />
                        <span className="text-sm text-text">Máx: {visit.max_stress}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-purple" />
                        <span className="text-sm text-text">{visit.pauses} pausas</span>
                      </div>
                    </div>

                    {/* Stress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-light">Nível de Stress</span>
                        <span className="font-bold text-text">{visit.avg_stress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            visit.avg_stress < 30 ? 'bg-green-400' :
                            visit.avg_stress < 50 ? 'bg-yellow-400' :
                            visit.avg_stress < 70 ? 'bg-orange-400' : 'bg-red-400'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${visit.avg_stress}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                    </div>

                    {visit.notes && (
                      <p className="text-sm text-text-light mt-2 bg-gray-50 p-2 rounded-lg">
                        "{visit.notes}"
                      </p>
                    )}
                  </div>

                  <ChevronRight size={18} className="text-gray-300 ml-4 mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100"
      >
        <h3 className="font-display font-bold text-lg text-text mb-3 flex items-center gap-2">
          <User size={20} className="text-pink-500" />
          Dicas para Pais
        </h3>
        <ul className="space-y-2 text-sm text-text-light">
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            Se o stress médio estiver acima de 60%, considera fazer mais sessões no Modo Casa antes da próxima visita real.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            Muitas pausas indicam que a criança pode precisar de mais tempo para se adaptar a cada etapa.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            Celebra cada visita completa! Recompensas positivas ajudam a construir confiança.
          </li>
        </ul>
      </motion.div>
    </div>
  );
}

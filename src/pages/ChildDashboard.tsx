import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';
import {
  Home,
  Scissors,
  Store,
  Sparkles,
  Star,
  Trophy,
  Heart,
  Zap,
  Smile,
  Award,
  BookOpen,
  Gamepad2,
} from 'lucide-react';

const quickActions = [
  {
    title: 'História Animada',
    description: 'Vê a história do cabeleireiro e depois joga!',
    icon: BookOpen,
    path: '/child/story-game',
    color: 'bg-sky-100',
    iconColor: 'text-sky-400',
    borderColor: 'border-sky-200',
    image: 'https://ecdn.teacherspayteachers.com/thumbitem/Getting-a-Haircut-Social-Story-Haircut-Social-Story-for-Autism-9507887-1689351008/original-9507887-1.jpg',
    badge: 'NOVO',
    badgeColor: 'bg-peach-400',
  },
  {
    title: 'Modo Casa',
    description: 'Pratica em casa com a história passo a passo',
    icon: Home,
    path: '/child/home-mode',
    color: 'bg-mint-100',
    iconColor: 'text-mint-400',
    borderColor: 'border-mint-200',
    image: 'https://cdn11.bigcommerce.com/s-dkxq2/products/1285/images/11836/Haircut_girl_00__93080.1592342386.380.500.jpg?c=2',
  },
  {
    title: 'Modo Salão',
    description: 'Acompanha a visita ao cabeleireiro',
    icon: Store,
    path: '/child/salon-mode',
    color: 'bg-lavender-100',
    iconColor: 'text-lavender-400',
    borderColor: 'border-lavender-200',
    image: 'https://www.shutterstock.com/image-vector/illustration-cheerful-boy-girl-salon-600nw-2518744407.jpg',
  },
  {
    title: 'O Meu Avatar',
    description: 'Personaliza o teu personagem',
    icon: Sparkles,
    path: '/child/character',
    color: 'bg-peach-100',
    iconColor: 'text-peach-400',
    borderColor: 'border-peach-200',
    image: 'https://www.shutterstock.com/image-vector/illustration-cheerful-boy-girl-salon-600nw-2518744407.jpg',
  },
];

const rewards = [
  { icon: Star, label: 'Primeira Cena', color: 'text-peach-400', bg: 'bg-peach-50' },
  { icon: Award, label: 'Corajoso', color: 'text-mint-400', bg: 'bg-mint-50' },
  { icon: Trophy, label: 'Visitante', color: 'text-sky-400', bg: 'bg-sky-50' },
];

export default function ChildDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 pb-24">
      {/* Header com mascote */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-kid flex-shrink-0"
          >
            <img 
              src="https://thumbs.dreamstime.com/b/cartoon-boy-getting-haircut-female-hairdresser-hairdryer-comb-child-barber-cute-sits-chair-wearing-yellow-cape-415640394.jpg"
              alt="Mascote"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div>
            <h1 className="font-comic font-bold text-2xl md:text-3xl text-sky-500">
              Olá, {profile?.name || 'Amigo'}!
            </h1>
            <p className="text-text-light text-sm font-comic">
              Pronto para uma nova aventura?
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats simples */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Star, label: 'Estrelas', value: '12', color: 'text-peach-400', bg: 'bg-peach-50' },
          { icon: Trophy, label: 'Visitas', value: '3', color: 'text-sky-400', bg: 'bg-sky-50' },
          { icon: Smile, label: 'Jogos', value: '2', color: 'text-mint-400', bg: 'bg-mint-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${stat.bg} rounded-2xl p-4 text-center border-2 border-white`}
          >
            <stat.icon size={24} className={`mx-auto mb-1 ${stat.color}`} />
            <p className="font-comic font-bold text-xl text-text">{stat.value}</p>
            <p className="text-xs text-text-light font-comic">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions - Cards grandes e coloridos */}
      <div className="mb-6">
        <h2 className="font-comic font-bold text-xl text-text mb-4 flex items-center gap-2">
          <Gamepad2 size={20} className="text-sky-400" />
          O que queres fazer?
        </h2>

        <div className="space-y-4">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.path}
              onClick={() => navigate(action.path)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl ${action.color} border-2 ${action.borderColor} text-left transition-all relative`}
            >
              {/* Badge NOVO */}
              {action.badge && (
                <div className={`absolute -top-2 -right-2 ${action.badgeColor} text-white text-xs font-comic font-bold px-2 py-1 rounded-full shadow-kid animate-bounce-soft`}>
                  {action.badge}
                </div>
              )}

              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                <img
                  src={action.image}
                  alt={action.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-comic font-bold text-lg text-text">{action.title}</h3>
                <p className="text-sm text-text-light">{action.description}</p>
              </div>
              <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${action.iconColor} shadow-sm`}>
                <action.icon size={20} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recompensas */}
      <div className="mb-6">
        <h2 className="font-comic font-bold text-xl text-text mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-peach-400" />
          As Tuas Conquistas
        </h2>

        <div className="bg-white rounded-2xl p-4 shadow-kid">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {rewards.map((reward, i) => (
              <motion.div
                key={reward.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl ${reward.bg} min-w-[80px]`}
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <reward.icon size={24} className={reward.color} />
                </div>
                <span className="text-xs font-bold text-text text-center font-comic">{reward.label}</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold text-text-light">
                  x1
                </span>
              </motion.div>
            ))}

            <div className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-gray-50 min-w-[80px] opacity-50">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <Heart size={20} className="text-gray-300" />
              </div>
              <span className="text-xs text-gray-400 font-comic text-center">Mais em breve</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dica do dia */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-mint-50 rounded-2xl p-5 border-2 border-mint-100"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-mint-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={24} className="text-mint-500" />
          </div>
          <div>
            <h3 className="font-comic font-bold text-text mb-1">Dica do Dia</h3>
            <p className="text-sm text-text-light leading-relaxed font-comic">
              Antes de ir ao cabeleireiro, pede aos teus pais para te mostrarem fotos de cortes de cabelo 
              que gostes. Assim, o cabeleireiro sabe exatamente o que queres!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Check,
  Palette,
  Star,
  Save,
  Heart,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

const characters = [
  { id: 1, name: 'Rui', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&crop=face', color: 'bg-sky-400' },
  { id: 2, name: 'Ana', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face', color: 'bg-peach-400' },
  { id: 3, name: 'Tiago', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', color: 'bg-mint-400' },
  { id: 4, name: 'Sofia', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', color: 'bg-lavender-400' },
  { id: 5, name: 'Miguel', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', color: 'bg-sky-300' },
  { id: 6, name: 'Inês', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', color: 'bg-peach-300' },
];

const hairColors = [
  { id: 'brown', label: 'Castanho', bg: 'bg-amber-700', border: 'border-amber-700' },
  { id: 'blonde', label: 'Loiro', bg: 'bg-yellow-400', border: 'border-yellow-400' },
  { id: 'black', label: 'Preto', bg: 'bg-gray-800', border: 'border-gray-800' },
  { id: 'red', label: 'Ruivo', bg: 'bg-red-400', border: 'border-red-400' },
  { id: 'blue', label: 'Azul', bg: 'bg-blue-400', border: 'border-blue-400' },
];

export default function CharacterPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedCharacter, setSelectedCharacter] = useState(1);
  const [selectedHairColor, setSelectedHairColor] = useState('brown');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success('Guardado! Gosto do teu avatar!');
    setTimeout(() => setSaved(false), 2000);
  };

  const character = characters.find(c => c.id === selectedCharacter);
  const hairColor = hairColors.find(h => h.id === selectedHairColor);

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate('/child')}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-kid"
          >
            <ArrowLeft size={24} className="text-sky-400" />
          </motion.button>
          <div>
            <h1 className="font-comic font-bold text-2xl text-text">O Meu Avatar</h1>
            <p className="text-sm text-text-light font-comic">Escolhe quem és!</p>
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.95 }}
          className={`px-5 py-3 rounded-2xl font-comic font-bold flex items-center gap-2 transition-all shadow-kid ${
            saved 
              ? 'bg-mint-400 text-white' 
              : 'bg-sky-400 text-white hover:bg-sky-500'
          }`}
        >
          {saved ? <Check size={20} /> : <Save size={20} />}
          {saved ? 'Guardado!' : 'Guardar'}
        </motion.button>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Preview - Grande e central */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-kid-lg mb-8 text-center border-4 border-sky-100"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative inline-block"
          >
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-kid-lg mx-auto border-4 border-white relative">
              <img
                src={character?.image}
                alt={character?.name}
                className="w-full h-full object-cover"
              />
              {/* Hair color overlay */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1/3 opacity-30"
                style={{ backgroundColor: hairColor?.id === 'brown' ? '#8B4513' : hairColor?.id === 'blonde' ? '#FCD34D' : hairColor?.id === 'black' ? '#111827' : hairColor?.id === 'red' ? '#EF4444' : '#3B82F6' }}
              />
            </div>

            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <span className={`px-4 py-1 rounded-full text-xs font-comic font-bold text-white ${hairColor?.bg}`}>
                {hairColor?.label}
              </span>
            </div>
          </motion.div>

          <h2 className="font-comic font-bold text-2xl text-text mt-6">
            Sou o/a {character?.name}!
          </h2>
          <div className="flex justify-center gap-1 mt-2">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={16} className="text-peach-400 fill-peach-400" />
            ))}
          </div>
        </motion.div>

        {/* Character Selection */}
        <div className="mb-8">
          <h3 className="font-comic font-bold text-xl text-text mb-4 flex items-center gap-2">
            <Heart size={20} className="text-sky-400" />
            Escolhe o teu amigo
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {characters.map((char, i) => (
              <motion.button
                key={char.id}
                onClick={() => setSelectedCharacter(char.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                  selectedCharacter === char.id
                    ? 'bg-white shadow-kid ring-4 ring-sky-200' 
                    : 'bg-white/50 hover:bg-white hover:shadow-kid'
                }`}
              >
                <div className={`w-16 h-16 rounded-full ${char.color} p-1`}>
                  <div className="w-full h-full rounded-full bg-white overflow-hidden">
                    <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className={`font-comic font-bold text-sm ${selectedCharacter === char.id ? 'text-sky-500' : 'text-text'}`}>
                  {char.name}
                </span>
                {selectedCharacter === char.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-mint-400 rounded-full flex items-center justify-center"
                  >
                    <Check size={14} className="text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Hair Color */}
        <div className="mb-8">
          <h3 className="font-comic font-bold text-xl text-text mb-4 flex items-center gap-2">
            <Palette size={20} className="text-peach-400" />
            Cor do Cabelo
          </h3>
          <div className="flex flex-wrap gap-3">
            {hairColors.map((color) => (
              <motion.button
                key={color.id}
                onClick={() => setSelectedHairColor(color.id)}
                whileTap={{ scale: 0.9 }}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all ${
                  selectedHairColor === color.id
                    ? 'bg-white shadow-kid ring-4 ring-sky-200'
                    : 'bg-white/50 hover:bg-white hover:shadow-kid'
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${color.bg} shadow-sm border-2 border-white`} />
                <span className="font-comic font-bold text-text">{color.label}</span>
                {selectedHairColor === color.id && (
                  <Check size={16} className="text-mint-400" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

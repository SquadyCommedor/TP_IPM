import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Check,
  Palette,
  Shirt,
  Star,
  Save,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import CharacterAvatar from '../components/CharacterAvatar';
import toast from 'react-hot-toast';

const characters = [
  { id: 1, name: 'Rui', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&crop=face', color: 'blue' },
  { id: 2, name: 'Ana', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face', color: 'pink' },
  { id: 3, name: 'Tiago', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', color: 'green' },
  { id: 4, name: 'Sofia', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', color: 'purple' },
  { id: 5, name: 'Miguel', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', color: 'orange' },
  { id: 6, name: 'Inês', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', color: 'red' },
];

const hairColors = [
  { id: 'brown', label: 'Castanho', bg: 'bg-amber-700', hex: '#8B4513' },
  { id: 'blonde', label: 'Loiro', bg: 'bg-yellow-400', hex: '#FCD34D' },
  { id: 'black', label: 'Preto', bg: 'bg-gray-900', hex: '#111827' },
  { id: 'red', label: 'Ruivo', bg: 'bg-red-500', hex: '#EF4444' },
  { id: 'blue', label: 'Azul', bg: 'bg-blue-500', hex: '#3B82F6' },
];

const accessories = [
  { id: 'glasses', label: 'Óculos', icon: '👓' },
  { id: 'hat', label: 'Chapéu', icon: '🎩' },
  { id: 'bow', label: 'Laço', icon: '🎀' },
  { id: 'star', label: 'Estrela', icon: '⭐' },
];

export default function CharacterPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedCharacter, setSelectedCharacter] = useState(1);
  const [selectedHairColor, setSelectedHairColor] = useState('brown');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const toggleAccessory = (id: string) => {
    setSelectedAccessories(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    setSaved(true);
    toast.success('Avatar guardado com sucesso!');
    setTimeout(() => setSaved(false), 2000);
  };

  const character = characters.find(c => c.id === selectedCharacter);

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate('/child')}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={20} className="text-text" />
          </motion.button>
          <div>
            <h1 className="font-display font-bold text-2xl text-text">O Meu Avatar</h1>
            <p className="text-sm text-text-light">Personaliza o teu personagem</p>
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.95 }}
          className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            saved 
              ? 'bg-green-500 text-white' 
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saved ? 'Guardado!' : 'Guardar'}
        </motion.button>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl mb-8 text-center"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
            >
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl mx-auto border-4 border-white">
                <img
                  src={character?.image}
                  alt={character?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Hair color indicator */}
              <div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                style={{ backgroundColor: hairColors.find(h => h.id === selectedHairColor)?.hex }}
              >
                {hairColors.find(h => h.id === selectedHairColor)?.label}
              </div>
            </motion.div>

            {/* Accessories floating */}
            <div className="absolute -top-2 -right-2 flex gap-1">
              {selectedAccessories.map(acc => (
                <motion.span
                  key={acc}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl"
                >
                  {accessories.find(a => a.id === acc)?.icon}
                </motion.span>
              ))}
            </div>
          </div>

          <h2 className="font-display font-bold text-2xl text-text mt-6">
            {character?.name}
          </h2>
          <p className="text-text-light mt-1">
            {selectedAccessories.length > 0 
              ? `Com ${selectedAccessories.length} acessório(s)` 
              : 'Sem acessórios'}
          </p>
        </motion.div>

        {/* Character Selection */}
        <div className="mb-8">
          <h3 className="font-display font-bold text-lg text-text mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            Escolhe o Personagem
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {characters.map((char, i) => (
              <CharacterAvatar
                key={char.id}
                name={char.name}
                image={char.image}
                color={char.color}
                isSelected={selectedCharacter === char.id}
                onClick={() => setSelectedCharacter(char.id)}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Hair Color */}
        <div className="mb-8">
          <h3 className="font-display font-bold text-lg text-text mb-4 flex items-center gap-2">
            <Palette size={20} className="text-secondary" />
            Cor do Cabelo
          </h3>
          <div className="flex flex-wrap gap-3">
            {hairColors.map((color) => (
              <motion.button
                key={color.id}
                onClick={() => setSelectedHairColor(color.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  selectedHairColor === color.id
                    ? 'bg-white shadow-lg ring-2 ring-primary'
                    : 'bg-white/50 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${color.bg} shadow-sm`} />
                <span className="font-semibold text-sm text-text">{color.label}</span>
                {selectedHairColor === color.id && (
                  <Check size={16} className="text-primary" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Accessories */}
        <div className="mb-8">
          <h3 className="font-display font-bold text-lg text-text mb-4 flex items-center gap-2">
            <Shirt size={20} className="text-purple" />
            Acessórios
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {accessories.map((acc) => (
              <motion.button
                key={acc.id}
                onClick={() => toggleAccessory(acc.id)}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-2xl text-center transition-all ${
                  selectedAccessories.includes(acc.id)
                    ? 'bg-white shadow-lg ring-2 ring-accent'
                    : 'bg-white/50 hover:bg-white hover:shadow-md'
                }`}
              >
                <span className="text-3xl block mb-2">{acc.icon}</span>
                <span className="font-semibold text-sm text-text">{acc.label}</span>
                {selectedAccessories.includes(acc.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-accent-dark"
                  >
                    <Star size={12} />
                    Equipado
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

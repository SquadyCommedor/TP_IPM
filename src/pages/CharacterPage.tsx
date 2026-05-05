import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { CHARACTER_OPTIONS, HAIR_COLORS } from '../data';
import { CharacterAvatar } from '../components/CharacterAvatar';
import type { CharacterSkin, HairColor } from '../types';

export default function CharacterPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const updateChildProfile = useStore((s) => s.updateChildProfile);

  const [selectedSkin, setSelectedSkin] = useState<CharacterSkin>(
    user?.childProfile?.characterSkin || 'neutral1'
  );
  const [selectedHair, setSelectedHair] = useState<HairColor>(
    user?.childProfile?.hairColor || 'brown'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateChildProfile({
      characterSkin: selectedSkin,
      hairColor: selectedHair,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-kid-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('/child')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <h1 className="font-bold text-gray-800">O Meu Personagem</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Preview */}
        <div className="bg-white rounded-3xl p-8 text-center border-2 border-primary/20 shadow-lg">
          <motion.div
            key={selectedSkin + selectedHair}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <CharacterAvatar 
              skin={selectedSkin} 
              hairColor={selectedHair} 
              size="xl" 
            />
          </motion.div>
          <p className="text-gray-500 text-sm mt-4">
            {CHARACTER_OPTIONS.find(c => c.id === selectedSkin)?.name} • {HAIR_COLORS.find(h => h.id === selectedHair)?.name}
          </p>
        </div>

        {/* Character Selection */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-4">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            Escolhe o teu personagem
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {CHARACTER_OPTIONS.map((char) => (
              <motion.button
                key={char.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSkin(char.id as CharacterSkin)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedSkin === char.id 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-3xl">{char.emoji}</span>
                <p className="text-xs font-medium text-gray-700 mt-1">{char.name}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Hair Color Selection */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-4">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            Cor do cabelo
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {HAIR_COLORS.map((hair) => (
              <motion.button
                key={hair.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedHair(hair.id as HairColor)}
                className={`aspect-square rounded-xl border-2 transition-all ${
                  selectedHair === hair.id 
                    ? 'border-primary scale-110 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: hair.color }}
                title={hair.name}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {HAIR_COLORS.find(h => h.id === selectedHair)?.name}
          </p>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
        >
          {saved ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Guardado!
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Guardar Alterações
            </>
          )}
        </motion.button>
      </main>
    </div>
  );
}

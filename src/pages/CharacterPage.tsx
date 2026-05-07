import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Save } from 'lucide-react';
import { useStore } from '../store';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { CHARACTER_OPTIONS, HAIR_COLORS } from '../data';
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

  const handleSave = async () => {
    await updateChildProfile({
      characterSkin: selectedSkin,
      hairColor: selectedHair,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/child')}
            className="p-2 bg-white rounded-xl border-2 border-gray-200 hover:border-primary transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">O Meu Personagem</h1>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-3xl p-8 mb-6 text-center border-2 border-gray-100">
          <CharacterAvatar
            skin={selectedSkin}
            hairColor={selectedHair}
            size="xl"
            animate={true}
          />
          <p className="mt-4 text-gray-600">
            {CHARACTER_OPTIONS.find(c => c.id === selectedSkin)?.name} • {HAIR_COLORS.find(h => h.id === selectedHair)?.name}
          </p>
        </div>

        {/* Character Selection */}
        <div className="bg-white rounded-3xl p-6 mb-4 border-2 border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Escolhe o teu personagem</h3>
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
                <div className="text-3xl mb-1">{char.emoji}</div>
                <p className="text-xs font-bold">{char.name}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Hair Color Selection */}
        <div className="bg-white rounded-3xl p-6 mb-6 border-2 border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Cor do cabelo</h3>
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
          <p className="text-center mt-3 text-sm text-gray-600">
            {HAIR_COLORS.find(h => h.id === selectedHair)?.name}
          </p>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
        >
          {saved ? (
            <>
              <Check size={20} />
              Guardado!
            </>
          ) : (
            <>
              <Save size={20} />
              Guardar Alterações
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

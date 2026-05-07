import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Heart, Mail, Lock, User, Baby, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isLoading, error, clearError } = useAuth();

  const [mode, setMode] = useState<'select' | 'login' | 'register'>('select');
  const [userType, setUserType] = useState<'parent' | 'child'>('parent');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    childNickname: '',
    childAge: '',
    parentEmail: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'register') {
      if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
      if (userType === 'child') {
        if (!formData.childNickname.trim()) newErrors.childNickname = 'Alcunha é obrigatória';
        if (!formData.childAge || parseInt(formData.childAge) < 3 || parseInt(formData.childAge) > 18) {
          newErrors.childAge = 'Idade deve ser entre 3 e 18 anos';
        }
        if (!formData.parentEmail.trim()) {
          newErrors.parentEmail = 'Email do pai/mãe é obrigatório';
        }
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Palavra-passe é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Palavras-passe não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password, userType);
        navigate(userType === 'parent' ? '/parent' : '/child');
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: userType,
          childNickname: formData.childNickname || undefined,
          childAge: formData.childAge ? parseInt(formData.childAge) : undefined,
          parentEmail: formData.parentEmail || undefined,
        });
        navigate(userType === 'parent' ? '/parent' : '/child');
      }
    } catch {
      // Error is handled by AuthContext
    }
  };

  const renderSelectMode = () => (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-center"
      >
        <div className="relative inline-block mb-4">
          <Scissors size={64} className="text-primary" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2"
          >
            <Heart size={28} className="text-red-400" fill="currentColor" />
          </motion.div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">O Meu Guia do Cabeleireiro</h1>
        <p className="text-gray-500">Escolhe quem és:</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setUserType('parent'); setMode('login'); }}
          className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-primary transition-colors shadow-sm"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User size={32} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800">Sou Pai/Mãe</p>
            <p className="text-xs text-gray-500">Ver relatórios</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setUserType('child'); setMode('login'); }}
          className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-secondary transition-colors shadow-sm"
        >
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
            <Baby size={32} className="text-secondary" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800">Sou Criança</p>
            <p className="text-xs text-gray-500">Jogar e aprender</p>
          </div>
        </motion.button>
      </div>
    </div>
  );

  const renderAuthForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-md"
    >
      <button
        onClick={() => { setMode('select'); clearError(); }}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === 'login' ? 'Entrar' : 'Criar conta'}
        </h2>
        <p className="text-gray-500">
          {userType === 'parent' ? 'Pai/Mãe' : 'Criança'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  placeholder="O teu nome"
                  disabled={isLoading}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {userType === 'child' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alcunha (nome no jogo)</label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={formData.childNickname}
                      onChange={(e) => setFormData({ ...formData, childNickname: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Ex: Ratinho, Estrela..."
                      disabled={isLoading}
                    />
                  </div>
                  {errors.childNickname && <p className="text-red-500 text-xs mt-1">{errors.childNickname}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                  <input
                    type="number"
                    value={formData.childAge}
                    onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                    placeholder="Ex: 7"
                    min="3"
                    max="18"
                    disabled={isLoading}
                  />
                  {errors.childAge && <p className="text-red-500 text-xs mt-1">{errors.childAge}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email do Pai/Mãe</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                      placeholder="email.do.pai@exemplo.pt"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.parentEmail && <p className="text-red-500 text-xs mt-1">{errors.parentEmail}</p>}
                  <p className="text-xs text-gray-400 mt-1">O teu pai/mãe precisa de ter conta primeiro</p>
                </div>
              </>
            )}
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {userType === 'child' && mode === 'register' ? 'Email da criança' : 'Email'}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              placeholder={userType === 'child' ? 'email.da.crianca@exemplo.pt' : 'email@exemplo.pt'}
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Palavra-passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-red-100 border border-red-300 rounded-xl text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              A carregar...
            </span>
          ) : (
            mode === 'login' ? 'Entrar' : 'Criar conta'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            clearError();
            setErrors({});
          }}
          className="text-sm text-gray-500 hover:text-primary transition-colors"
        >
          {mode === 'login' ? 'Ainda não tens conta? Regista-te' : 'Já tens conta? Entra'}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {mode === 'select' ? renderSelectMode() : renderAuthForm()}
      </AnimatePresence>
    </div>
  );
}

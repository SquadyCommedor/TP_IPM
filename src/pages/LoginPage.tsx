import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Scissors, User, Baby, Mail, Lock, ArrowLeft, Sparkles, Users } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useStore } from '../store';
import { LoadingScreen, InlineLoading } from '../components/LoadingScreen';

type AuthMode = 'select' | 'login' | 'register';
type UserType = 'parent' | 'child' | null;

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('select');
  const [userType, setUserType] = useState<UserType>(null);
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
  const [localLoading, setLocalLoading] = useState(false);

  const { login, register, isLoading: authLoading, isInitializing, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const user = useStore((s) => s.user);

  // Clear errors when switching modes
  useEffect(() => {
    clearError();
    setErrors({});
  }, [mode, userType, clearError]);

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    navigate(user.role === 'parent' ? '/parent' : '/child', { replace: true });
    return null;
  }

  // Show loading during auth initialization
  if (isInitializing) {
    return <LoadingScreen message="A preparar..." submessage="A verificar sessão" />;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'register') {
      if (!formData.name.trim()) newErrors.name = 'Nome obrigatório';
      if (userType === 'child') {
        if (!formData.childNickname.trim()) newErrors.childNickname = 'Alcunha obrigatória';
        if (!formData.childAge || parseInt(formData.childAge) < 3 || parseInt(formData.childAge) > 15) {
          newErrors.childAge = 'Idade entre 3 e 15 anos';
        }
        if (!formData.parentEmail.trim()) {
          newErrors.parentEmail = 'Email do pai/mãe obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
          newErrors.parentEmail = 'Email do pai/mãe inválido';
        }
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Palavra-passe obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As palavras-passe não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !userType) return;

    setLocalLoading(true);
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password, userType);
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: userType,
          childNickname: userType === 'child' ? formData.childNickname : undefined,
          childAge: userType === 'child' ? parseInt(formData.childAge) : undefined,
          parentEmail: userType === 'child' ? formData.parentEmail : undefined,
        });
      }
      navigate(userType === 'parent' ? '/parent' : '/child');
    } catch (err) {
      // Error is set in AuthContext, just stop loading
      console.error('Auth error:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    clearError();
    setErrors({});
  };

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    setMode('login');
    clearError();
    setErrors({});
  };

  const isSubmitting = authLoading || localLoading;

  const renderSelectMode = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Scissors className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-family-display)' }}>
            O Meu Guia do Cabeleireiro
          </h1>
        </div>
        <p className="text-gray-500">Quem és tu?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleUserTypeChange('parent')}
          className="p-6 rounded-2xl bg-parent-card border-2 border-primary/20 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md"
        >
          <User className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="font-bold text-gray-800">Sou Pai/Mãe</h3>
          <p className="text-sm text-gray-500 mt-1">Cuidador ou familiar</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleUserTypeChange('child')}
          className="p-6 rounded-2xl bg-kid-card border-2 border-secondary/20 hover:border-secondary/50 transition-colors shadow-sm hover:shadow-md"
        >
          <Baby className="w-10 h-10 text-secondary mx-auto mb-3" />
          <h3 className="font-bold text-gray-800">Sou Criança</h3>
          <p className="text-sm text-gray-500 mt-1">Vou ao cabeleireiro!</p>
        </motion.button>
      </div>
    </motion.div>
  );

  const renderAuthForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <button
        onClick={() => { setMode('select'); setUserType(null); clearError(); }}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Voltar</span>
      </button>

      <div className="text-center mb-8">
        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
          userType === 'parent' ? 'bg-primary/10' : 'bg-secondary/10'
        }`}>
          {userType === 'parent' ? (
            <User className="w-8 h-8 text-primary" />
          ) : (
            <Baby className="w-8 h-8 text-secondary" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === 'login' ? 'Entrar' : 'Criar conta'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {userType === 'parent' ? 'Área dos pais/cuidadores' : 'Área das crianças'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  placeholder="O teu nome"
                  disabled={isSubmitting}
                />
              </div>
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
            </div>

            {userType === 'child' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alcunha (nome no jogo)</label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.childNickname}
                      onChange={(e) => setFormData({ ...formData, childNickname: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Ex: Ratinho, Estrela..."
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.childNickname && <p className="text-danger text-xs mt-1">{errors.childNickname}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                  <input
                    type="number"
                    min="3"
                    max="15"
                    value={formData.childAge}
                    onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                    placeholder="Ex: 7"
                    disabled={isSubmitting}
                  />
                  {errors.childAge && <p className="text-danger text-xs mt-1">{errors.childAge}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email do Pai/Mãe</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                      placeholder="email.do.pai@exemplo.pt"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.parentEmail && <p className="text-danger text-xs mt-1">{errors.parentEmail}</p>}
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
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              placeholder={userType === 'child' ? 'email.da.crianca@exemplo.pt' : 'email@exemplo.pt'}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Palavra-passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>
          {errors.password && <p className="text-danger text-xs mt-1">{errors.password}</p>}
        </div>

        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
            {errors.confirmPassword && <p className="text-danger text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        )}

        <AnimatePresence>
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm text-center"
            >
              {authError}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              A carregar...
            </>
          ) : (
            mode === 'login' ? 'Entrar' : 'Criar conta'
          )}
        </motion.button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
            disabled={isSubmitting}
            className="text-sm text-primary hover:text-primary-dark underline disabled:opacity-50"
          >
            {mode === 'login' ? 'Não tens conta? Regista-te' : 'Já tens conta? Entra'}
          </button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      userType === 'child' ? 'bg-kid-bg' : 'bg-parent-bg'
    }`}>
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {mode === 'select' ? renderSelectMode() : renderAuthForm()}
        </AnimatePresence>
      </div>
    </div>
  );
}

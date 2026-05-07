import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scissors, 
  User, 
  Shield, 
  Mail, 
  Lock, 
  ArrowRight,
  Sparkles,
  Heart,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

type AuthMode = 'login' | 'register';
type UserType = 'parent' | 'child' | null;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [userType, setUserType] = useState<UserType>(null);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    parentEmail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        toast.success('Bem-vindo de volta! 👋');
      } else {
        if (!userType) {
          toast.error('Seleciona o tipo de conta');
          return;
        }
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: userType,
          age: userType === 'child' ? parseInt(formData.age) : undefined,
          parentEmail: userType === 'child' ? formData.parentEmail : undefined,
        });
        toast.success('Conta criada com sucesso! 🎉');
      }
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !userType) {
      toast.error('Escolhe se és Pai/Mãe ou Criança');
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl shadow-xl mb-4"
          >
            <Scissors size={36} className="text-white" />
          </motion.div>
          <h1 className="font-display font-bold text-3xl text-text">
            O Meu Guia
          </h1>
          <p className="text-text-light mt-1">do Cabeleireiro</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-50 m-4 rounded-2xl">
            <button
              onClick={() => { setMode('login'); setStep(1); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === 'login' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-text-light'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setMode('register'); setStep(1); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === 'register' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-text-light'
              }`}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 pt-2">
            <AnimatePresence mode="wait">
              {mode === 'register' && step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="font-display font-bold text-xl text-center mb-4">
                    Quem és tu?
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setUserType('parent')}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-2xl border-2 transition-all text-center ${
                        userType === 'parent'
                          ? 'border-pink-400 bg-pink-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <Shield size={32} className="mx-auto mb-2 text-pink-500" />
                      <span className="font-bold text-sm">Sou Pai/Mãe</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setUserType('child')}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-2xl border-2 transition-all text-center ${
                        userType === 'child'
                          ? 'border-primary bg-orange-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <Sparkles size={32} className="mx-auto mb-2 text-primary" />
                      <span className="font-bold text-sm">Sou Criança</span>
                    </motion.button>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleNext}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
                  >
                    Continuar
                    <ArrowRight size={18} />
                  </motion.button>
                </motion.div>
              )}

              {(mode === 'login' || step === 2) && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {mode === 'register' && (
                    <>
                      <div>
                        <label className="text-sm font-semibold text-text mb-1.5 block">
                          Nome
                        </label>
                        <div className="relative">
                          <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm"
                            placeholder="O teu nome"
                            required
                          />
                        </div>
                      </div>

                      {userType === 'child' && (
                        <>
                          <div>
                            <label className="text-sm font-semibold text-text mb-1.5 block">
                              Idade
                            </label>
                            <input
                              type="number"
                              value={formData.age}
                              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm"
                              placeholder="Quantos anos tens?"
                              min="3"
                              max="18"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-text mb-1.5 block">
                              Email do Pai/Mãe
                            </label>
                            <div className="relative">
                              <Heart size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                              <input
                                type="email"
                                value={formData.parentEmail}
                                onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm"
                                placeholder="email@pai.pt"
                                required
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  <div>
                    <label className="text-sm font-semibold text-text mb-1.5 block">
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm"
                        placeholder="o.teu@email.pt"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-text mb-1.5 block">
                      Palavra-passe
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm"
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles size={20} />
                      </motion.div>
                    ) : (
                      <>
                        {mode === 'login' ? 'Entrar' : 'Criar Conta'}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-light mt-6">
          Aplicação para crianças com PEA · Projeto Académico
        </p>
      </motion.div>
    </div>
  );
}

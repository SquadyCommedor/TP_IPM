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
  EyeOff,
  Baby,
  Star,
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
        toast.success('Bem-vindo de volta!');
      } else {
        if (!userType) {
          toast.error('Escolhe quem és!');
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
        toast.success('Conta criada!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Ups! Algo correu mal');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !userType) {
      toast.error('Escolhe se és Pai/Mãe ou Criança!');
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
        {/* Logo e Mascote */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <img 
              src="https://thumbs.dreamstime.com/b/cartoon-boy-getting-haircut-female-hairdresser-hairdryer-comb-child-barber-cute-sits-chair-wearing-yellow-cape-415640394.jpg"
              alt="Mascote"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-kid-lg mx-auto"
            />
          </motion.div>
          <h1 className="font-comic font-bold text-3xl text-sky-500">
            O Meu Guia
          </h1>
          <p className="text-text-light mt-1 font-comic text-lg">do Cabeleireiro</p>
          <div className="flex justify-center gap-1 mt-2">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={16} className="text-peach-300 fill-peach-300" />
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-kid shadow-kid-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex p-2 bg-sky-50 m-4 rounded-2xl">
            <button
              onClick={() => { setMode('login'); setStep(1); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                mode === 'login' 
                  ? 'bg-white text-sky-500 shadow-sm' 
                  : 'text-text-light'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Heart size={16} />
                Entrar
              </div>
            </button>
            <button
              onClick={() => { setMode('register'); setStep(1); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                mode === 'register' 
                  ? 'bg-white text-sky-500 shadow-sm' 
                  : 'text-text-light'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles size={16} />
                Criar Conta
              </div>
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
                  <h2 className="font-comic font-bold text-2xl text-center mb-4 text-text">
                    Quem és tu?
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setUserType('parent')}
                      whileTap={{ scale: 0.95 }}
                      className={`p-5 rounded-2xl border-3 transition-all text-center ${
                        userType === 'parent'
                          ? 'border-lavender-400 bg-lavender-50 shadow-kid'
                          : 'border-gray-100 hover:border-sky-200'
                      }`}
                    >
                      <Shield size={40} className="mx-auto mb-3 text-lavender-400" />
                      <span className="font-comic font-bold text-lg">Sou Pai/Mãe</span>
                      <p className="text-xs text-text-light mt-1">Vou acompanhar o meu filho</p>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setUserType('child')}
                      whileTap={{ scale: 0.95 }}
                      className={`p-5 rounded-2xl border-3 transition-all text-center ${
                        userType === 'child'
                          ? 'border-sky-400 bg-sky-50 shadow-kid'
                          : 'border-gray-100 hover:border-sky-200'
                      }`}
                    >
                      <Baby size={40} className="mx-auto mb-3 text-sky-400" />
                      <span className="font-comic font-bold text-lg">Sou Criança</span>
                      <p className="text-xs text-text-light mt-1">Vou ao cabeleireiro!</p>
                    </motion.button>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleNext}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 bg-sky-400 text-white font-comic font-bold text-lg rounded-2xl flex items-center justify-center gap-2 hover:bg-sky-500 transition-colors shadow-kid"
                  >
                    Continuar
                    <ArrowRight size={20} />
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
                        <label className="text-sm font-bold text-text mb-2 block font-comic">
                          O teu nome
                        </label>
                        <div className="relative">
                          <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 bg-sky-50 rounded-2xl border-2 border-transparent focus:border-sky-300 focus:bg-white outline-none transition-all text-base"
                            placeholder="Escreve o teu nome"
                            required
                          />
                        </div>
                      </div>

                      {userType === 'child' && (
                        <>
                          <div>
                            <label className="text-sm font-bold text-text mb-2 block font-comic">
                              Quantos anos tens?
                            </label>
                            <div className="flex gap-2">
                              {[5,6,7,8,9,10,11,12].map(age => (
                                <motion.button
                                  key={age}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, age: age.toString() })}
                                  whileTap={{ scale: 0.9 }}
                                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                                    formData.age === age.toString()
                                      ? 'bg-peach-400 text-white shadow-kid'
                                      : 'bg-sky-50 text-text-light hover:bg-sky-100'
                                  }`}
                                >
                                  {age}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-bold text-text mb-2 block font-comic">
                              Email do Pai/Mãe
                            </label>
                            <div className="relative">
                              <Heart size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-lavender-300" />
                              <input
                                type="email"
                                value={formData.parentEmail}
                                onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-sky-50 rounded-2xl border-2 border-transparent focus:border-sky-300 focus:bg-white outline-none transition-all text-base"
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
                    <label className="text-sm font-bold text-text mb-2 block font-comic">
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-sky-50 rounded-2xl border-2 border-transparent focus:border-sky-300 focus:bg-white outline-none transition-all text-base"
                        placeholder="o.teu@email.pt"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-text mb-2 block font-comic">
                      Palavra-passe
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-12 pr-14 py-4 bg-sky-50 rounded-2xl border-2 border-transparent focus:border-sky-300 focus:bg-white outline-none transition-all text-base"
                        placeholder="Mínimo 6 letras"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-300 hover:text-sky-500"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 bg-gradient-to-r from-sky-400 to-mint-400 text-white font-comic font-bold text-lg rounded-2xl flex items-center justify-center gap-2 hover:shadow-kid-lg transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles size={24} />
                      </motion.div>
                    ) : (
                      <>
                        {mode === 'login' ? 'Entrar' : 'Criar Conta'}
                        <ArrowRight size={20} />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-6 font-comic">
          Aplicação para crianças com PEA · Projeto Académico
        </p>
      </motion.div>
    </div>
  );
}

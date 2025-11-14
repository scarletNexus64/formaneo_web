import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, FireIcon, SparklesIcon, BoltIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { LoginCredentials } from '../../types';
import toast from 'react-hot-toast';
import PublicNavigation from '../../components/PublicNavigation';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <PublicNavigation showFullMenu={true} />

      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-900/20 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100 via-transparent to-transparent dark:from-purple-900/20 opacity-40" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full relative"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 text-primary-700 dark:text-primary-300 px-3 sm:px-4 py-2 rounded-full mb-4 border border-primary-200 dark:border-primary-800"
              >
                <BoltIcon className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-semibold">Accès rapide à votre espace</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Bon retour !
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Connectez-vous pour accéder à vos formations
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  placeholder="vous@exemple.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Mot de passe requis',
                      minLength: {
                        value: 6,
                        message: 'Le mot de passe doit contenir au moins 6 caractères'
                      }
                    })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 bg-white dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Se souvenir de moi</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connexion...
                  </span>
                ) : (
                  'Se connecter'
                )}
              </motion.button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                Inscrivez-vous gratuitement
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              ← Retour à l'accueil
            </Link>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500 space-x-3">
            <Link to="/legal/terms-of-service" className="hover:text-blue-600 dark:hover:text-blue-400 underline">
              CGU
            </Link>
            <span>•</span>
            <Link to="/legal/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 underline">
              Politique de confidentialité
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

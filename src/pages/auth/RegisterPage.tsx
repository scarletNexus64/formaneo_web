import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, GiftIcon, SparklesIcon, FireIcon, ShieldCheckIcon, ArrowRightIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { RegisterData } from '../../types';
import { API_CONFIG } from '../../config/api.config';
import toast from 'react-hot-toast';
import PublicNavigation from '../../components/PublicNavigation';

const RegisterPage = () => {
  console.log('🎨 RegisterPage component loaded!');
  console.log('📍 Current API URL:', process.env.REACT_APP_API_URL);
  console.log('📍 API Config BASE_URL:', API_CONFIG.BASE_URL);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const referralCode = searchParams.get('ref');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterData>({
    defaultValues: {
      promo_code: referralCode || ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterData) => {
    console.log('🎯 RegisterPage.onSubmit called with:', data);
    console.log('📍 Current API URL:', process.env.REACT_APP_API_URL);

    try {
      console.log('📤 Sending registration request...');
      await registerUser(data);
      console.log('✅ Registration successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Registration failed in RegisterPage:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        data: error.response?.data,
        errors: error.response?.data?.errors
      });

      // Afficher les erreurs de validation spécifiques si elles existent
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          toast.error(`${field}: ${errors[field].join(', ')}`);
        });
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
      }
    }
  };

  const benefits = [
    { icon: <GiftIcon className="w-5 h-5" />, text: "Bonus de bienvenue de 2000 FCFA" },
    { icon: <CheckCircleIcon className="w-5 h-5" />, text: "5 quiz gratuits offerts" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <PublicNavigation showFullMenu={true} />

      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-50 via-transparent to-transparent dark:from-red-900/10 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gray-100 via-transparent to-transparent dark:from-gray-900/20 opacity-40" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl w-full mx-auto relative z-10"
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-gray-500/5 to-red-500/5 pointer-events-none" />
            <div className="text-center mb-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-gray-100 dark:from-red-900/20 dark:to-gray-900/30 text-red-700 dark:text-red-300 px-3 sm:px-4 py-2 rounded-full mb-4 border border-red-200 dark:border-red-800 shadow-sm"
              >
                <FireIcon className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-semibold">Rejoignez 12,547 étudiants</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-900 to-black dark:from-white dark:via-red-100 dark:to-gray-100 bg-clip-text text-transparent mb-2"
              >
                Créez votre compte
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 dark:text-gray-300"
              >
                Commencez votre aventure d'apprentissage aujourd'hui
              </motion.p>
            </div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-red-50 to-gray-50 dark:from-red-900/20 dark:to-gray-900/20 rounded-xl p-4 mb-6 border border-red-100 dark:border-red-800 shadow-sm relative z-10"
            >
              <p className="font-semibold text-red-900 dark:text-red-300 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5" />
                En vous inscrivant, vous obtenez :
              </p>
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center text-red-700 dark:text-red-400"
                  >
                    {benefit.icon}
                    <span className="ml-2 text-sm">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    {...register('name', {
                      required: 'Nom requis',
                      minLength: {
                        value: 3,
                        message: 'Le nom doit contenir au moins 3 caractères'
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                      <span className="text-xl">🇨🇲</span>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">+237</span>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                    </div>
                    <input
                      type="tel"
                      {...register('phone', {
                        required: 'Téléphone requis',
                        pattern: {
                          value: /^[0-9+\-\s]+$/,
                          message: 'Numéro de téléphone invalide'
                        }
                      })}
                      className="w-full pl-28 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                      placeholder="678 613 653"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                  )}
                </div>
              </div>

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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  placeholder="vous@exemple.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                          value: 8,
                          message: 'Le mot de passe doit contenir au moins 8 caractères'
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
                        }
                      })}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('password_confirmation', {
                        required: 'Confirmation requise',
                        validate: value => value === password || 'Les mots de passe ne correspondent pas'
                      })}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Code de parrainage (optionnel)
                </label>
                <input
                  type="text"
                  {...register('promo_code')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  placeholder="Code promo de votre parrain"
                />
                {referralCode && (
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                    Code de parrainage appliqué : {referralCode}
                  </p>
                )}
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-1 text-red-600 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 bg-white dark:bg-gray-700"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  J'accepte les{' '}
                  <Link to="/legal/terms-of-service" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link to="/legal/privacy-policy" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-red-600 to-gray-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Inscription...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlusIcon className="w-5 h-5" />
                    <span>Créer mon compte</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </span>
                )}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 relative z-10">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                Connectez-vous
              </Link>
            </p>

            {/* Security badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 relative z-10"
            >
              <ShieldCheckIcon className="w-4 h-4 text-green-500" />
              <span>Inscription sécurisée et cryptée</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center"
          >
            <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              ← Retour à l'accueil
            </Link>
          </motion.div>

          {/* <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500 space-x-3">
            <Link to="/legal/terms-of-service" className="hover:text-gray-900 dark:hover:text-blue-400 underline">
              CGU
            </Link>
            <span>•</span>
            <Link to="/legal/privacy-policy" className="hover:text-gray-900 dark:hover:text-blue-400 underline">
              Politique de confidentialité
            </Link>
          </div> */}
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;

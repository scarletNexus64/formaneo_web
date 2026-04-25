import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { RegisterData } from '../../types';
import toast from 'react-hot-toast';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const referralCode = searchParams.get('ref');

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<RegisterData>({
    defaultValues: {
      promo_code: referralCode || ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerUser(data);
      reset();
      onClose();
      navigate('/dashboard');
    } catch (error: any) {
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

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSwitchToLogin = () => {
    reset();
    onClose();
    onSwitchToLogin?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          static
          open={isOpen}
          onClose={handleClose}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center px-4 py-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-gray-200 dark:border-gray-700 my-4"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-red-900 to-black dark:from-white dark:via-red-100 dark:to-gray-100 bg-clip-text text-transparent mb-1">
                  Créez votre compte
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Bonus de 2000 FCFA + 5 quiz gratuits
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Téléphone
                    </label>
                    <div className="relative">
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                        <span className="text-sm">🇨🇲</span>
                        <span className="text-gray-600 dark:text-gray-400 text-xs">+237</span>
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
                        className="w-full pl-20 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                        placeholder="678 613 653"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                    placeholder="vous@exemple.com"
                  />
                  {errors.email && (
                    <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                          required: 'Mot de passe requis',
                          minLength: {
                            value: 8,
                            message: 'Min. 8 caractères'
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: 'Maj, min et chiffre requis'
                          }
                        })}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirmer
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('password_confirmation', {
                          required: 'Confirmation requise',
                          validate: value => value === password || 'Mots de passe différents'
                        })}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password_confirmation && (
                      <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">{errors.password_confirmation.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code de parrainage (optionnel)
                  </label>
                  <input
                    type="text"
                    {...register('promo_code')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                    placeholder="Code promo"
                  />
                  {referralCode && (
                    <p className="mt-0.5 text-xs text-green-600 dark:text-green-400">
                      Code appliqué : {referralCode}
                    </p>
                  )}
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="w-3.5 h-3.5 mt-0.5 text-red-600 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 bg-white dark:bg-gray-700"
                  />
                  <label className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                    J'accepte les{' '}
                    <Link
                      to="/legal/terms-of-service"
                      target="_blank"
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
                    >
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link
                      to="/legal/privacy-policy"
                      target="_blank"
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
                    >
                      politique de confidentialité
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-gray-900 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Inscription...
                    </>
                  ) : (
                    <>
                      Créer mon compte
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Déjà un compte ?{' '}
                  <button
                    onClick={handleSwitchToLogin}
                    className="font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    Connectez-vous
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  LifebuoyIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  SparklesIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import apiService from '../../services/api.service';
import settingsService from '../../services/settings.service';
import Navigation from '../../components/Navigation';
import toast from 'react-hot-toast';
import { ENDPOINTS } from '../../config/api.config';

const ProfilePage = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Support contact info
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Promo code editing states
  const [isEditingPromoCode, setIsEditingPromoCode] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeAvailability, setCodeAvailability] = useState<{ available: boolean; message: string; is_current?: boolean } | null>(null);
  const [isUpdatingCode, setIsUpdatingCode] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    loadSupportInfo();
  }, []);

  const loadSupportInfo = async () => {
    try {
      const [email, phone, whatsapp] = await Promise.all([
        settingsService.getSupportEmail(),
        settingsService.getSupportPhone(),
        settingsService.getWhatsAppNumber(),
      ]);
      setSupportEmail(email);
      setSupportPhone(phone);
      setWhatsappNumber(whatsapp);
    } catch (error) {
      console.error('Error loading support info:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.put('/auth/profile', formData);

      if (response.data.success) {
        updateProfile(response.data.user);
        setIsEditing(false);
        toast.success('Profil mis à jour avec succès !');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de la mise à jour du profil';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  const handleContactWhatsApp = () => {
    if (!whatsappNumber) {
      toast.error('Numéro WhatsApp non disponible');
      return;
    }

    const message = `Bonjour, je suis ${user?.name} (${user?.email}). J'ai besoin d'aide concernant mon compte.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^\d+]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleContactEmail = () => {
    if (!supportEmail) {
      toast.error('Email de support non disponible');
      return;
    }

    const subject = encodeURIComponent('Demande de support - Formaneo');
    const body = encodeURIComponent(
      `Bonjour,\n\nJe suis ${user?.name}\nEmail: ${user?.email}\nCode promo: ${user?.promo_code}\n\nMa demande:\n\n`
    );
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  // Fonction pour vérifier la disponibilité du code promo
  const checkPromoCode = async (code: string) => {
    if (!code || code.length < 3) {
      setCodeAvailability(null);
      return;
    }

    try {
      setIsCheckingCode(true);
      const response = await apiService.post(ENDPOINTS.AFFILIATE.CHECK_PROMO_CODE, {
        promo_code: code
      });
      setCodeAvailability(response.data);
    } catch (error: any) {
      setCodeAvailability({
        available: false,
        message: error.response?.data?.message || 'Erreur lors de la vérification'
      });
    } finally {
      setIsCheckingCode(false);
    }
  };

  // Fonction pour mettre à jour le code promo
  const handleUpdatePromoCode = async () => {
    if (!newPromoCode || newPromoCode.length < 3) {
      toast.error('Le code promo doit contenir au moins 3 caractères');
      return;
    }

    if (!codeAvailability?.available || codeAvailability?.is_current) {
      toast.error('Veuillez choisir un code promo disponible');
      return;
    }

    try {
      setIsUpdatingCode(true);
      const response = await apiService.put(ENDPOINTS.AFFILIATE.UPDATE_PROMO_CODE, {
        promo_code: newPromoCode
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Mettre à jour l'utilisateur dans le store
        if (user) {
          updateProfile({ ...user, promo_code: newPromoCode });
        }
        setIsEditingPromoCode(false);
        setNewPromoCode('');
        setCodeAvailability(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du code promo');
    } finally {
      setIsUpdatingCode(false);
    }
  };

  // Gérer le changement du code promo avec debounce
  useEffect(() => {
    if (isEditingPromoCode && newPromoCode) {
      const timer = setTimeout(() => {
        checkPromoCode(newPromoCode);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [newPromoCode, isEditingPromoCode]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non disponible';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getAccountStatus = () => {
    if (!user) return { text: 'Inconnu', color: 'gray', icon: ShieldCheckIcon, description: '' };

    const status = user.account_status as 'pending_payment' | 'active' | 'expired' | 'suspended' | 'inactive';

    switch (status) {
      case 'active':
        return {
          text: 'Actif',
          color: 'green',
          icon: CheckCircleIcon,
          description: user.account_expires_at
            ? `Expire le ${new Date(user.account_expires_at).toLocaleDateString('fr-FR')}`
            : 'Compte actif'
        };
      case 'pending_payment':
        return {
          text: 'En attente d\'activation',
          color: 'yellow',
          icon: SparklesIcon,
          description: 'Activez votre compte pour débloquer toutes les fonctionnalités'
        };
      case 'expired':
        return {
          text: 'Expiré',
          color: 'red',
          icon: XCircleIcon,
          description: 'Renouvelez votre abonnement pour continuer'
        };
      case 'suspended':
        return {
          text: 'Suspendu',
          color: 'red',
          icon: XCircleIcon,
          description: user.deactivation_reason === 'admin_action'
            ? 'Compte suspendu par l\'administrateur - Contactez le support'
            : 'Compte suspendu - Contactez le support'
        };
      case 'inactive':
        return {
          text: 'Inactif',
          color: 'yellow',
          icon: SparklesIcon,
          description: 'Activez votre compte pour accéder aux fonctionnalités'
        };
      default:
        return { text: 'Inconnu', color: 'gray', icon: ShieldCheckIcon, description: '' };
    }
  };

  const accountStatus = getAccountStatus();
  const StatusIcon = accountStatus.icon;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <UserCircleIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Mon Profil
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Gérez vos informations personnelles et contactez le support
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Account Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                    Informations personnelles
                  </h2>
                  {!isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                    >
                      Modifier
                    </motion.button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom complet
                      </label>
                      <div className="relative">
                        <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Téléphone
                      </label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Annuler
                      </motion.button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                        <UserCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Nom complet</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                        <EnvelopeIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Email</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white break-all">{user?.email}</p>
                      </div>
                    </div>

                    {user?.phone && (
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                        <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                          <PhoneIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Téléphone</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">{user.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Account Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                  Informations du compte
                </h2>

                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 rounded-xl border border-red-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-red-700 dark:text-red-300 font-medium">Code promo</p>
                      {!isEditingPromoCode && (
                        <button
                          onClick={() => {
                            setIsEditingPromoCode(true);
                            setNewPromoCode(user?.promo_code || '');
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center text-xs"
                        >
                          <PencilIcon className="w-3 h-3 mr-1" />
                          Modifier
                        </button>
                      )}
                    </div>

                    {!isEditingPromoCode ? (
                      <p className="text-xl font-mono font-bold text-red-600 dark:text-red-400">
                        {user?.promo_code}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={newPromoCode}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                              if (value.length <= 20) {
                                setNewPromoCode(value);
                              }
                            }}
                            placeholder="Nouveau code"
                            className="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-mono text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                          {isCheckingCode && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Vérification...
                            </p>
                          )}
                          {codeAvailability && !isCheckingCode && (
                            <p className={`text-xs ${
                              codeAvailability.available
                                ? codeAvailability.is_current
                                  ? 'text-gray-600 dark:text-gray-400'
                                  : 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {codeAvailability.message}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={handleUpdatePromoCode}
                              disabled={isUpdatingCode || !codeAvailability?.available || codeAvailability?.is_current || isCheckingCode}
                              className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isUpdatingCode ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <button
                              onClick={() => {
                                setIsEditingPromoCode(false);
                                setNewPromoCode('');
                                setCodeAvailability(null);
                              }}
                              disabled={isUpdatingCode}
                              className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs font-medium flex items-center"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2">
                          <p className="text-xs text-blue-800 dark:text-blue-300">
                            3-20 caractères alphanumériques uniquement
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                      <StatusIcon className={`w-5 h-5 text-${accountStatus.color}-600 dark:text-${accountStatus.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Statut du compte</p>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-${accountStatus.color}-100 dark:bg-${accountStatus.color}-900/30 text-${accountStatus.color}-700 dark:text-${accountStatus.color}-400`}>
                          {accountStatus.text}
                        </span>
                      </div>
                      {accountStatus.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {accountStatus.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {user?.account_activated_at && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Compte activé le</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatDate(user.account_activated_at)}
                        </p>
                      </div>
                    </div>
                  )}

                  {user?.account_expires_at && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expire le</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatDate(user.account_expires_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Support Contact */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-2xl shadow-xl p-6 text-white sticky top-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <LifebuoyIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Support Client</h2>
                    <p className="text-sm text-red-100">Nous sommes là pour vous aider</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* WhatsApp Contact */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContactWhatsApp}
                    className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 p-4 rounded-xl transition-all border border-white/20 hover:border-white/40 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 rounded-lg group-hover:bg-green-600 transition-colors">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs text-red-100 mb-1">WhatsApp</p>
                        <p className="font-semibold text-sm">{whatsappNumber || 'Chargement...'}</p>
                      </div>
                    </div>
                  </motion.button>

                  {/* Email Contact */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContactEmail}
                    className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 p-4 rounded-xl transition-all border border-white/20 hover:border-white/40 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg group-hover:bg-gray-900 transition-colors">
                        <EnvelopeIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs text-red-100 mb-1">Email</p>
                        <p className="font-semibold text-sm break-all">{supportEmail || 'Chargement...'}</p>
                      </div>
                    </div>
                  </motion.button>

                  {/* Phone Contact */}
                  {supportPhone && (
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500 rounded-lg">
                          <PhoneIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-xs text-red-100 mb-1">Téléphone</p>
                          <a href={`tel:${supportPhone}`} className="font-semibold text-sm hover:underline">
                            {supportPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <p className="text-xs text-red-100 leading-relaxed">
                    Notre équipe est disponible pour répondre à toutes vos questions et vous accompagner dans votre parcours de formation.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
